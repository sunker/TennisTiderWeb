const MyCourtClient = require('./myCourtClient.js'),
    q = require('q'),
    Slot = require('../models/Slot.js'),
    webdriver = require('selenium-webdriver');

let config = require('../config.json');

const myCourtService = {};
let result = [];
let slots = [];

const initDriver = () => {
    try {
        myCourtService.driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();
    } catch (error) {
        console.log(error);
    }
};

const scrapeDays = (client, targets, club) => {
    const defer = q.defer();
    if (targets.length > 0) {
        let target = targets.shift();
        setTimeout(() => {
            client.scrapeDay(target.timestampFormatted).then((slots) => {
                console.log('MyCourt ' + target.timestamp);
                slots.map(slot => {
                    result.push(createSlot(slot, target.timestamp, club));
                });
                scrapeDays(client, targets, club).then((result) => {
                    defer.resolve(result);
                });
            }, (error) => { //on error
                scrapeDays(client, targets, club).then((result) => {
                    defer.resolve(result);
                });
            });
        }, 1000);
    } else {
        defer.resolve(result);
    }
    return defer.promise;
};

const getDaysAhead = () => {
    const result = [];
    let currentDate = new Date();
    for (var index = 0; index < config.endpoints.myCourt.daysAhead; index++) {
        var timestamp = new Date(currentDate.getTime());
        result.push({
            'timestamp': timestamp,
            'timestampFormatted': timestamp.toISOString().slice(8, 10)
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
};

const scrapeClubsRecursively = (myCourtclient, clubs) => {
    const defer = q.defer();
    if (clubs.length > 0) {
        let target = clubs.shift();
        myCourtclient.openClubPage(target.myCourtClubId).then(() => {
            scrapeDays(myCourtclient, getDaysAhead(), target).then((result) => {
                slots = slots.concat(result);
                scrapeClubsRecursively(myCourtclient, clubs).then(() => defer.resolve(slots));
            }, () => defer.resolve());
        });
    } else {
        defer.resolve(slots);
    }
    return defer.promise;
};

myCourtService.getSlots = () => {
    const defer = q.defer();
    if (!config.endpoints.myCourt.include) return defer.resolve([]);
    if (!myCourtService.driver) initDriver();

    slots = result = [];
    config = require('../config.json');

    var myCourtclient = new MyCourtClient(config.endpoints.myCourt, myCourtService.driver);
    myCourtclient.logIn(config.endpoints.myCourt.loginUrl).then(() => {
        scrapeClubsRecursively(myCourtclient, _.clone(config.endpoints.myCourt.clubs)).then((result) => {
            defer.resolve(result);
        }, () => defer.resolve());
    }, () => defer.resolve());

    return defer.promise;
};

const createSlot = (parseData, timestamp, club) => {
    let surface = 'hardcourt';
    //TODO: Calculate price
    return new Slot(club.id, club.name, timestamp.getTime(), parseData.timeSlot, parseData.courtNumber, surface, 0, club.bookingUrl);
};

module.exports = myCourtService;
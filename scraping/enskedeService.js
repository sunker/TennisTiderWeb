const EnskedeClient = require('./enskedeClient.js'),
    q = require('q'),
    config = require('../config.json'),
    Slot = require('../models/Slot.js'),
    webdriver = require('selenium-webdriver');

const enskedeService = {};
let result = [];

const initDriver = () => {
    try {
        enskedeService.driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();
    } catch (error) {
        console.log(error);
    }
};

this.result = [];
const scrapeDays = (client, url, targets) => {
    const defer = q.defer();
    if (targets.length > 0) {
        let target = targets.shift();
        setTimeout(() => {
            client.scrapeDay(target.elementId).then((slots) => {
                console.log('Enskede ' + target.timestamp);
                slots.map(slot => {
                    result.push(createSlot(slot, target.timestamp, config.endpoints.enskede));
                });
                scrapeDays(client, url, targets).then((result) => {
                    defer.resolve(result);
                });
            }, (error) => { //on error
                scrapeDays(client, url, targets).then((result) => {
                    defer.resolve(result);
                });
            });
        }, 5000);
    } else {
        defer.resolve(result);
    }
    return defer.promise;
};

const getTargets = (dayElementsIds) => {
    let result = [];
    let currentDate = new Date();
    dayElementsIds.forEach(x => {
        var timestamp = new Date(currentDate.getTime());
        result.push({
            'timestamp': timestamp,
            'elementId': x
        });
        currentDate.setDate(currentDate.getDate() + 1);
    });

    return result;
};

enskedeService.getSlots = () => {
    const defer = q.defer();
    if (!config.endpoints.enskede.include) return defer.resolve([]);

    if (!enskedeService.driver) initDriver();

    result = [];
    var enskedeClient = new EnskedeClient(config.endpoints.enskede.baseUrl, config.endpoints.enskede, enskedeService.driver);
    enskedeClient.loadSessionUrl().then((url) => {
        enskedeClient.openSession(url).then((dayElementsIds) => {
            scrapeDays(enskedeClient, url, getTargets(dayElementsIds)).then((result) => {
                defer.resolve(result);
            });
        }, () => defer.resolve());
    }, () => defer.resolve());

    return defer.promise;
};

const createSlot = (parseData, timestamp, club) => {
    let surface = 'grus';
    if (parseData.courtNumber === 1 || parseData.courtNumber === 2) {
        surface = 'inomhusgrus';
    } else if (parseData.courtNumber > 30 && parseData.courtNumber < 36) {
        surface = 'hardcourt';
    }

    //TODO: Calculate price
    return new Slot(club.id, club.name, timestamp.getTime(), parseData.timeSlot, parseData.courtNumber, surface, 0, club.bookingUrl);
};

module.exports = enskedeService;
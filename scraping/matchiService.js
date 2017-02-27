const config = require('../config.json'),
    q = require('q'),
    Slot = require('../models/Slot.js'),
    settings = require('../settings'),
    MatchiClient = require('./matchiClient.js'),
    ScraperHelper = require('./scraperHelper.js');

const matchiService = {};

let result = [];

const scrapeUrls = (targets) => {
    const defer = q.defer();
    if (targets.length > 0) {
        let target = targets.shift();
        let matchiClient = new MatchiClient(target.url);
        setTimeout(() => {
            matchiClient.scrape().then((slots) => {
                console.log(`${target.name}: ${slots.length} slots, ${target.url}`);
                slots.map(slot => {
                    result.push(createSlot(slot, target));
                });
                scrapeUrls(targets).then((result) => {
                    defer.resolve(result);
                });
            }, () => { //on error
                console.log(`${target.name}: no slots found, ${target.url}`);
                scrapeUrls(targets).then((result) => {
                    defer.resolve(result);
                });
            });
        }, ScraperHelper.randomIntFromInterval(settings.minDelay, settings.maxDelay));
    } else {
        defer.resolve(result);
    }
    return defer.promise;
};

const getAllTargetsToRequest = () => {
    var urls = [];
    config.endpoints.matchi.filter(club => club.include).forEach((club) => {
        urls = urls.concat(ScraperHelper.getUrlsForNoOfDaysAhead(club.url, club.daysAhead, club.name, club.id));
    });
    return urls;
};

matchiService.getSlots = () => {
    const defer = q.defer();
    var targets = getAllTargetsToRequest();

    scrapeUrls(targets).then((slots) => {
        defer.resolve(slots);
        console.log(`${slots.length} matchi slots found`);
    }, () => {
        defer.resolve();
    });

    return defer.promise;
};

const createSlot = (parseData, club) => {
    let surface = 'hardcourt';
    if (parseData.courtNumber > 5) {
        surface = 'grus';
    }

    //TODO: Calculate price
    return new Slot(club.clubId, club.name, club.timestamp.getTime(), parseData.timeSlot, parseData.courtNumber, surface, 0, club.url);
};

module.exports = matchiService;
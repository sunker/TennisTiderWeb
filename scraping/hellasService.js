const HellasClient = require('./hellasClient.js'),
    q = require('q'),
    config = require('../config.json'),
    settings = require('../settings'),
    Slot = require('../models/Slot.js'),
    ScraperHelper = require('./scraperHelper.js');

const hellasService = {};

let result = [];

const scrapeUrls = (targets) => {
    const defer = q.defer();
    if (targets.length > 0) {
        let target = targets.shift();
        let hellasClient = new HellasClient(target.url);
        setTimeout(() => {
            hellasClient.scrape().then((slots) => {
                console.log(target.url);
                slots.map(slot => {
                    result.push(createSlot(slot, target.timestamp, config.endpoints.hellas));
                });
                scrapeUrls(targets).then((result) => {
                    defer.resolve(result);
                });
            }, (error) => { //on error
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

hellasService.getSlots = () => {
    const defer = q.defer();
    if (!config.endpoints.hellas.include) return defer.resolve([]);
    let targets = ScraperHelper.getUrlsForNoOfDaysAhead(config.endpoints.hellas.url, config.endpoints.hellas.daysAhead, config.endpoints.hellas.name);

    scrapeUrls(targets).then((slots) => {
        defer.resolve(slots);
        console.log(`${slots.length} Hellas slots found`);
    }, () => defer.resolve([]));

    return defer.promise;
};

const createSlot = (parseData, timestamp, club) => {
    let surface = 'hardcourt';
    if (parseData.courtNumber > 6) {
        surface = 'grus';
    }

    //TODO: Calculate price
    return new Slot(1, club.name, timestamp.getTime(), parseData.timeSlot, parseData.courtNumber, surface, 0, parseData.link);
};

module.exports = hellasService;
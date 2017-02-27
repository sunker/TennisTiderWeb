const q = require('q'),
    mongoose = require('mongoose'),
    SlotsCache = mongoose.model('SlotsCache'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    hellasService = require('./hellasService.js'),
    matchiService = require('./matchiService.js'),
    SlotCollection = require('../models/SlotCollection');

let instance;

const scraper = function () {
    const self = this;

    this.getSlots = () => {
        const defer = q.defer();

        SlotsCache.getCurrent().then((slots) => {
            defer.resolve(slots);
        });

        return defer.promise;
    };

    this.init = () => {
        scrapeAll();
    };

    const scrapeAll = () => {
        const defer = q.defer();
        console.log('New scraping session started');

        var hellasPromise = hellasService.getSlots();
        var matchiPromise = matchiService.getSlots();

        Promise.all([hellasPromise, matchiPromise])
            .then(function (slots) {
                    let flattenedSlots = ([].concat.apply([], slots)).filter(x => x !== undefined);
                    flattenedSlots = _.uniq(flattenedSlots, (x) => x.getKey());
                    const slotCollection = new SlotCollection(flattenedSlots);
                    self.emit('slotsLoaded', slotCollection);
                    defer.resolve(slotCollection);
                    SlotsCache.update(flattenedSlots);
                    console.log(`${flattenedSlots.length} total slots found`);
                    scrapeAll();
                },
                (error) => {
                    console.log('There was an error scraping: ' + error);
                    scrapeAll();
                })
            .catch(function (error) {
                console.log(error);
                scrapeAll();
            });

        return defer.promise;
    };
};


util.inherits(scraper, EventEmitter);

module.exports = {
    getInstance: function () {
        return instance || (instance = new scraper());
    }
};
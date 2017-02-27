const cheerio = require('cheerio'),
    q = require('q'),
    BaseClient = require('./baseClient'),
    selectors = require('../config.json').endpoints.hellas.selectors,
    TimeSlot = require('../models/TimeSlot');

module.exports = class HellasClient extends BaseClient {
    constructor(url) {
        super(url);
    }

    scrape() {
        const defer = q.defer();
        super.requestUrl().then((html) => {
            var result = this._parse(cheerio.load(html));
            if (result && result.length > 0) {
                return defer.resolve(result);
            } else {
                return defer.reject();
            }
        }, (error) => {
            console.log('There was an error in Hellas client' + error);
            return defer.reject();
        });

        return defer.promise;
    }

    _getLink($, element) {
        try {
            var aElement = $(element).html();
            const start = aElement.indexOf('href="') + 'href="'.length;
            const end = aElement.indexOf('"', start + 1);
            return ('http://www.commodusnet.net/kund/' + aElement.substring(start, end)).replace('//', '/');
        } catch (error) {
            console.log('Could not parse link from hellas day');
            return 'unknown date';
        }
    }

    _parse($) {
        try {
            let day = {};
            var self = this;
            $(selectors.root).filter(function () {
                var element = $(this);
                var time = $(selectors.time, element).html();
                element.children().each((columnIndex, activitySelctor) => {
                    var activityValue = $(selectors.activity, activitySelctor).html();
                    if (activityValue && activityValue.toLowerCase() === 'boka') {
                        var court = $(selectors.court.replace('[columnIndex]', columnIndex)).html(),
                            startTime = time.split('-')[0],
                            endTime = time.split('-')[1],
                            key = time + '-' + court,
                            url = self._getLink($, activitySelctor);

                        if (!day.hasOwnProperty(key)) {
                            day[key] = {
                                timeSlot: new TimeSlot(Number(startTime.replace(':', '.')), Number(endTime.replace(':', '.'))),
                                courtNumber: Number(court.toLowerCase().replace('bana', '').trim()),
                                link: url.replace(/&amp;/g, '&'),
                            };
                        }
                    }
                });
            });

            return Object.keys(day).map(key => day[key]);
        } catch (error) {
            console.log('There was an error scraping ' + this.url ? this.url : '');
            return;
        }
    }
};
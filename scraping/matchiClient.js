const cheerio = require('cheerio'),
    q = require('q'),
    BaseClient = require('./baseClient'),
    TimeSlot = require('../models/TimeSlot');

module.exports = class MatchiClient extends BaseClient {
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
            console.log('There was an error in Match Client' + error);
            return defer.reject();
        });

        return defer.promise;
    }

    _parse($) {
        try {
            let day = {};
            $('[class="slot free"]').filter(function () {
                var element = $(this);
                const titleArray = element.attr('title').split('<br>'),
                    court = titleArray[1],
                    time = titleArray[2],
                    startTime = time.split('-')[0].trim(),
                    endTime = time.split('-')[1].trim(),
                    key = startTime + '-' + endTime + '-' + court;


                if (titleArray[0].toLowerCase() === 'ledig' && !day.hasOwnProperty(key)) {
                    day[key] = {
                        timeSlot: new TimeSlot(Number(startTime.replace(':', '.')), Number(endTime.replace(':', '.'))),
                        courtNumber: Number(court.toLowerCase().replace('bana', '').trim())
                    };
                }
            });

            return Object.keys(day).map(key => day[key]);
        } catch (error) {
            console.log('There was an error scraping ' + this.url ? this.url : '');
            return;
        }
    }
};
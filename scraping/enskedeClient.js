const cheerio = require('cheerio'),
    TimeSlot = require('../models/TimeSlot'),
    webdriver = require('selenium-webdriver'),
    until = webdriver.until;
    
module.exports = class EnskedeClient {
    constructor(url, config, driver) {
        this.url = url;
        this.config = config;
        this.driver = driver;
    }

    scrapeDay(selector) {
        return new Promise((resolve, reject) => {
            try {
                this.driver.findElement(webdriver.By.id(selector)).click().then(() => {
                    this.driver.wait(until.elementLocated(webdriver.By.id(this.config.tableContainerSelectorId)), 2000).then(() => {
                        var self = this;
                        setTimeout(function () {
                            self.driver.findElement(webdriver.By.id(self.config.tableContainerSelectorId)).getAttribute('innerHTML').then((html) => {
                                resolve(self._parse(cheerio.load(html)));
                            });
                        }, 1000);
                    });
                });
            } catch (error) {
                console.log('There was an error locating selector: ' + error);
                reject();
            }
        });
    }

    openSession(url) {
        return new Promise((resolve, reject) => {
            this.driver.get(url).then(() => {
                this.driver.wait(until.elementLocated(webdriver.By.id(this.config.tennisButtonSelectorId)), 2000).then(() => {
                    this.driver.findElement(webdriver.By.id(this.config.tennisButtonSelectorId)).click();
                    this.driver.wait(until.elementLocated(webdriver.By.id(this.config.tableContainerSelectorId)), 2000).then(() => {
                        this.driver.findElements(webdriver.By.className('ResBookDateButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only')).then((elements) => {
                            var promises = elements.map((element) => element.getAttribute('id'));
                            Promise.all(promises).then((values) => {
                                resolve(values);
                            });
                        });
                    });
                });
            });
        });
    };

    loadSessionUrl() {
        return new Promise((resolve, reject) => {
            this.driver.get(this.config.baseUrl).then((a) => {
                this.driver.wait(until.elementLocated(webdriver.By.id(this.config.formSelectorId)), 2000).then(() => {
                    this.driver.findElement(webdriver.By.id(this.config.formSelectorId)).getAttribute('action').then((action) => {
                        resolve(action);
                    });
                });
            });
        });
    };

    _parseCourtNumber(element, $) {
        try {
            var columnId = element.closest('td').index();
            var columnHeader = $('[class="ResBookTableRowHeader"]').children()[columnId];
            return $('span', columnHeader).html().replace(' Tennis', '');
        } catch (error) {
            console.log('Could not parse court number from enskede day');
            return 'unknown courtnumber';
        }
    }

    _parseDate(element) {
        try {
            const href = element.attr('href');
            const start = href.indexOf('DATEHR=') + 'DATEHR='.length;
            return href.substring(start, start + 10);
        } catch (error) {
            console.log('Could not parse date from enskede day');
            return 'unknown date';
        }
    }

    _parse($) {
        var self = this;
        try {
            let day = {};
            $('[class="ResBookSchemaTableBookButton"]').filter(function () {
                var element = $(this);
                let court = self._parseCourtNumber(element, $),
                    date = self._parseDate(element);

                const time = element.html().replace('Boka ', '').replace(':', '-'),
                    startTime = time.trim(),
                    key = startTime + '-' + court;

                if (!day.hasOwnProperty(key)) {
                    day[key] = {
                        timeSlot: new TimeSlot(Number(startTime.replace('-', '.'))),
                        courtNumber: Number(court.toLowerCase().replace('bana', '').trim()),
                        date: date
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
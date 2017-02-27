const cheerio = require('cheerio'),
    TimeSlot = require('../models/TimeSlot'),
    webdriver = require('selenium-webdriver'),
    until = webdriver.until;

module.exports = class MyCourtClient {
    constructor(config, driver) {
        this.config = config;
        this.driver = driver;
    }

    scrapeDay(formattedDate) {
        return new Promise((resolve, reject) => {
            try {
                this.driver.findElement(webdriver.By.xpath("//*[@class='dayNumber' and text() = '" + formattedDate + "']")).then((element) => {
                    if (element) {
                        element.click().then(() => {
                            var self = this;
                            setTimeout(() => {
                                this.driver.getPageSource().then((html) => {
                                    resolve(self._parse(cheerio.load(html)));
                                });;
                            }, 2000);
                        });
                    } else {
                        console.log('There was an error locating mycourt selector: ' + formattedDate);
                        reject();
                    }
                });
            } catch (error) {
                console.log('There was an error locating selector: ' + error);
                reject();
            }
        });
    }

    openClubPage(clubId) {
        return new Promise((resolve, reject) => {
            this.driver.get(this.config.startPage).then(() => {
                setTimeout(() => {
                    this.driver.executeScript('go_to_club(' + clubId + ',"sp",0)').then(() => {
                        setTimeout(() => resolve(), 2000);
                    });
                }, 2000);
            });
        });
    }

    logIn(url) {
        return new Promise((resolve, reject) => {
            try {
                this.driver.get(url).then(() => {
                    this.driver.findElements(webdriver.By.className(this.config.loginClasSelector)).then((elements) => {
                        if (elements.length > 0) {
                            elements[0].click().then(() => {
                                this.driver.wait(until.elementLocated(webdriver.By.id('email')), 3000).then(() => {
                                    setTimeout(() => {
                                        this.driver.findElement(webdriver.By.id('email')).sendKeys(this.config.email);
                                        this.driver.findElement(webdriver.By.id('password')).sendKeys(this.config.password);

                                        this.driver.findElements(webdriver.By.name('agree_terms_conditions')).then((elements) => {
                                            elements.forEach((element) => {
                                                var elem = element;
                                                element.getAttribute('type').then((value) => {
                                                    if (value && value.toLowerCase() === 'checkbox') {
                                                        this.driver.executeScript('arguments[0].setAttribute(\'checked\', \'checkeed\')', elem);
                                                    }
                                                });
                                            });
                                        });
                                        setTimeout(() => {
                                            this.driver.findElements(webdriver.By.className('button primary-button track-event')).then((elements) => {
                                                elements.forEach((element) => {
                                                    element.getAttribute('value').then((value) => {
                                                        if (value && value.toLowerCase() === 'logga in') {
                                                            element.click().then(() => {
                                                                resolve();
                                                            });
                                                        }
                                                    });
                                                });
                                            });
                                        }, 2000);
                                    }, 2000);
                                });
                            });
                        } else {
                            //Already logged in
                            this.driver.get(this.config.startPage).then(() => {
                                reject();
                            });
                        }
                    });
                });
            } catch (error) {
                console.log('There was an error logging in to mycourt: ' + error);
                reject();
            }
        });
    }

    _parseCourtNumber(element, $) {
        try {
            var columnId = element.closest('td').index();
            var columnHeader = $('[class="tableFloatingHeader"]').children()[columnId];
            return $('div', columnHeader).html().replace('Bana ', '');
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
            $('td.active ').each(function () {
                var element = $(this);

                const time = element.attr('court_time'),
                    startTime = time.split('-')[0],
                    endTime = time.split('-')[1],
                    court = self._parseCourtNumber(element, $),
                    key = startTime + '-' + endTime + '-' + court;

                if (!day.hasOwnProperty(key)) {
                    day[key] = {
                        timeSlot: new TimeSlot(Number(startTime), Number(endTime)),
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
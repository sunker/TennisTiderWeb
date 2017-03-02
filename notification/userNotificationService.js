const config = require('../config.json'),
    q = require('q'),
    Slot = require('../models/Slot.js'),
    mongoose = require('mongoose'),
    a = require('../models/Notification'),
    Mail = require('../models/Mail'),
    User = mongoose.model('user'),
    Notification = mongoose.model('notification'),
    userSlotFilter = require('./userSlotFilter'),
    mailClient = require('./mailClient'),
    Scraper = require('../scraping/scraper'),
    SlotCollection = require('../models/SlotCollection');

const scraper = Scraper.getInstance();
var userNotificationService = {};

userNotificationService.notifyUsers = (slots) => {
    User.getAll().then((users) => {
        users.filter(x => x.active).forEach((user) => {
            userNotificationService.notifyUser(user, slots, false);
        });
    });
};

userNotificationService.notifyUser = (user, slots, force) => {
    return new Promise((resolveOuter, reject) => {
        try {
            const isWeeklyReport = user.sendWeeklyReport();
            if (isWeeklyReport) user.saveWeeklyReport();
            let slotsOfInterest = userSlotFilter.filterSlots(user, slots);
            let slotsToBroadcastPromises = slotsOfInterest.map(slot => {
                return new Promise((resolve, reject) => {
                    let key = slot.getKey(user.email);
                    if (force || isWeeklyReport) {
                        resolve({
                            key: key,
                            slot: slot
                        });
                    } else {
                        Notification.containsKey(key).then((containsKey) => {
                            if (!containsKey) {
                                resolve({
                                    key: key,
                                    slot: slot
                                });
                            } else {
                                resolve(undefined);
                            }
                        });
                    }
                });

            });
            Promise.all(slotsToBroadcastPromises).then(function (slots) {
                    if (slots.length === 0) resolveOuter();
                    slots = slots.filter(x => x);
                    const slotCollection = new SlotCollection(slots);
                    slots = _.uniq(slots, (x) => x.slot.getKey());

                    if (!isWeeklyReport && !force) {
                        slots = slots.filter(slot => userSlotFilter.isPrimeTime(slot.slot));
                    }

                    if (slots.length === 0) return;
                    let mail = new Mail(slots.map(x => x.slot), user.email, force);
                    mailClient.sendEmail(mail).then(() => {
                            slotCollection.uniqueSlotKeys.forEach((key) => {
                                Notification.containsKey(key).then((containsKey) => {
                                    if (!containsKey) {
                                        var notification = new Notification();
                                        notification.key = key;
                                        notification.timestamp = new Date();
                                        Notification.add(notification).then(() => {
                                            console.log('Notification saved');
                                        });
                                    }
                                });
                            });
                            resolveOuter();
                        }, (error) => {
                            console.log('. Key not saved');
                            resolveOuter();
                        })
                        .catch(function (error) {
                            console.log('Could not send email');
                            resolveOuter();
                        });
                })
                .catch(function (error) {
                    console.log(error);
                    resolveOuter();
                });

        } catch (error) {
            console.log('error:' + error)
        }
    });
};

scraper.on('slotsLoaded', (slotCollection) => {
    var time = new Date().getHours();
    if (time > 7 && time < 23) {
        userNotificationService.notifyUsers(slotCollection.slots);
    }
});

module.exports = userNotificationService;
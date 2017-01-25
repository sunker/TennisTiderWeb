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
    SlotCollection = require('../models/SlotCollection');

var userNotificationService = {};

userNotificationService.notifyUsers = (slots) => {
    User.getAll().then((users) => {
        users.filter(x => x.active).forEach((user) => {
            this.notifyUser(user, slots, false);
        });
    });
};

userNotificationService.notifyUser = (user, slots, force) => {
    return new Promise((resolveOuter, reject) => {
        let isWeeklyReport;
        if (!force) {
            isWeeklyReport = user.sendWeeklyReport();
            if (isWeeklyReport) user.saveWeeklyReport();
        }
        let slotsOfInterest = userSlotFilter.filterSlots(user, slots);
        let slotsToBroadcastPromises = slotsOfInterest.map(slot => {
            return new Promise((resolve, reject) => {
                let key = slot.getKey(user.email);
                if (isWeeklyReport || force) {
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
                const slotCollection = new SlotCollection(slots);
                slots = slots.filter(x => x);

                if (!isWeeklyReport) {
                    slots = slots.filter(slot => userSlotFilter.isPrimeTime(slot.slot));
                }

                if (slots.length === 0) return;
                let mail = new Mail(slots.map(x => x.slot), user.email, isWeeklyReport);
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
                        console.log('Duplicate key. Key mot saved');
                        reject();
                    })
                    .catch(function (error) {
                        console.log('Could not send email');
                        reject();
                    });
            })
            .catch(function (error) {
                console.log(error);
                reject();
            });
    });
};
module.exports = userNotificationService;
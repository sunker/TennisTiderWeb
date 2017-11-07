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

userNotificationService.sendEmail = async (slots, email) => {
    return new Promise(async (resolve, reject) => {
        let mail = new Mail(slots, email, true)
        mailClient.sendEmail(mail).then(() => {
            console.log(`Mail sent to: ${email}`)
            resolve()
        }).catch(err => {
            console.log(`Could not send mail to: ${email}. Error: ${err}`)
            reject()
        })
    })
},

    userNotificationService.notifyUser = (user, slots, force) => {
        return new Promise(async (resolve, reject) => {
            console.log('Time:', new Date().getHours())
            let slotsOfInterest = userSlotFilter.filterSlots(user, slots)
            userNotificationService.sendEmail(slotsOfInterest, user.email).then(async () => resolve(), () => reject())
        });
    };

scraper.on('slotsLoaded', (slotCollection) => {
    var time = new Date().getHours();
    if (time > 7 && time < 23) {
        userNotificationService.notifyUsers(slotCollection.slots);
    }
});

module.exports = userNotificationService;
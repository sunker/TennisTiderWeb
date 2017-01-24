const config = q = require('q'),
    Slot = require('../models/Slot.js'),
    mongoose = require('mongoose'),
    User = mongoose.model('user'),
    _ = require('underscore');

const userSlotFilter = {};

userSlotFilter.filterSlots = (user, slots) => {

    return slots.filter(slot => {
        var clubSettings = _.find(user.slotPreference, x => x.clubId === slot.clubId);
        return clubSettings &&
            clubSettings.days[slot.date.getDay()] &&
            isTimeInPreferenceRange(clubSettings.days[slot.date.getDay()], slot.timeSlot);
    });
};

userSlotFilter.isPrimeTime = (slot) => {
    if (!slot.timeSlot.active) return false;
    if (slot.timeSlot.startTime > 17) return true;
    if (slot.isOnWeekend && slot.timeSlot.startTime > 8) return true;
    if (slot.daysFromToday() < 7) return true;
    if (slot.isLunchtimeSlot && slot.clubId === 0 && slot.daysFromToday() < 5)

        return false;
};

var isTimeInPreferenceRange = (timeIntervalsOfPreference, timeSlot) => {
    if (!timeSlot.active) return false;
    for (var index = 0; index < timeIntervalsOfPreference.length; index++) {
        var prefTimeSlot = timeIntervalsOfPreference[index];
        if (timeSlot.startTime >= prefTimeSlot.startTime &&
            timeSlot.startTime < prefTimeSlot.endTime) {
            return true;
        }

    }

    return false;
};

module.exports = userSlotFilter;
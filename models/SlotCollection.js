const userSlotFilter = require('../notification/userSlotFilter');

module.exports = class SlotCollection {
    constructor(slots) {
        this._slots = slots;
    }

    get slots() {
        return this._slots.filter(x => x);
    }

    get primeTimeSlots() {
        return this.slots.filter(slot => userSlotFilter.isPrimeTime(slot.slot));
    }

    get uniqueSlotKeys() {
        return _.uniq(this.slots, function (x) {
            return x.key;
        }).map(x => x.key);
    }

    stringify() {
        return JSON.stringify(this.slots);
    }

    static uniqueSlots(slots) {
        return _.uniq(slots, function (x) {
            return x.key;
        });
    }

    static destringify(slots) {
        return JSON.parse(slots).map(x => new Slot(x.clubId, x.clubName, x._date, x.timeSlot, x.courtNumber, x.surface, x.price));
    }

    static hello() {
        return 'hel';
    }
};
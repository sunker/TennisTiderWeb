const mongoose = require('mongoose'),
    Q = require('q'),
    Slot = require('./Slot'),
    TimeSlot     = require('./TimeSlot'),
    SlotCollection = require('./SlotCollection'),
    Schema = mongoose.Schema;


const slotsCacheSchema = new Schema({
    id: {
        type: Schema.ObjectId
    },
    slots: [],
    slotCollection: {}
});

slotsCacheSchema.statics = {
    getCurrent: function () {
        const defer = Q.defer();
        this.findOne({}, function (err, cache) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(JSON.parse(cache.slots).map(x => new Slot(x.clubId, x.clubName, x._date, new TimeSlot(x.timeSlot.startTime, x.timeSlot.endTime), x.courtNumber, x.surface, x.price, x.link)));
            }
        });

        return defer.promise;
    },
    update: function (slots) {
        const defer = Q.defer();
        SlotsCache.remove({}, function (err) {
            if (err) {
                defer.reject(err);
            } else {
                const newSlotsCache = new SlotsCache();
                newSlotsCache.slots = JSON.stringify(slots);
                newSlotsCache.slotCollection = new SlotCollection(slots).stringify();
                newSlotsCache.save((err, res) => {
                    if (err) {
                        defer.reject(err);
                    } else {
                        defer.resolve(res);
                    }
                });
            }
        });

        return defer.promise;
    }
};

const SlotsCache = mongoose.model('SlotsCache', slotsCacheSchema);

module.exports = SlotsCache;
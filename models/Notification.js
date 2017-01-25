const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    Q = require('q');

const notificationSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: {
            unique: true
        }
    },
    timestamp: {
        type: Date,
    }
});

notificationSchema.methods = {
    isDayInPreferenceRange: (date) => {
        return this.jsDaysOfPreference.indexOf(date) !== -1;
    }
};

notificationSchema.statics = {
    containsKey: function (key) {
        const defer = Q.defer();
        Notification.findOne({
            'key': key
        }, function (err, key) {
            if (err) {
                defer.reject(err);
            } else {
                if (key) defer.resolve(true);
                else defer.resolve(false);
            }
        });

        return defer.promise;
    },
    add: function (notification) {
        const defer = Q.defer();

        notification.save(function (err) {
            if (err) {
                console.log(err);
                defer.reject(err);
            } else {
                defer.resolve(true);
                console.log('Notification created');
            }
        });

        return defer.promise;
    }
};

const Notification = mongoose.model('notification', notificationSchema);

module.exports = Notification;
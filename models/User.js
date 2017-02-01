const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    TimeSlot = require('./TimeSlot'),
    Q = require('q'),
    SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
    id: {
        type: Schema.ObjectId
    },
    active: Boolean,
    email: {
        type: String,
        required: true,
        unique: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
    },
    latestWeeklyReport: Number,
    slotPreference: [{
        clubId: Number,
        days: [
            []
        ]
    }],
    firstTimeUser: Boolean
});

userSchema.pre('save', function (next) {
    var user = this;

    if (!_.findWhere(user.slotPreference, {
            clubId: -1
        })) {
        user.slotPreference.push({
            clubId: -1,
            days: [
                [new TimeSlot(8, 21).toJSON()], //sunday
                [new TimeSlot(7, 9, false).toJSON(), new TimeSlot(12, 13, false).toJSON(), new TimeSlot(17, 21).toJSON()], //monday
                [new TimeSlot(7, 9, false).toJSON(), new TimeSlot(12, 13, false).toJSON(), new TimeSlot(17, 21).toJSON()], //thuesday..
                [new TimeSlot(7, 9, false).toJSON(), new TimeSlot(12, 13, false).toJSON(), new TimeSlot(17, 21).toJSON()],
                [new TimeSlot(7, 9, false).toJSON(), new TimeSlot(12, 13, false).toJSON(), new TimeSlot(17, 21).toJSON()],
                [new TimeSlot(7, 9, false).toJSON(), new TimeSlot(12, 13, false).toJSON(), new TimeSlot(17, 21).toJSON()],
                [new TimeSlot(8, 21).toJSON()]
            ],
        });
    }

    //next();

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, null, function (err, hash, progress, cb) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods = {
    validatePassword: function (password) {
        return new Promise((resolve) => {
            var self = this;
            bcrypt.compare(password, this.password, function (err, res) {
                if (!res) { //legacy...
                    resolve(self.password === password);
                } else {
                    resolve(res);
                }
            });
        });
    },
    isDayInPreferenceRange: (date) => {
        return this.jsDaysOfPreference.indexOf(date) !== -1;
    },
    isTimeInPreferenceRange: (timeSlot) => {
        this.timeIntervalsOfPreference.foreEach((prefTimeSlot) => {
            if (timeSlot.startTime >= prefTimeSlot.startTime &&
                timeSlot.startTime < prefTimeSlot.endTime) {
                return true;
            }
        });

        return false;
    },
    isClubPreferenceRange: (clubId) => {
        return this.clubsOfPreference.indexOf(clubId) !== -1;
    },
    comparePasswords: function (candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
            return;
        });
    },
    sendWeeklyReport: function () {
        if (!this.latestWeeklyReport) return true;

        const currentSavedDate = new Date(this.latestWeeklyReport);
        const currentDate = new Date();

        if (currentDate.getWeek() > currentSavedDate.getWeek()) {
            return true;
        } else {
            return false;
        }
    },
    saveWeeklyReport: function () {
        const defer = Q.defer();
        this.latestWeeklyReport = new Date().getTime();
        this.save(function (err, user) {
            if (err) {
                console.log(err);
                defer.reject(err);
            } else {
                defer.resolve(user);
                console.log('Weekly report saved');
            }
        });
        return defer.promise;
    }
};

userSchema.statics = {
    getById: function (userId) {
        const defer = Q.defer();
        User.findById(userId, function (err, user) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(user);
            }
        });

        return defer.promise;
    },
    getByEmail: function (email) {
        const defer = Q.defer();
        User.findOne({
            email: email
        }, function (err, user) {
            if (err || !user) {
                defer.reject(err);
            } else {
                defer.resolve(user);
            }
        });

        return defer.promise;
    },
    getAll: () => {
        const defer = Q.defer();
        User.find({}, function (err, users) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(users);
            }
        });

        return defer.promise;
    },
    add: function (newUser) {
        const defer = Q.defer();

        newUser.save(function (err, user) {
            if (err) {
                console.log(err);
                defer.reject(err);
            } else {
                defer.resolve(user);
                console.log('User created');
            }
        });

        return defer.promise;
    }
};

Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    var millisecsInDay = 86400000;
    return Math.ceil((((this - onejan) / millisecsInDay) + onejan.getDay() + 1) / 7);
}

const User = mongoose.model('user', userSchema);

module.exports = User;
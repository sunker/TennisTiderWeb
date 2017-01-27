var express = require('express'),
    q = require('q'),
    router = express.Router(),
    mongoose = require('mongoose'),
    TimeSlot = require('../models/TimeSlot'),
    jwtAuthentication = require('../middleware/jwtAuthentication'),
    User = mongoose.model('user'),
    notificationService = require('../notification/userNotificationService'),
    SlotsCache = mongoose.model('SlotsCache'),
    filter = require('../notification/userSlotFilter');

router.use(jwtAuthentication);

router.get('/list/:userId', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    const slotPromise = SlotsCache.getCurrent();
    const userPromise = User.getById(req.params.userId);

    Promise.all([userPromise, slotPromise]).then(values => {
        const filteredSlots = filter.filterSlots(values[0], values[1]);
        return res.end(JSON.stringify(filteredSlots.map(x => x.stringify())));
    });
});

router.post('/addClubs', function (req, res) {
    User.getByEmail(req.body.email).then((user) => {
        const currentClubsIds = user.slotPreference.map(x => x.clubId);
        req.body.clubIds.forEach(function (clubId) {
            const clubIdNo = Number(clubId);
            if (currentClubsIds.indexOf(clubIdNo) === -1) {
                user.slotPreference.push({
                    clubId: clubIdNo,
                    days: [
                        undefined, undefined, undefined, undefined, undefined, undefined, undefined
                    ]
                });
            }
        });

        let id = 0;
        user.slotPreference.forEach((x) => {
            if(!req.body.clubIds.map(id => Number(id)).includes(x.clubId) && x.clubId !== -1) {
                user.slotPreference.splice(id, 1);
            }
            id++;
        });

        user.save().then((user) => {
            res.json(user.toObject());
        });
    }, (error) => {
        res.writeHead(400, "Kunde inte hitta användaren", {
            'content-type': 'text/plain'
        });
    });
});

router.post('/saveClubTimeSlotSettings', function (req, res) {
    User.getByEmail(req.body.email).then((user) => {
        req.body.clubSlots.forEach((club) => {
            let weekdaySlots = [club.morningSettings, club.lunchSettings, club.eveningSettings];
            weekdaySlots = weekdaySlots ? weekdaySlots.map(x => {
                return new TimeSlot(x.timeSlot.startTime, x.timeSlot.endTime, x.include).toJSON();
            }) : undefined;

            let weekendSlots = [club.weekendSettings];
            weekendSlots = weekendSlots ? weekendSlots.map(x => {
                return new TimeSlot(x.timeSlot.startTime, x.timeSlot.endTime, x.include).toJSON();
            }) : undefined;

            user.slotPreference.forEach((prefClub) => {
                if (prefClub.clubId === club.club.id) {
                    prefClub.days[0] = weekendSlots;
                    prefClub.days[1] = weekdaySlots;
                    prefClub.days[2] = weekdaySlots;
                    prefClub.days[3] = weekdaySlots;
                    prefClub.days[4] = weekdaySlots;
                    prefClub.days[5] = weekdaySlots;
                    prefClub.days[6] = weekendSlots;
                }
            });
        });
        user.active = true;
        if (user.firstTimeUser) {
            SlotsCache.getCurrent().then((slots) => {
                notificationService.notifyUser(user, slots, true)
            });
        }
        user.firstTimeUser = false;
        user.markModified('slotPreference');
        user.save().then((user) => {
            res.json(JSON.stringify(user.slotPreference));
        });
    });
}, (error) => {
    res.writeHead(400, "Kunde inte hitta användaren", {
        'content-type': 'text/plain'
    });
});



router.post('/addDefaultTimeSlotSettings', function (req, res) {
    User.getByEmail(req.body.email).then((user) => {
        let weekdaySlots = [req.body.clubSlot.morningSettings, req.body.clubSlot.lunchSettings, req.body.clubSlot.eveningSettings];
        weekdaySlots = weekdaySlots ? weekdaySlots.map(x => {
            return new TimeSlot(x.timeSlot.startTime, x.timeSlot.endTime, x.include).toJSON();
        }) : undefined;

        let weekendSlots = [req.body.clubSlot.weekendSettings];
        weekendSlots = weekendSlots ? weekendSlots.map(x => {
            return new TimeSlot(x.timeSlot.startTime, x.timeSlot.endTime, x.include).toJSON();
        }) : undefined;

        user.active = true;
        if (user.firstTimeUser) {
            user.slotPreference.forEach((prefClub) => {
                prefClub.days[0] = weekendSlots;
                prefClub.days[1] = weekdaySlots;
                prefClub.days[2] = weekdaySlots;
                prefClub.days[3] = weekdaySlots;
                prefClub.days[4] = weekdaySlots;
                prefClub.days[5] = weekdaySlots;
                prefClub.days[6] = weekendSlots;
            });
            SlotsCache.getCurrent().then((slots) => {
                notificationService.notifyUser(user, slots, true)
            });
        }
        user.firstTimeUser = false;
        user.markModified('active');
        user.markModified('firstTimeUser');
        user.markModified('slotPreference');
        user.save().then((user) => {
            res.json(JSON.stringify(user.slotPreference));
        });
    });
}, (error) => {
    res.writeHead(400, "Kunde inte hitta användaren", {
        'content-type': 'text/plain'
    });
});


router.post('/updateClubSlots', function (req, res) {
    User.getByEmail(req.body.email).then((user) => {

        let weekdaySlots = req.body.timeSlots.filter(x => x.dayType === 'weekday');
        weekdaySlots = weekdaySlots ? weekdaySlots.map(x => {
            return new TimeSlot(x.startTime, x.endTime).toJSON();
        }) : undefined;
        let weekendSlots = req.body.timeSlots.filter(x => x.dayType === 'weekend');
        weekendSlots = weekendSlots ? weekendSlots.map(x => {
            return new TimeSlot(x.startTime, x.endTime).toJSON();
        }) : undefined;
        user.slotPreference.forEach((club) => {
            club.days[0] = weekendSlots;
            club.days[1] = weekdaySlots;
            club.days[2] = weekdaySlots;
            club.days[3] = weekdaySlots;
            club.days[4] = weekdaySlots;
            club.days[5] = weekdaySlots;
            club.days[6] = weekendSlots;
        });
        user.save().then((user) => {
            res.json(JSON.stringify(user.slotPreference));
        });
    });
}, (error) => {
    res.writeHead(400, "Kunde inte hitta användaren", {
        'content-type': 'text/plain'
    });
});

module.exports = router;
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    SlotsCache = mongoose.model('SlotsCache'),
    jwtAuthentication = require('../middleware/jwtAuthentication'),
    clubService = require('../services/clubService'),
    User = mongoose.model('user'),
    notificationService = require('../notification/userNotificationService'),
    SlotsCache = mongoose.model('SlotsCache'),
    filter = require('../notification/userSlotFilter');
    // noCacheHeader = require('../middleware/noCacheHeader');

router.use(jwtAuthentication);
// router.use(noCacheHeader);

router.get('/list', function (req, res) {
    User.getAll().then((users) => {
        return res.end(JSON.stringify(users));
    });
});

router.get('/getByEmail/:email', function (req, res) {
    console.log('getByEmail' + req.params.email);
    var userObj = {};
    User.getByEmail(req.params.email).then((user) => {
        try {
            userObj = user.toObject();
            userObj.slotPreference.forEach((slotPref) => {
                const club = clubService.getAllClubs().find(x => x.id === slotPref.clubId);

                slotPref.clubName = club ? club.name : '';
                slotPref.club = club ? club : {
                    id: -1,
                    name: ''
                };
            });
            return res.json(userObj);
        } catch (error) {
            res.end(JSON.stringify('{ success: ' + error + ' }'))
        }
    }, (error) => res.end(JSON.stringify('{ success: ' + error + ' }')));
});

router.post('/sendMailList', function (req, res) {
    const slotPromise = SlotsCache.getCurrent();
    const userPromise = User.getByEmail(req.body.email);

    Promise.all([userPromise, slotPromise]).then(values => {
        notificationService.notifyUser(values[0], values[1], true).then(() => {
            return res.json('{success: true}');
        }, () => res.json('{success: false}'));
    });
});

module.exports = router;
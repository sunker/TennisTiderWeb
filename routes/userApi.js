var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    SlotsCache = mongoose.model('SlotsCache'),
    jwtAuthentication = require('../middleware/jwtAuthentication'),
    clubService = require('../services/clubService'),
    User = mongoose.model('user'),
    notificationService = require('../notification/userNotificationService'),
    filter = require('../notification/userSlotFilter');

router.use(jwtAuthentication);

router.get('/list', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    User.getAll().then((users) => {
        return res.end(JSON.stringify(users));
    });
});

router.get('/getByEmail/:email', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    var userObj = {};
    User.getByEmail(req.params.email).then((user) => {
        userObj = user.toObject();
        userObj.slotPreference.forEach((slotPref) => {
            const club = clubService.getAllClubs().find(x => x.id === slotPref.clubId);

            slotPref.clubName = club ? club.name : '';
            slotPref.club = club ? club : {
                id: -1,
                name: ''
            };

        });
        return res.end(JSON.stringify(userObj));
    });
});

router.post('/sendMailList', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    const slotPromise = SlotsCache.getCurrent();
    const userPromise = User.getByEmail(req.body.email);

    Promise.all([userPromise, slotPromise]).then(values => {
        notificationService.notifyUser(values[0], values[1], true).then(()=> {
            return res.end();
        });
    });
});

module.exports = router;
var express = require('express'),
    router = express.Router(),
    clubService = require('../services/clubService'),
    mongoose = require('mongoose'),
    jwtAuthentication = require('../middleware/jwtAuthentication'),
    // noCacheHeader = require('../middleware/noCacheHeader'),
    User = mongoose.model('user');

router.use(jwtAuthentication);
// router.use(noCacheHeader);

router.use(jwtAuthentication);

router.get('/list', function (req, res) {
    var result = clubService.getAllClubs();
    return res.end(JSON.stringify(_.sortBy(result, 'name')));
});

router.get('/withUserInfo/:email', function (req, res) {
    var result = clubService.getAllClubs();
    User.getByEmail(req.params.email).then((user) => {
        const userObj = user.toObject();
        result.forEach((club) => {
            const exist = userObj.slotPreference.find(x => x.clubId === club.id);
            if (exist) {
                club.active = true;
            } else {
                club.active = false;
            }
        });
        
        return res.end(JSON.stringify(_.sortBy(result, 'name')));
    });
});

module.exports = router;
var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  jwtAuthentication = require('../middleware/jwtAuthentication'),
  rp = require('request-promise'),
  User = mongoose.model('user'),
  request = require('request');

router.use(jwtAuthentication);
// router.use(noCacheHeader);

router.use(jwtAuthentication);

router.get('/list', function (req, res) {
  request(`https://tennistider-api.herokuapp.com/api/club/list`, function (error, response, html) {
    return res.end(JSON.stringify(_.sortBy(JSON.parse(response.body), 'name')));
  })
});

router.get('/withUserInfo/:email', function (req, res) {
  request(`https://tennistider-api.herokuapp.com/api/club/list`, function (error, response, html) {
    var result = JSON.parse(response.body);
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
});

module.exports = router;

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  jwtAuthentication = require('../middleware/jwtAuthentication'),
  rp = require('request-promise'),
  User = mongoose.model('user'),
  clubService = require('../services/clubService'),
  request = require('request');

router.use(jwtAuthentication);
// router.use(noCacheHeader);

router.use(jwtAuthentication);

router.get('/list', function (req, res) {
  // request(`https://tennistider-api.herokuapp.com/api/club/list`, function (error, response, html) {
    const clubs = clubService.getAllClubs2()
    return res.end(JSON.stringify(_.sortBy(clubs, 'name')));
  // })
});

router.get('/withUserInfo/:email', function (req, res) {
  // request(`https://tennistider-api.herokuapp.com/api/club/list`, function (error, response, html) {
  // var result = JSON.parse(response.body);
  const clubs = clubService.getAllClubs2()

  User.getByEmail(req.params.email).then((user) => {
    const userObj = user.toObject();
    clubs.forEach((club) => {
      const exist = userObj.slotPreference.find(x => x.clubId === club.id);
      if (exist) {
        club.active = true;
      } else {
        club.active = false;
      }
    });

    return res.end(JSON.stringify(_.sortBy(clubs, 'name')));
  });
  // });
});

module.exports = router;

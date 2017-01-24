var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    User = mongoose.model('user');

//58418062fb498203ece4e656"
router.post('/', function (req, res) {
    User.getByEmail(req.body.email.toLowerCase()).then((user) => {
        if (user && user.validatePassword(req.body.password)) {
            var token = jwt.sign(user, 'tennistidersupersecrettoken', {
                expiresIn: 6000 // 60 days
            });

            res.json({
                'success': true,
                'message': 'Authentication succeeded',
                'email': user.email,
                'firstTimeUser': user.firstTimeUser,
                'slotPreference': user.slotPreference,
                'token': token
            });
        } else {
            res.writeHead(500, 'Felaktigt lösenord', {
                'content-type': 'text/plain'
            });
            res.end();
        }
    }, (rejected) => {
        res.writeHead(500, 'Inloggningen misslyckades', {
            'content-type': 'text/plain'
        });
        res.end();
    });
});

router.post('/create', function (req, res) {
    var user = new User();
    user.email = req.body.email;
    user.password = req.body.password;
    user.firstTimeUser = true;
    User.add(user).then((user) => {
        res.json({
            success: true,
            message: 'Registreringen lyckades!',
            user: {
                'email': user.email,
                'firstTimeUser': user.firstTimeUser,
                'slotPreference': user.slotPreference,
            }
        });
    }, (error) => {
        res.writeHead(500, 'Det finns redan ett konto registrerat på emailadressen', {
            'content-type': 'text/plain'
        });
        res.end();
    });
});

module.exports = router;
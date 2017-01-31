var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    mailClient = require('../notification/mailClient'),
    User = mongoose.model('user');

//58418062fb498203ece4e656"
router.post('/', function (req, res) {
    User.getByEmail(req.body.email.toLowerCase().trim()).then((user) => {
        if (user && user.validatePassword(req.body.password)) {
            var token = jwt.sign({
                email: user.email
            }, 'tennistidersupersecrettoken', {
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
    user.email = req.body.email.toLowerCase().trim();
    user.password = req.body.password.trim();
    user.firstTimeUser = true;
    User.add(user).then((user) => {

        mailClient.sendEmail({
            "from": 'tennistider@gmail.com',
            "to": user.email,
            "subject": `Välkommen till Tennistider`,
            "html": `<h2>Välkommen till Tennistider</h2>
                    <p>Ditt användarnamn är <strong>${user.email}</strong></p>
                    <p>Mvh / Tennistider</p>`
        });

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
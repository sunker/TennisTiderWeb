var nodemailer = require('nodemailer'),
    Q = require('q');
// var smtpTransport = require('nodemailer-smtp-transport');

const mailClient = {};
mailClient.sendEmail = function (mail) {
    const defer = Q.defer();
    var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,

        auth: {
            user: 'tennistider@gmail.com',
            pass: 'hejsan10'
        }
    };

    var transporter = nodemailer.createTransport(smtpConfig);
    var mailOptions = {
        from: mail.from,
        to: mail.to,
        subject: mail.subject,
        // text: 'this is some text', //, // plaintext body
        html: mail.buildHtmlText()
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('There was an error sending the mail: ' + error);
            return defer.reject();
        } else {
            console.log('Message sent: ' + info.response);
            return defer.resolve();
        }
    });
    return defer.promise;
};

module.exports = mailClient;
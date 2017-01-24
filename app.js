const express = require('express'),
    mongoose = require('mongoose'),
    a = require('./models/User'),
    b = require('./models/SlotsCache'),
    app = express(),
    bodyParser = require('body-parser');

global._ = require('underscore');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const userApi = require('./routes/userApi');
app.use('/api/user', userApi);

const clubApi = require('./routes/clubApi');
app.use('/api/club', clubApi);

const slotApi = require('./routes/slotApi');
app.use('/api/slot', slotApi);

const authenticationApi = require('./routes/authenticationApi');
app.use('/api/authenticate', authenticationApi);

app.use('/assets',  express.static(__dirname + '/bower_components'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));

app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port);
console.log('App running on port ' + port);

mongoose.connect('mongodb://127.0.0.1/tennistider', (err) => {
    if (err) console.log(err);
    else console.log('Connected to database');
});

// var user = new User();
// user.email = 'erik.sundell87@gmail.com';
// user.password = 'hejsan';
// user.active = true;
// user.firstTimeUser = true;
// user.slotPreference = [{
//     clubId: 1,
//     days: [
//         [new TimeSlot(8, 21).toJSON()], //sunday
//         [new TimeSlot(7, 9).toJSON(), new TimeSlot(12, 13).toJSON(), new TimeSlot(17, 21).toJSON()], //monday
//         [new TimeSlot(7, 9).toJSON(), new TimeSlot(12, 13).toJSON(), new TimeSlot(17, 21).toJSON()], //thuesday..
//         [new TimeSlot(7, 9).toJSON(), new TimeSlot(12, 13).toJSON(), new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(7, 9).toJSON(), new TimeSlot(12, 13).toJSON(), new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(7, 9).toJSON(), new TimeSlot(12, 13).toJSON(), new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(8, 21).toJSON()]
//     ],
// }, {
//     clubId: 2,
//     days: [
//         [new TimeSlot(8, 21).toJSON()], //Sunday
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(8, 20).toJSON()]
//     ],
// }, {
//     clubId: 3,
//     days: [
//         [new TimeSlot(8, 20).toJSON()], //Sunday
//         [new TimeSlot(17, 20).toJSON()],
//         [new TimeSlot(17, 20).toJSON()],
//         [new TimeSlot(17, 20).toJSON()],
//         [new TimeSlot(17, 20).toJSON()],
//         [new TimeSlot(17, 20).toJSON()],
//         [new TimeSlot(8, 20).toJSON()]
//     ],
// }, {
//     clubId: 20,
//     days: [
//         [new TimeSlot(8, 21).toJSON()], //Sunday
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(8, 20).toJSON()]
//     ],
// }, {
//     clubId: 21,
//     days: [
//         [new TimeSlot(8, 21).toJSON()], //Sunday
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(8, 20).toJSON()]
//     ],
// }, {
//     clubId: 22,
//     days: [
//         [new TimeSlot(8, 21).toJSON()], //Sunday
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(17, 21).toJSON()],
//         [new TimeSlot(8, 20).toJSON()]
//     ],
// }];
// User.add(user);
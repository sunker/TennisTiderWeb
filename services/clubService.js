const config = require('../config.json');
const clubs = require('../club.json');

const clubService = {};

clubService.getAllClubs2 = () => {
    let result = []
    clubs.endpoints.matchi.forEach((club) => {
        result.push(Object.assign({}, club, { tag: 'matchi' }))
    })

    clubs.endpoints.matchiPadel.forEach((club) => {
        result.push(Object.assign({}, club, { tag: 'matchipadel' }))
    })

    clubs.endpoints.myCourt.clubs.forEach((club) => {
        result.push(Object.assign({}, club, { tag: 'mycourt', url: club.bookingUrl }))
    })

    result.push(Object.assign({}, clubs.endpoints.hellas, { tag: 'hellas' }))

    let enskede = clubs.endpoints.enskede
    result.push(Object.assign({}, enskede, { tag: 'enskede', url: enskede.bookingUrl }))

    return result
}

clubService.getAllClubs = () => {
    let result = [];
    config.endpoints.matchi.forEach((club) => {
        result.push({
            'id': club.id,
            'name': club.name,
            'image': club.image,
            'url': club.url,
            'location': club.location
        });
    });

    config.endpoints.myCourt.clubs.forEach((club) => {
        result.push({
            'id': club.id,
            'name': club.name,
            'image': club.image,
            'url': club.bookingUrl,
            'location': club.location
        });
    });

    let hellas = config.endpoints.hellas;
    result.push({
        'id': hellas.id,
        'name': hellas.name,
        'image': hellas.image,
        'url': hellas.url,
        'location': hellas.location
    });

    let enskede = config.endpoints.enskede;
    result.push({
        'id': enskede.id,
        'name': enskede.name,
        'image': enskede.image,
        'url': enskede.bookingUrl,
        'location': enskede.location
    });

    return result;
};

module.exports = clubService;
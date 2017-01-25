const config = require('../config.json');

const clubService = {};

clubService.getAllClubs = () => {
    let result = [];
    config.endpoints.matchi.forEach((club) => {
        result.push({
            'id': club.id,
            'name': club.name,
            'image': club.image,
            'url': club.url
        });
    });

    config.endpoints.myCourt.clubs.forEach((club) => {
        result.push({
            'id': club.id,
            'name': club.name,
            'image': club.image,
            'url': club.bookingUrl
        });
    });

    let hellas = config.endpoints.hellas;
    result.push({
        'id': hellas.id,
        'name': hellas.name,
        'image': hellas.image,
        'url': hellas.url
    });

    let enskede = config.endpoints.enskede;
    result.push({
        'id': enskede.id,
        'name': enskede.name,
        'image': enskede.image,
        'url': enskede.bookingUrl
    });

    return result;
};

module.exports = clubService;
const config = require('../config.json');

const clubService = {};

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
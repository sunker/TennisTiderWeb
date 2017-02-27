module.exports = class ScraperHelper {

    static insertUrlDates(url, date) {
        url = url.replace('[year]', date.getFullYear());
        url = url.replace('[month]', date.getMonth() + 1);
        url = url.replace('[day]', date.getDate());

        return url;
    };

    static randomIntFromInterval (min, max) {
        const random = Math.floor(Math.random() * (max - min + 1) + min);
        return random;
    };

    static getUrlsForNoOfDaysAhead(rawUrl, noOfDaysAhead, name, clubId) {
        var currentDate = new Date();
        var targets = [];
        for (var index = 0; index < noOfDaysAhead; index++) {
            var timestamp = new Date(currentDate.getTime());;
            var url = ScraperHelper.insertUrlDates(rawUrl, currentDate);
            targets.push({
                clubId: clubId,
                url: url,
                name: name,
                timestamp: timestamp,
                date: currentDate.getDate(),
                month: currentDate.getMonth() + 1,
                year: currentDate.getFullYear()
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return targets;
    };
};
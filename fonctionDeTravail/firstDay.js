const moment = require('moment');


function firstLastDay(choix) {

    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 5; // last day is the first day + 6

    var firstday = new Date(curr.setDate(first))
    var lastday = new Date(curr.setDate(last))

    if (choix === 1) {

        var firstday = moment(firstday).format('YYYYMMDD')
        var lastday = moment(lastday).format('YYYYMMDD')


        return { firstday, lastday }
    } else {
        listeWeekDate = []
        for (var i = 0; i <= 6; i++) {
            var day = new Date(curr.setDate(first + i))
            day = moment(day).format('YYYYMMDD')
            listeWeekDate.push(day)
        }
        return listeWeekDate
    }
}

module.exports = firstLastDay;
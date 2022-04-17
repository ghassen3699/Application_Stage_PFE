// function getMonday(d) {
//     d = new Date(d)
//     var day = d.getDay()
//     diff = d.getDate() - day + (day == 0 ? -6 : 1) // adjust when day is sunday
//     var Lundi = new Date(d.setDate(diff))
//     if (Lundi.getMonth().toString().length === 1) {
//         Lundi = Lundi.getFullYear().toString() + '0' + (Lundi.getMonth() + 1).toString() + Lundi.getDate().toString()
//     } else {
//         Lundi = Lundi.getFullYear().toString() + (Lundi.getMonth() + 1).toString() + Lundi.getDate().toString()
//     }
//     return Lundi
// }

// module.exports = getMonday





function firstLastDay() {
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 5; // last day is the first day + 6

    var firstday = new Date(curr.setDate(first))
    var lastday = new Date(curr.setDate(last))


    if (firstday.getMonth().toString().length === 1) {
        firstday = firstday.getFullYear().toString() + '0' + (firstday.getMonth() + 1).toString() + firstday.getDate().toString()
    } else {
        firstday = firstday.getFullYear().toString() + (firstday.getMonth() + 1).toString() + firstday.getDate().toString()
    }

    if (lastday.getMonth().toString().length === 1) {
        lastday = lastday.getFullYear().toString() + '0' + (lastday.getMonth() + 1).toString() + lastday.getDate().toString()
    } else {
        lastday = lastday.getFullYear().toString() + (lastday.getMonth() + 1).toString() + lastday.getDate().toString()
    }


    return { firstday, lastday }
}

module.exports = firstLastDay;
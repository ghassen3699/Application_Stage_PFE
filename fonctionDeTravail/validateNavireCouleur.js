var curr = new Date;
var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));



var date = curr.getFullYear().toString() + curr.getMonth().toString() + curr.getDate().toString()


// var sql = ""

// while (firstday <= lastday) {
//     sql = "SELECT COUNT(*) FROM trackingData WHERE (DA = )"
// }


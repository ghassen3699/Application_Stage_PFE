function validationQuery(q1, q2, q3, q4) {
    if ((q1 !== "") || (q2 === "") || (q3 === "") || (q4 === "")) {
        return "SELECT * FROM tobInfo WHERE DA = " + q1 + ";"
    } else if ((q1 !== "") || (q2 === "") || (q3 === "") || (q4 !== "")) {
        return "SELECT * FROM tobInfo where ((NA = '" + q4 + "') AND (DA = '" + q1 + "'));"
    } else if ((q1 === "") || (q2 !== "") || (q3 !== "") || (q4 === "")) {
        return "SELECT * FROM tobInfo where ((DABeg BETWEEN '" + q2 + "' AND '" + q3 + "') OR (DAEnd BETWEEN '" + q2 + "' AND '" + q3 + "'));"
    } else if ((q1 === "") || (q2 !== "") || (q3 !== "") || (q4 !== "")) {
        return "SELECT * FROM tobInfo WHERE ((NA = '" + q4 + "') AND (DABeg BETWEEN '" + q2 + "' AND '" + q3 + "') OR (DAEnd BETWEEN '" + q2 + "' AND '" + q3 + "');"
    } else if ((q1 === "") || (q2 === "") || (q3 === "") || (q4 !== "")) {
        return "SELECT * FROM tobInfo WHERE NA = '" + q4 + "';"
    } else {
        return false
    }
};


// module.exports = validationQuery;
const express = require('express');
const https = require('https');
const mysql = require('mysql');
const homeRouter = express.Router();


//------------------------------- La connexion entre NodeJs et Mysql -------------------------------------//

const db = mysql.createConnection({
    host: 'localhost',
    //host: '193.95.21.63',
    user: 'root',
    password: 'Ghassen1234@',
    database: 'VMS',
    multipleStatements: true
});


db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Mysql')
});

//----------------------------------------------------------------------------------------------------------//





homeRouter.get('/', function(req, res) {

    //const url = "https://api.openweathermap.org/data/2.5/weather?lat=36.8472&lon=10.2040&units=metric&appid=9d35eb879889e4a3c2bc559347144202"
    //https.get(url, function(response) {

    //    response.on("data", async function(data) {
    //        const weatherData = await JSON.parse(data)
    //        const temp = weatherData.main.temp
    //        res.render("home", { temp: temp })
    //    })
    //});

    const sql = "SELECT COUNT(*) AS TOTALPrev FROM weatherCRCData WHERE (TM='ACKp') AND (DA = CURDATE()+0); "
    const sql2 = "SELECT COUNT(*) AS TOTALPos FROM weatherCRCData WHERE (TM='ACKi') AND (DA = CURDATE()+0);"
    db.query(sql + sql2, (err, result) => {
        if (err) {
            throw err; // remplacer par 404 NOT FOUND
        }

        const PREV = result[0][0]['TOTALPrev'];
        const ACKI = result[1][0]['TOTALPos'];
        res.render("home", { temp: 13, pourcentageDesPREV: PREV, pourcentageDesPOS: ACKI })
    });

});


module.exports = homeRouter;
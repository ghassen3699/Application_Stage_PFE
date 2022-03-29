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

    //sql = "SELECT DISTINCT NA, MAX(TI), ID_VMS FROM trackingData WHERE (DA = '20210706') GROUP BY NA , ID_VMS;" 
    //sql = "SELECT * FROM trackingData WHERE (DA = "20210706") AND (ID_VMS = "VMS2005") ORDER BY TI DESC;" ------> recherche par ID_VMS
    //sql = ""

    sql1 = "SELECT DISTINCT CRC, TY, DA FROM CRCData WHERE (TY LIKE '%PREV%') AND (DA = CURDATE()+0) ;"
    sql2 = "SELECT DISTINCT CRC, TY, DA FROM CRCData WHERE (TY LIKE '%BMS%') AND (DA = CURDATE()+0) ;"
    sql3 = "SELECT DISTINCT NA, MAX(TI), ID_VMS FROM trackingData WHERE (DA = '20210706') GROUP BY NA , ID_VMS;"
    db.query(sql1 + sql2 + sql3, (err, result) => {
        if (err) {
            throw err
        }

        res.render("home", { temp: 13, pourcentageDesPREV: result[0].length, pourcentageDesBMS: result[1].length, naviresConnecter: result[2] })
    })

});





module.exports = homeRouter;
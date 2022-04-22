const express = require('express');
const session = require('express-session');
const https = require('https');
const mysql = require('mysql');
const homeRouter = express.Router();
const firstLastDay = require('../fonctionDeTravail/firstDay');


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

    var user = req.session.user

    if (user) {
        var week = firstLastDay()

        var user = req.session.user
        console.log(user)
            // console.log(week.firstday, week.lastday)


        sql1 = "SELECT DISTINCT CRC, TY, DA FROM CRCData WHERE (TY LIKE '%PREV%') AND (DA = '20220418') ;"
        sql2 = "SELECT DISTINCT CRC, TY, DA FROM CRCData WHERE (TY LIKE '%BMS%') AND (DA = '20220418') ;"
        sql3 = "SELECT DISTINCT NA, MAX(TI), ID_VMS FROM trackingData WHERE (DA = '20220418') GROUP BY NA , ID_VMS; "
        sql4 = "SELECT DA, COUNT(*) AS TOTAL FROM trackingData WHERE DA BETWEEN " + week.firstday + " AND " + week.lastday + " GROUP BY DA;"

        db.query(sql1 + sql2 + sql3 + sql4, (err, result) => {
            if (err) {
                throw err
            }
            var x = [1, 2, 3, 4, 5, 6]
            var listNombrePosition = []
            if (result[3].length > 0) {
                result[3].forEach(resultat => {
                    var Date = resultat['DA']
                    var TotalPOS = resultat['TOTAL']
                    listNombrePosition.push({ Date, TotalPOS })
                });
            }


            res.render("home", { temp: 13, pourcentageDesPREV: result[0].length, pourcentageDesBMS: result[1].length, naviresConnecter: result[2], data: listNombrePosition, user: user })
        })
    } else {
        return res.redirect('/')
    }

});





module.exports = homeRouter;
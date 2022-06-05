const express = require('express');
const session = require('express-session');
const https = require('https');
const mysql = require('mysql');
const homeRouter = express.Router();
const firstLastDay = require('../fonctionDeTravail/firstDay');
const generatNotification = require('../fonctionDeTravail/generateNotif')
const homePositionToday = require('../fonctionDeTravail/homeTodayPosition')

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



// afficher le nombre des positions reçu pour cette semaine sous forme des API
homeRouter.get('/homePositionsAPI', function(req, res) {
    var user = req.session.user

    if (user) {
        var week = firstLastDay(1)

        var sql = "SELECT DA, COUNT(*) AS TOTAL FROM trackingData WHERE DA BETWEEN " + week.firstday + " AND " + week.lastday + " GROUP BY DA;"

        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            var listeDates = firstLastDay(2)
            listeResult = []

            for (var i = 0; i <= listeDates.length - 1; i++) {
                var valider = false
                for (var j = 0; j <= result.length - 1; j++) {
                    if (listeDates[i] === result[j]['DA']) {
                        listeResult.push({ 'weekDate': listeDates[i], 'result': result[j]['TOTAL'] })
                        valider = true
                    }
                }
                if (valider === false) {
                    listeResult.push({ 'weekDate': listeDates[i], 'result': 0 })
                }
            }


            return res.json(listeResult)
        })


    } else {
        return res.redirect('/')
    }
})



// afficher la meteo d'aujourd'hui sous forme des API
homeRouter.get('/weatherAPI', function(req, res) {

    var user = req.session.user
    if (user) {
        const url = "https://api.openweathermap.org/data/2.5/weather?lat=36.8472&lon=10.2040&units=metric&appid=9d35eb879889e4a3c2bc559347144202"
        https.get(url, function(response) {

            response.on("data", async function(data) {
                const weatherData = await JSON.parse(data)
                const temp = weatherData.main.temp
                if (temp) {
                    return res.json({ temp: temp })
                } else {
                    return res.json({ temp: 0 })
                }

            })
        });
    } else {
        return res.redirect('/')
    }

})


// API pour retourner les PREVISIONS et les BMS chaque Jour
homeRouter.get('/PrevBMS_API', function(req, res) {

    var user = req.session.user
    if (user) {
        const sql1 = "SELECT COUNT(*) AS TOTALBMS FROM CRCData WHERE (DA = '20211108') AND (TY = 'BMS') ;"
        const sql2 = "SELECT COUNT(*) AS TOTALPREV FROM CRCData WHERE (DA = '20211108') AND (TY = 'PREV') ;"
        db.query(sql1 + sql2, (err, result) => {
            if (err) {
                throw err;
            }

            return res.json({ TotalPREV: result[1][0]['TOTALPREV'], TotalBMS: result[0][0]['TOTALBMS'] })
        })
    } else {
        return res.redirect('/')
    }

})

homeRouter.get('/', function(req, res) {


    var user = req.session.user

    if (user) {
        var user = req.session.user

        sql1 = "SELECT DISTINCT CRC, TY, DA FROM CRCData WHERE (TY LIKE '%PREV%') AND (DA = '20220418') ;"
        sql2 = "SELECT DISTINCT CRC, TY, DA FROM CRCData WHERE (TY LIKE '%BMS%') AND (DA = '20220418') ;"
        sql3 = "SELECT DISTINCT NA, MAX(TI), ID_VMS FROM trackingData WHERE (DA = '20220418') GROUP BY NA , ID_VMS; "

        db.query(sql1 + sql2 + sql3, (err, result) => {
            if (err) {
                throw err
            }
            var navires
            if (result[2].length > 5) {
                navires = result[2].slice(0, 5)
            } else {
                navires = result[2]
            }
            res.render("home", { pourcentageDesPREV: result[0].length, pourcentageDesBMS: result[1].length, naviresConnecter: navires, user: user })
        })
    } else {
        return res.redirect('/')
    }

});

// retouner le nombre des BMS reçu pour aujourd'hui sous forme des API
homeRouter.get('/BMSApiNotification', function(req, res) {
    var user = req.session.user
    if (user) {

        var sql = "SELECT COUNT(*) AS TOTAL FROM CRCData WHERE DA = CURDATE()+0 ;"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.json({ BMS: result[0]['TOTAL'] })
        })
    } else {
        return res.redirect('/')
    }
})

// retourner les Notifications d'aujourd'hui
homeRouter.get('/notificationAPI', function(req, res) {
    var user = req.session.user
    if (user) {
        var sql = "SELECT * FROM VMS.trackingData T1 WHERE DATE_FORMAT(DA,'%Y%m%d')=DATE_FORMAT(20220418,'%Y%m%d') AND TI=(SELECT MAX(TI) FROM VMS.trackingData T2 WHERE (T1.NA=T2.NA AND T1.DA=T2.DA)) order by ID_VMS DESC; "
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.json(result)
        })
    } else {
        return res.redirect('/')
    }
})


// afficher les derniers positions
homeRouter.get('/PositionNotif', function(req, res) {
    var user = req.session.user
    if (user) {
        var sql = "SELECT * FROM VMS.trackingData T1 WHERE DATE_FORMAT(DA,'%Y%m%d')=DATE_FORMAT(20220418,'%Y%m%d') AND TI=(SELECT MAX(TI) FROM VMS.trackingData T2 WHERE (T1.NA=T2.NA AND T1.DA=T2.DA)) AND TM='POS' order by ID_VMS DESC;"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render('positionNotif', { user: user, positionNotification: result })
        })
    } else {
        return res.redirect('/')
    }

})

// afficher les derniers SOS
homeRouter.get('/SOSNotif', function(req, res) {
    var user = req.session.user
    if (user) {
        var sql = "SELECT * FROM VMS.trackingData T1 WHERE DATE_FORMAT(DA,'%Y%m%d')=DATE_FORMAT(20220418,'%Y%m%d') AND TI=(SELECT MAX(TI) FROM VMS.trackingData T2 WHERE (T1.NA=T2.NA AND T1.DA=T2.DA)) AND TM='DIs' order by ID_VMS DESC;"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render('sosNotif', { user: user, SOSnotifications: result })
        })
    } else {
        return res.redirect('/')
    }

})


module.exports = homeRouter;
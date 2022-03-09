const express = require('express');
const mysql = require('mysql');
const { redirect, render } = require('express/lib/response');
const statistiqueRouter = express.Router()




//------------------------------- La connexion entre NodeJs et Mysql -------------------------------------//

const db = mysql.createConnection({
    host: 'localhost',
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





// statistique des SOS
//------------------------------------------------------------------------------------------------------------//
statistiqueRouter.get('/totalSOSAPI', function(req, res) {


    const statistiqueSOS = [
        { MoisNom: 'Jan', Mois: 1, total: 0 },
        { MoisNom: 'Fev', Mois: 2, total: 0 },
        { MoisNom: 'Mar', Mois: 3, total: 0 },
        { MoisNom: 'Avr', Mois: 4, total: 0 },
        { MoisNom: 'Mai', Mois: 5, total: 0 },
        { MoisNom: 'Juin', Mois: 6, total: 0 },
        { MoisNom: 'Juil', Mois: 7, total: 0 },
        { MoisNom: 'Aou', Mois: 8, total: 0 },
        { MoisNom: 'Sep', Mois: 9, total: 0 },
        { MoisNom: 'Oct', Mois: 10, total: 0 },
        { MoisNom: 'Nov', Mois: 11, total: 0 },
        { MoisNom: 'Dec', Mois: 12, total: 0 }
    ]

    sql = "SELECT MONTH(DA), COUNT(*) FROM trackingData WHERE (MONTH(DA) IN (1,2,3,4,5,6,7,8,9,10,11,12)) AND (YEAR(CURDATE()+0) = YEAR(DA)) AND (TM='DIS') GROUP BY MONTH(DA); "
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }


        result.forEach(element => {

            statistiqueSOS.forEach(s => {
                if (s['Mois'] == element['MONTH(DA)']) {
                    s['total'] = element['COUNT(*)']
                }
            });
        });


        res.json(statistiqueSOS)
    })
});


statistiqueRouter.get('/totalSOS', function(req, res) {
    sql = "SELECT COUNT(*) AS TOTAL FROM trackingData WHERE (TM='DIS') AND (YEAR(CURDATE()+0) = YEAR(DA)); "

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }

        res.render('statistique/statSOS', { totalSOS: result[0]['TOTAL'] })
    })

});


//------------------------------------------------------------------------------------------------------------//







// statistique des BMS
//------------------------------------------------------------------------------------------------------------//
statistiqueRouter.get('/totalBMSAPI', function(req, res) {
    const statistique_BMS = [
        { MoisNom: 'Jan', Mois: 1, totalBMS: 0 },
        { MoisNom: 'Fev', Mois: 2, totalBMS: 0 },
        { MoisNom: 'Mar', Mois: 3, totalBMS: 0 },
        { MoisNom: 'Avr', Mois: 4, totalBMS: 0 },
        { MoisNom: 'Mai', Mois: 5, totalBMS: 0 },
        { MoisNom: 'Juin', Mois: 6, totalBMS: 0 },
        { MoisNom: 'Juil', Mois: 7, totalBMS: 0 },
        { MoisNom: 'Aou', Mois: 8, totalBMS: 0 },
        { MoisNom: 'Sep', Mois: 9, totalBMS: 0 },
        { MoisNom: 'Oct', Mois: 10, totalBMS: 0 },
        { MoisNom: 'Nov', Mois: 11, totalBMS: 0 },
        { MoisNom: 'Dec', Mois: 12, totalBMS: 0 },
    ]

    sql = "SELECT MONTH(DA) AS MOIS, COUNT(*) AS TOTALBMS FROM weatherCRCData WHERE (MONTH(DA) IN (1,2,3,4,5,6,7,8,9,10,11,12)) AND (YEAR(CURDATE()+0) = YEAR(DA)) AND (TM='ACKb') GROUP BY MONTH(DA); "

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }

        // enregistrer les BMS de chaque mois
        result.forEach(element => {
            statistique_BMS.forEach(s => {
                if (s['Mois'] == element['MOIS']) {
                    s['totalBMS'] = element['TOTALBMS']
                }
            })
        });

        res.json(statistique_BMS)

    })


});


statistiqueRouter.get('/totalBMS', function(req, res) {
    sql = "SELECT COUNT(*) AS TOTAL FROM weatherCRCData WHERE (TM='ACKb') AND (YEAR(CURDATE()+0) = YEAR(DA)); "

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }

        res.render('statistique/statBMS', { totalBMS: result[0]['TOTAL'] })
    })

});

//------------------------------------------------------------------------------------------------------------//










// statistique des PREV
//------------------------------------------------------------------------------------------------------------//
statistiqueRouter.get('/totalPREVAPI', function(req, res) {
    const statistique_PREV = [
        { MoisNom: 'Jan', Mois: 1, totalPREV: 0 },
        { MoisNom: 'Fev', Mois: 2, totalPREV: 0 },
        { MoisNom: 'Mar', Mois: 3, totalPREV: 0 },
        { MoisNom: 'Avr', Mois: 4, totalPREV: 0 },
        { MoisNom: 'Mai', Mois: 5, totalPREV: 0 },
        { MoisNom: 'Juin', Mois: 6, totalPREV: 0 },
        { MoisNom: 'Juil', Mois: 7, totalPREV: 0 },
        { MoisNom: 'Aou', Mois: 8, totalPREV: 0 },
        { MoisNom: 'Sep', Mois: 9, totalPREV: 0 },
        { MoisNom: 'Oct', Mois: 10, totalPREV: 0 },
        { MoisNom: 'Nov', Mois: 11, totalPREV: 0 },
        { MoisNom: 'Dec', Mois: 12, totalPREV: 0 },
    ]

    sql1 = "SELECT MONTH(DA) AS MOIS, COUNT(*) AS TOTALPREV FROM weatherCRCData WHERE (MONTH(DA) IN (1,2,3,4,5,6,7,8,9,10,11,12)) AND (YEAR(CURDATE()+0) = YEAR(DA)) AND (TM='ACKp') GROUP BY MONTH(DA); "
    db.query(sql1, (err, result) => {
        if (err) {
            throw err
        }

        // enregistrer les PREV de chaque mois
        result.forEach(element => {
            statistique_PREV.forEach(s => {
                if (s['Mois'] == element['MOIS']) {
                    s['totalPREV'] = element['TOTALPREV']
                }
            })
        });


        res.json(statistique_PREV)


    })

});


statistiqueRouter.get('/totalPREV', function(req, res) {
    sql = "SELECT COUNT(*) AS TOTAL FROM weatherCRCData WHERE (TM='ACKp') AND (YEAR(CURDATE()+0) = YEAR(DA)); "

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }

        res.render('statistique/statPREV', { totalPREV: result[0]['TOTAL'] })

    })

});

//------------------------------------------------------------------------------------------------------------//





module.exports = statistiqueRouter;
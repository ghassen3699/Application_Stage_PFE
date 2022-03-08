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




statistiqueRouter.get('/totalSOS', function(req, res) {







    const statistiqueSOS = [
        { 'Mois': 1, 'total': 0 },
        { 'Mois': 2, 'total': 0 },
        { 'Mois': 3, 'total': 0 },
        { 'Mois': 4, 'total': 0 },
        { 'Mois': 5, 'total': 0 },
        { 'Mois': 6, 'total': 0 },
        { 'Mois': 7, 'total': 0 },
        { 'Mois': 8, 'total': 0 },
        { 'Mois': 9, 'total': 0 },
        { 'Mois': 10, 'total': 0 },
        { 'Mois': 11, 'total': 0 },
        { 'Mois': 12, 'total': 0 },
    ]

    sqltest = "SELECT MONTH(DA), COUNT(*) FROM trackingData WHERE (MONTH(DA) IN (1,2,3,4,5,6,7,8,9,10,11,12)) AND (TM='DIS') GROUP BY MONTH(DA)"
    sql = "SELECT YEAR(CURDATE() + 0);"
    db.query(sqltest, (err, result) => {
        if (err) {
            throw err
        }

        // // Tous les SOS de cette année
        // dateDebut = result[0]['YEAR(CURDATE() + 0)'] + "0101" // Debut d'année
        // dateFin = result[0]['YEAR(CURDATE() + 0)'] + "1231" // Fin d'année

        // sql2 = "SELECT Count(*) FROM trackingData WHERE (TM = 'DIS') AND ( DA BETWEEN " + dateDebut + " AND " + dateFin + ");"
        result.forEach(element => {

            statistiqueSOS.forEach(e => {
                if (e['Mois'] == element['MONTH(DA)']) {
                    e['total'] = element['COUNT(*)']
                }
            });

        });
        console.log(statistiqueSOS)
        res.send(statistiqueSOS)
    })


});



module.exports = statistiqueRouter;
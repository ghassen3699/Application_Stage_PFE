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


    sql = "SELECT YEAR(CURDATE() + 0);"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        dateDebut = result[0]['YEAR(CURDATE() + 0)'] + "0101"
        dateFin = result[0]['YEAR(CURDATE() + 0)'] + "1231"
        sql2 = "SELECT Count(*) FROM trackingData WHERE (TM = 'DIS') AND ( DA BETWEEN " + dateDebut + " AND " + dateFin + ");"
        console.log(sql2)
        db.query(sql2, (err, result) => {
            if (err) {
                throw err
            }
            res.send(result)
        })
    })
});



module.exports = statistiqueRouter;
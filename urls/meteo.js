const express = require('express');
const meteoRouter = express.Router();
const mysql = require('mysql');
const { redirect, render } = require('express/lib/response');


//------------------------------- La connexion entre NodeJs et Mysql -------------------------------------//

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ghassen1234@',
    database: 'VMS'
});


db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Mysql')
});

//----------------------------------------------------------------------------------------------------------//



meteoRouter.get('/historique', function(req, res) {
    db.query("SELECT * FROM weatherCRCData ORDER BY ID DESC LIMIT 15", (err, result) => {
        if (err) {
            throw err
        }
        res.render("meteo/historiqueWeatherData", { weatherData: result });
    })
})



meteoRouter.get('/meteo', function(req, res) {
    res.render('meteo/meteoAujourdhui')
});







module.exports = meteoRouter;
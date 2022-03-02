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


// historique meteo envoyer et recue
meteoRouter.get('/historique', function(req, res) {
    db.query("SELECT * FROM weatherCRCData ORDER BY ID DESC LIMIT 15", (err, result) => {
        if (err) {
            throw err
        }
        res.render("meteo/historiqueWeatherData", { weatherData: result });
    })
})


// afficher ma meteo d'aujourd'hui
meteoRouter.get('/meteo', function(req, res) {
    res.render('meteo/meteoAujourdhui')
});


// bar de recherche 
meteoRouter.get('/recherche', function(req, res) {
    const x = req.query.search;

    const sql = "SELECT * FROM weatherCRCData WHERE NA LIKE '%" + x + "%' OR ID_VMS LIKE '%" + x + "%' OR DA LIKE '%" + x + "%' OR TI LIKE '%" + x + "%' OR TM LIKE '%" + x + "%' OR CRC LIKE '%" + x + "%' OR IPADDRESS LIKE '%" + x + "%' ;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        res.render("meteo/historiqueWeatherData", { weatherData: result })
    })
})




module.exports = meteoRouter;
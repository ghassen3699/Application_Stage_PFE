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











////////////////////////////////////////////////////// LES SCHEMINS DE LA METEO ////////////////////////////////////////////////////

//-------------------------------- historique meteo envoyer et reçue ------------------------------//
// Historique Meteo envoyer
meteoRouter.get('/historique', function(req, res) {
    db.query("SELECT * FROM weatherCRCData ORDER BY ID DESC LIMIT 15", (err, result) => {
        if (err) {
            throw err
        }
        res.render("meteo/historiqueWeatherData", { weatherData: result });
    })
});


// Historique Meteo reçue
meteoRouter.get('/historiqueMeteoEnvoyer', function(req, res) {
    const sql = "SELECT * FROM weatherCRCData WHERE (TM='ACKp') AND (DA = CURDATE()+0) ORDER BY ID DESC;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        res.render("meteo/historiqueWeatherData", { weatherData: result });
    })
});
//-------------------------------------------------------------------------------------------------//



//-------------------------------- afficher ma meteo d'aujourd'hui ---------------------------------//
// La Meteo d'aujourd'hui
meteoRouter.get('/meteo', function(req, res) {
    res.render('meteo/meteoAujourdhui')
});
//---------------------------------------------------------------------------------------------------//



//--------------------------------- bar de recherche ------------------------------------------------//
// Le bar de recherche
meteoRouter.get('/recherche', function(req, res) {
    const recherche = req.query.search

    const sql = "SELECT * FROM weatherCRCData WHERE NA LIKE '%" + recherche + "%' OR ID_VMS LIKE '%" + recherche + "%' OR DA LIKE '%" + recherche + "%' OR TI LIKE '%" + recherche + "%' OR TM LIKE '%" + recherche + "%' OR CRC LIKE '%" + recherche + "%' OR IPADDRESS LIKE '%" + recherche + "%' ;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        res.render("meteo/historiqueWeatherData", { weatherData: result })
    })
});
//----------------------------------------------------------------------------------------------------//


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



module.exports = meteoRouter;
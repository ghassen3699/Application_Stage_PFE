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


// Historique Meteo reçue
meteoRouter.get('/historiqueMeteoEnvoyer', function(req, res) {
    const sql = "SELECT * FROM weatherCRCData ORDER BY ID DESC LIMIT 10;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render("meteo/historiqueWeatherData", { weatherData: result });
    })
});

// La fonction pagination de la page historique 
meteoRouter.get('/paginationMeteo', function(req, res) {
    const pagination = req.query.pagination
    const sql = "SELECT * FROM weatherCRCData ORDER BY ID DESC LIMIT " + pagination + " ;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render("meteo/historiqueWeatherData", { weatherData: result })
    })
});
//-------------------------------------------------------------------------------------------------//


// afficher l'historique d'aujourd'hui
meteoRouter.get('/historiqueAujourdhui', function(req, res) {
    const sql = "SELECT * FROM weatherCRCData WHERE DA = CURDATE()+0 ORDER BY ID DESC LIMIT 10 ;"

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render("meteo/historiqueAujourdhui", { weatherData: result })
    })
});




// la fonction pagination de la page historique Meteo Aujourd'hui
meteoRouter.get('/AujourdhuiHistoriqueMeteo', function(req, res) {
    const pagination = req.query.pagination
    const sql = "SELECT * FROM weatherCRCData WHERE DA = CURDATE()+0 ORDER BY ID DESC LIMIT " + pagination + ";"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render("meteo/historiqueAujourdhui", { weatherData: result })
    })
});



//-------------------------------- afficher ma meteo d'aujourd'hui ---------------------------------//
// La Meteo d'aujourd'hui
meteoRouter.get('/meteo', function(req, res) {
    return res.render('meteo/meteoAujourdhui')
});
//---------------------------------------------------------------------------------------------------//



//--------------------------------- La fonction de recherche de la page historique des meteo ------------------------------------------------//
// Le bar de recherche
meteoRouter.get('/recherche', function(req, res) {
    const recherche = req.query.search

    const sql = "SELECT * FROM weatherCRCData WHERE NA LIKE '%" + recherche + "%' OR ID_VMS LIKE '%" + recherche + "%' OR DA LIKE '%" + recherche + "%' OR TI LIKE '%" + recherche + "%' OR TM LIKE '%" + recherche + "%' OR CRC LIKE '%" + recherche + "%' OR IPADDRESS LIKE '%" + recherche + "%' ;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render("meteo/historiqueWeatherData", { weatherData: result })
    })
});
//----------------------------------------------------------------------------------------------------//




// la fonction recherche de la page historique Meteo Aujourd'hui
meteoRouter.get('/historiqueAujourdhuiRecherche', function(req, res) {
    const recherche = req.query.search
    const sql = "SELECT * FROM weatherCRCData WHERE (DA = CURDATE()+0) AND (NA LIKE '%" + recherche + "%' OR ID_VMS LIKE '%" + recherche + "%' OR DA LIKE '%" + recherche + "%' OR TI LIKE '%" + recherche + "%' OR TM LIKE '%" + recherche + "%' OR CRC LIKE '%" + recherche + "%' OR IPADDRESS LIKE '%" + recherche + "%') ;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render("meteo/historiqueAujourdhui", { weatherData: result })
    })
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



module.exports = meteoRouter;
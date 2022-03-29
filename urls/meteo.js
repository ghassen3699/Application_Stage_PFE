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



//-------------------------------- la page principale de la meteo ---------------------------------//
// La Meteo d'aujourd'hui
meteoRouter.get('/meteo', function(req, res) {
    return res.render('meteo/meteoAujourdhui')
});
//---------------------------------------------------------------------------------------------------//







//-------------------------------- historique meteo pour aujourd'hui ------------------------------//


// Historique PREV reçue pour aujourd'hui
meteoRouter.get('/historiqueAujourdhuiPREV', function(req, res) {
    const sql = "SELECT CRC, TY, TI, DA FROM CRCData WHERE( (TY LIKE '%PREV%')) AND (DA = CURDATE()+0) LIMIT 10;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render("meteo/historiqueAujourdhui", { weatherDataAujourdhui: result });
    })
});


// La fonction pagination de la page historique PREV d'aujourd'hui 
meteoRouter.get('/historiqueAujourdhuiPREV_pagination', function(req, res) {
    const pagination = req.query.pagination
    const sql = "SELECT CRC, TY, TI, DA FROM CRCData WHERE( (TY LIKE '%PREV%')) AND (DA = CURDATE()+0) LIMIT " + pagination + ";"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render("meteo/historiqueAujourdhui", { weatherDataAujourdhui: result })
    })
});




// Historique BMS recue pour aujourd'hui
meteoRouter.get('/historiqueAujourdhuiBMS', function(req, res) {
    const sql = "SELECT CRC, TY, TI, DA FROM CRCData WHERE((TY LIKE '%BMS%')) AND (DA = CURDATE()+0) LIMIT 10;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render("meteo/historiqueAujourdhuiBMS", { weatherDataAujourdhui: result });
    })
});


// La fonction pagination de la page meteo d'aujourd'hui 
meteoRouter.get('/historiqueAujourdhuiBMS_pagination', function(req, res) {
    const pagination = req.query.pagination
    const sql = "SELECT CRC, TY, TI, DA FROM CRCData WHERE((TY LIKE '%BMS%')) AND (DA = CURDATE()+0) LIMIT " + pagination + ";"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render("meteo/historiqueAujourdhuiBMS", { weatherDataAujourdhui: result })
    })
});

//-------------------------------------------------------------------------------------------------//





//-------------------------------- historique meteo recue par l'iNM ------------------------------//

// afficher l'historique de la meteo 
meteoRouter.get('/historiqueMeteo', function(req, res) {
    const sql = "SELECT DISTINCT CRC, TY, TI, DA FROM CRCData WHERE (TY LIKE '%PREV%') OR (TY LIKE '%BMS%') LIMIT 10;"

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render("meteo/historiqueWeatherData", { weatherData: result })
    })
});





// la fonction pagination de la page historique Meteo 
meteoRouter.get('/historiqueMeteoPagination', function(req, res) {
    const pagination = req.query.pagination
    const sql = "SELECT DISTINCT CRC, TY,DA  FROM  VMS.CRCData WHERE ( (TY LIKE '%BMS%') OR (TY LIKE '%PREV%') ) AND (DA<= (CURRENT_DATE()+0) AND DA > (CURRENT_DATE()+0) - " + pagination + ") ;"

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render("meteo/historiqueWeatherData", { weatherData: result })
    })
});
//-------------------------------------------------------------------------------------------------//

















//--------------------------------- La fonction de recherche de la page historique des meteo pour aujourd'hui ------------------------------------------------//


// Le bar de recherche
meteoRouter.get('/historiqueMeteoRecherche', function(req, res) {
    const recherche = req.query.search

});




// la fonction recherche de la page historique PREV Aujourd'hui
meteoRouter.get('/historiqueAujourdhuiRecherche_PREV', function(req, res) {
    const recherche = req.query.search

    const sql = "SELECT DISTINCT CRC, TY, TI, DA FROM CRCData WHERE ( (TY LIKE '%PREV%') ) AND ( (DA = CURDATE()+0) ) AND  ( (CRC = '" + recherche + "') OR (TY = '" + recherche + "') OR (TI = '" + recherche + "') ) LIMIT 100;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render("meteo/historiqueAujourdhui", { weatherDataAujourdhui: result })
    })
});


// la fonction recherche de la page historique BMS Aujourd'hui
meteoRouter.get('/historiqueAujourdhuiRecherche_BMS', function(req, res) {
    const recherche = req.query.search

    const sql = "SELECT DISTINCT CRC, TY, TI, DA FROM CRCData WHERE ( (TY LIKE '%BMS%') ) AND ( (DA = CURDATE()+0) ) AND  ( (CRC = '" + recherche + "') OR (TY = '" + recherche + "') OR (TI = '" + recherche + "') ) LIMIT 100;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render("meteo/historiqueAujourdhuiBMS", { weatherDataAujourdhui: result })
    })
});




// la fonction recherche de la page historique des Meteos
meteoRouter.get('/historiqueRecherche', function(req, res) {
    const recherche = req.query.search

    const sql = "SELECT DISTINCT CRC, TY, TI, DA FROM CRCData WHERE ( (TY LIKE '%PREV%') OR (TY LIKE '%BMS%') ) AND  ( (CRC = '" + recherche + "') OR (TY = '" + recherche + "') OR (DA = '" + recherche + "') OR (TI = '" + recherche + "') )  LIMIT 100;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render("meteo/historiqueWeatherData", { weatherData: result })
    })
});
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//



module.exports = meteoRouter;
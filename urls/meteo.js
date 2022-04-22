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
    var user = req.session.user

    if (user) {
        return res.render('meteo/meteoAujourdhui', { user: user })

    } else {
        res.redirect('/')
    }
});
//---------------------------------------------------------------------------------------------------//







//-------------------------------- historique meteo pour aujourd'hui ------------------------------//


// Historique PREV reçue pour aujourd'hui
meteoRouter.get('/historiqueAujourdhuiPREV', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql = "SELECT ID, CRC, TY, TI, DA FROM CRCData WHERE( (TY LIKE '%PREV%')) AND (DA = CURDATE()+0) ORDER BY ID DESC LIMIT 10;"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render("meteo/historiqueAujourdhui", { weatherDataAujourdhui: result, user: user });
        })
    } else {
        res.redirect('/')
    }

});


// La fonction pagination de la page historique PREV d'aujourd'hui 
meteoRouter.get('/historiqueAujourdhuiPREV_pagination', function(req, res) {
    var user = req.session.user

    if (user) {
        const pagination = req.query.pagination
        const sql = "SELECT ID, CRC, TY, TI, DA FROM CRCData WHERE( (TY LIKE '%PREV%')) AND (DA = CURDATE()+0) ORDER BY ID DESC LIMIT " + pagination + ";"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render("meteo/historiqueAujourdhui", { weatherDataAujourdhui: result, user: user })
        })
    } else {
        res.redirect('/')
    }

});




// Historique BMS recue pour aujourd'hui
meteoRouter.get('/historiqueAujourdhuiBMS', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql = "SELECT ID, CRC, TY, TI, DA FROM CRCData WHERE((TY LIKE '%BMS%')) AND (DA = CURDATE()+0) ORDER BY ID DESC LIMIT 10;"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render("meteo/historiqueAujourdhuiBMS", { weatherDataAujourdhui: result, user: user });
        })
    } else {
        res.redirect('/')
    }

});


// La fonction pagination de la page meteo d'aujourd'hui 
meteoRouter.get('/historiqueAujourdhuiBMS_pagination', function(req, res) {
    var user = req.session.user

    if (user) {
        const pagination = req.query.pagination
        const sql = "SELECT ID, CRC, TY, TI, DA FROM CRCData WHERE((TY LIKE '%BMS%')) AND (DA = CURDATE()+0) ORDER BY ID DESC LIMIT " + pagination + ";"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render("meteo/historiqueAujourdhuiBMS", { weatherDataAujourdhui: result, user: user })
        })
    } else {
        res.redirect('/')
    }

});

//-------------------------------------------------------------------------------------------------//





//-------------------------------- historique meteo recue par l'iNM ------------------------------//

// afficher l'historique de la meteo 
meteoRouter.get('/historiqueMeteo', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql = "SELECT DISTINCT ID, CRC, TY, TI, DA FROM CRCData WHERE (TY LIKE '%PREV%') OR (TY LIKE '%BMS%') ORDER BY ID DESC LIMIT 10;"

        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render("meteo/historiqueWeatherData", { weatherData: result, user: user })
        })
    } else {
        res.redirect('/')
    }

});





// la fonction pagination de la page historique Meteo 
meteoRouter.get('/historiqueMeteoPagination', function(req, res) {
    var user = req.session.user

    if (user) {
        const pagination = req.query.pagination
        const sql = "SELECT DISTINCT ID, CRC, TY,DA  FROM  VMS.CRCData WHERE ( (TY LIKE '%BMS%') OR (TY LIKE '%PREV%') ) AND (DA<= (CURRENT_DATE()+0) AND DA > (CURRENT_DATE()+0) - " + pagination + ") ;"

        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render("meteo/historiqueWeatherData", { weatherData: result, user: user })
        })
    } else {
        res.redirect('/')
    }

});
//-------------------------------------------------------------------------------------------------//

















//--------------------------------- La fonction de recherche de la page historique des meteo pour aujourd'hui ------------------------------------------------//


// Le bar de recherche
meteoRouter.get('/historiqueMeteoRecherche', function(req, res) {
    const recherche = req.query.search

});




// la fonction recherche de la page historique PREV Aujourd'hui
meteoRouter.get('/historiqueAujourdhuiRecherche_PREV', function(req, res) {
    var user = req.session.user

    if (user) {
        const recherche = req.query.search

        const sql = "SELECT DISTINCT ID, CRC, TY, TI, DA FROM CRCData WHERE ( (TY LIKE '%PREV%') ) AND ( (DA = CURDATE()+0) ) AND  ( (CRC = '" + recherche + "') OR (TY = '" + recherche + "') OR (TI = '" + recherche + "') ) ORDER BY ID DESC LIMIT 100;"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render("meteo/historiqueAujourdhui", { weatherDataAujourdhui: result, user: user })
        })
    } else {
        res.redirect('/')
    }

});


// la fonction recherche de la page historique BMS Aujourd'hui
meteoRouter.get('/historiqueAujourdhuiRecherche_BMS', function(req, res) {
    var user = req.session.user

    if (user) {
        const recherche = req.query.search

        const sql = "SELECT DISTINCT ID ,CRC, TY, TI, DA FROM CRCData WHERE ( (TY LIKE '%BMS%') ) AND ( (DA = CURDATE()+0) ) AND  ( (CRC = '" + recherche + "') OR (TY = '" + recherche + "') OR (TI = '" + recherche + "') ) ORDER BY ID DESC LIMIT 100;"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render("meteo/historiqueAujourdhuiBMS", { weatherDataAujourdhui: result, user: user })
        })
    } else {
        res.redirect('/')
    }

});




// la fonction recherche de la page historique des Meteos
meteoRouter.get('/historiqueRecherche', function(req, res) {
    var user = req.session.user

    if (user) {
        const recherche = req.query.search

        const sql = "SELECT DISTINCT ID, CRC, TY, TI, DA FROM CRCData WHERE ( (TY LIKE '%PREV%') OR (TY LIKE '%BMS%') ) AND  ( (CRC = '" + recherche + "') OR (TY = '" + recherche + "') OR (DA = '" + recherche + "') OR (TI = '" + recherche + "') ) ORDER BY ID DESC  LIMIT 100;"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render("meteo/historiqueWeatherData", { weatherData: result, user: user })
        })
    } else {
        res.redirect('/')
    }

});
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//



module.exports = meteoRouter;
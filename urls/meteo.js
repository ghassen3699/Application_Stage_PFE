const express = require('express');
const meteoRouter = express.Router();
const mysql = require('mysql');
const fs = require('fs');

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
        const sql = "SELECT ID, CRC, TY, TI, DA FROM CRCData WHERE( (TY LIKE '%PREV%')) AND (DA = CURDATE()+0) ORDER BY ID DESC ;"
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


// // La fonction pagination de la page historique PREV d'aujourd'hui 
// meteoRouter.get('/historiqueAujourdhuiPREV_pagination', function(req, res) {
//     var user = req.session.user

//     if (user) {
//         const pagination = req.query.pagination
//         const sql = "SELECT ID, CRC, TY, TI, DA FROM CRCData WHERE( (TY LIKE '%PREV%')) AND (DA = CURDATE()+0) ORDER BY ID DESC LIMIT " + pagination + ";"
//         db.query(sql, (err, result) => {
//             if (err) {
//                 throw err
//             }
//             return res.render("meteo/historiqueAujourdhui", { weatherDataAujourdhui: result, user: user })
//         })
//     } else {
//         res.redirect('/')
//     }

// });




// Historique BMS recue pour aujourd'hui
meteoRouter.get('/historiqueAujourdhuiBMS', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql = "SELECT ID, CRC, TY, TI, DA FROM CRCData WHERE((TY LIKE '%BMS%')) AND (DA = CURDATE()+0) ORDER BY ID DESC ;"
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


// // La fonction pagination de la page meteo d'aujourd'hui 
// meteoRouter.get('/historiqueAujourdhuiBMS_pagination', function(req, res) {
//     var user = req.session.user

//     if (user) {
//         const pagination = req.query.pagination
//         const sql = "SELECT ID, CRC, TY, TI, DA FROM CRCData WHERE((TY LIKE '%BMS%')) AND (DA = CURDATE()+0) ORDER BY ID DESC LIMIT " + pagination + ";"
//         db.query(sql, (err, result) => {
//             if (err) {
//                 throw err
//             }
//             return res.render("meteo/historiqueAujourdhuiBMS", { weatherDataAujourdhui: result, user: user })
//         })
//     } else {
//         res.redirect('/')
//     }

// });

//-------------------------------------------------------------------------------------------------//





//-------------------------------- historique meteo recue par l'iNM ------------------------------//

// afficher l'historique de la meteo 
meteoRouter.get('/historiqueMeteo', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql = "SELECT DISTINCT ID, CRC, TY, TI, DA FROM CRCData WHERE (TY LIKE '%PREV%') OR (TY LIKE '%BMS%') ORDER BY ID ;"

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





// // la fonction pagination de la page historique Meteo 
// meteoRouter.get('/historiqueMeteoPagination', function(req, res) {
//     var user = req.session.user

//     if (user) {
//         const pagination = req.query.pagination
//         const sql = "SELECT DISTINCT ID, CRC, TY,DA  FROM  VMS.CRCData WHERE ( (TY LIKE '%BMS%') OR (TY LIKE '%PREV%') ) AND (DA<= (CURRENT_DATE()+0) AND DA > (CURRENT_DATE()+0) - " + pagination + ") ORDER BY ID DESC ;"

//         db.query(sql, (err, result) => {
//             if (err) {
//                 throw err
//             }
//             return res.render("meteo/historiqueWeatherData", { weatherData: result, user: user })
//         })
//     } else {
//         res.redirect('/')
//     }

// });
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

        const sql = "SELECT DISTINCT ID, CRC, TY, TI, DA FROM CRCData WHERE ( (TY LIKE '%PREV%') ) AND ( (DA = CURDATE()+0) ) AND  ( (CRC = '" + recherche + "') OR (TY = '" + recherche + "') OR (TI = '" + recherche + "') ) ORDER BY ID DESC ;"
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

        const sql = "SELECT DISTINCT ID ,CRC, TY, TI, DA FROM CRCData WHERE ( (TY LIKE '%BMS%') ) AND ( (DA = CURDATE()+0) ) AND  ( (CRC = '" + recherche + "') OR (TY = '" + recherche + "') OR (TI = '" + recherche + "') ) ORDER BY ID DESC ;"
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




// // la fonction recherche de la page historique des Meteos
// meteoRouter.get('/historiqueRecherche', function(req, res) {
//     var user = req.session.user

//     if (user) {
//         const recherche = req.query.search

//         const sql = "SELECT DISTINCT ID, CRC, TY, TI, DA FROM CRCData WHERE ( (TY LIKE '%PREV%') OR (TY LIKE '%BMS%') ) AND  ( (CRC = '" + recherche + "') OR (TY = '" + recherche + "') OR (DA = '" + recherche + "') OR (TI = '" + recherche + "') ) ORDER BY ID DESC ;"
//         db.query(sql, (err, result) => {
//             if (err) {
//                 throw err
//             }
//             return res.render("meteo/historiqueWeatherData", { weatherData: result, user: user })
//         })
//     } else {
//         res.redirect('/')
//     }

// });
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//



meteoRouter.get('/BMSAPI', function(req, res) {


    fs.readFile("/home/ghassen/Desktop/Application_Stage_PFE/BMS_PREV_data/BMSFormat.json", (err, data) => {
        if (err) {
            throw err
        }
        var listeBMSInfo = []
        var BMSData = JSON.parse(data)
        BMSData.forEach(bmsInfo => {


            var meteorologieInfo = bmsInfo['BMS']['meteorologie_Ar'].split('-')

            meteorologieInfo = {
                'type': meteorologieInfo[0].split(':')[0],
                'zoneA': meteorologieInfo[1].split(':')[0].split(' ')[1] + ' ' + meteorologieInfo[1].split(':')[0].split(' ')[2],
                'BMSZoneA': meteorologieInfo[1].split(':')[1],
                'zoneB': meteorologieInfo[1].split(':')[0].split(' ')[4] + ' ' + meteorologieInfo[1].split(':')[0].split(' ')[5],
                'BMSZoneB': meteorologieInfo[1].split(':')[1],
                'zoneC': meteorologieInfo[2].split(':')[0],
                'BMSZoneC': meteorologieInfo[2].split(':')[1]
            }

            listeBMSInfo.push({ 'titre': bmsInfo['BMS']['avisde'], 'dateDébut': bmsInfo['BMS']['validatedebut'], 'dateFin': bmsInfo['BMS']['validatefin'], 'heureDebut': bmsInfo['BMS']['validateheuredebut'], 'heureFin': bmsInfo['BMS']['validateheurefin'], 'meteorologieInfo': meteorologieInfo })
        });
        return res.json(listeBMSInfo)
    });
})



module.exports = meteoRouter;
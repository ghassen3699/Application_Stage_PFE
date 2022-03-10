const express = require('express');
const mysql = require('mysql');
const moment = require('moment');
const validationAbonnement = require('../fonctionDeTravail/validationAbonnement');
const extraireDate = require('../fonctionDeTravail/extraireDate');
const { redirect, render } = require('express/lib/response');
const navireRouter = express.Router();





//------------------------------- La connexion entre NodeJs et Mysql -------------------------------------//

const db = mysql.createConnection({
    host: 'localhost',
    //host: '193.95.21.63',
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









///////////////////////////////////////////////////////////// LES CRUD DE LA TABLE TOPINFO ///////////////////////////////////////////////////////////////////////

//---------------------- Ajouter navire --------------------------//
// GET method
navireRouter.get('/ajouter', function(req, res) {

    res.render('navire/ajouterNavire')
});

// POST method
navireRouter.post('/ajouter', function(req, res) {


    const sql = "INSERT INTO tobInfo VALUES(?,?,?,?,?,?,?,?,?,?)"


    db.query(sql, [req.body.id_nav, req.body.NA, req.body.ID_VMS, req.body.REG_ID, req.body.IMEI, req.body.ICCID, req.body.RC, req.body.KEY_AES, req.body.DABEG, req.body.DAEND], (err, result) => {
        if (err) {
            throw err; // remplacer par 404 NOT FOUND
        }
    });
    res.redirect('/navire/navires')
});
//-----------------------------------------------------------------//








//------------------------ afficher tous les navires --------------//
navireRouter.get('/navires', function(req, res) {

    db.query("SELECT * FROM tobInfo order by ID DESC LIMIT 10;", (err, result) => {
        if (err) {
            throw err; // remplacer par 404 NOT FOUND
        }

        res.render('navire/touslesnavires', { navires: result });
    });

});
//-------------------------------------------------------------------//





//------------------------- le fonctionement de la bar de recherche -----------------------//

// la fonction recherche de la page navire
navireRouter.get('/recherche', function(req, res) {

    const search = req.query.recherche

    const sql = "SELECT * FROM tobInfo WHERE NA LIKE '%" + search + "%' OR ID_VMS LIKE '%" + search + "%' OR REG_ID LIKE '%" + search + "%' OR IMEI LIKE '%" + search + "%' OR RC LIKE '%" + search + "%' OR KEY_AES LIKE '%" + search + "%' OR DAEnd LIKE '%" + search + "%';"

    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }
        res.render('navire/touslesnavires', { navires: result })
    })

});

// la fonction recherche de la page historique des positions
navireRouter.get('/:name/recherchePosition', function(req, res) {
    const search = req.query.recherche
    const sql = "SELECT * FROM trackingData WHERE (NA = '" + req.params.name + "') AND (TM = 'POS') AND (DA LIKE '%" + search + "%' OR TI LIKE '%" + search + "%' OR LT LIKE '%" + search + "%' OR LG LIKE '%" + search + "%' OR CO LIKE '%" + search + "%' OR SP LIKE '%" + search + "%' OR COM LIKE '%" + search + "%' OR TM LIKE '%" + search + "%' OR IPADDRESS LIKE '%" + search + "%') LIMIT 20;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }
        res.render('navire/totalposition', { navirePositions: result, navireName: req.params.name })
    })
});



// la fonction recherche de la page historique des SOS
navireRouter.get('/:name/rechercheSOS', function(req, res) {
    const search = req.query.recherche

    const sql = "SELECT * FROM trackingData WHERE (NA = '" + req.params.name + "') AND (TM = 'DIS') AND (DA LIKE '%" + search + "%' OR TI LIKE '%" + search + "%' OR LT LIKE '%" + search + "%' OR LG LIKE '%" + search + "%' OR CO LIKE '%" + search + "%' OR SP LIKE '%" + search + "%' OR COM LIKE '%" + search + "%' OR TM LIKE '%" + search + "%' OR IPADDRESS LIKE '%" + search + "%') LIMIT 20;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }
        res.render('navire/totalSOS', { navireSOS: result, navireName: req.params.name })
    })
});



// la fonction recherche de la page historique des bulletins
navireRouter.get('/:name/rechercheBulletins', function(req, res) {
    const search = req.query.recherche

    const sql = "SELECT * FROM weatherCRCData where (NA = '" + req.params.name + "') AND (DA LIKE '%" + search + "%' OR TI LIKE '%" + search + "%' OR TM = '" + search + "' OR CRC LIKE '%" + search + "%' OR IPADDRESS LIKE '%" + search + "%');"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        res.render('navire/totalBulletins', { navireBulletins: result, navireName: req.params.name })
    })
});
//------------------------------------------------------------------------//





//------------------- afficher le compte de la navire  ---------------------//


// la methode GET
navireRouter.get('/navire/:id', function(req, res) {

    const id = "'" + req.params.id + "'"

    //les requetes SQL de la page
    //---------------------------------------------------------------------------------------------------------//
    sql1 = "SELECT * FROM tobInfo WHERE NA = " + id + ";";
    sql2 = "SELECT COUNT(*) AS TOTAL FROM trackingData WHERE NA = " + id + ";";
    sql3 = "SELECT COUNT(*) AS TOTAL FROM trackingData WHERE NA = " + id + " AND TM LIKE '%DIS%';"
    sql4 = "SELECT COUNT(*) AS TOTAL FROM weatherCRCData WHERE (NA = " + id + ") AND (TM LIKE '%ACKp%' OR TM LIKE '%ACKb%');"
    sql5 = "SELECT * FROM trackingData WHERE NA = " + id + " order by ID desc LIMIT 1;";
    sql6 = "SELECT * FROM weatherCRCData WHERE NA = " + id + " AND TM LIKE '%ACKp%' ORDER BY ID DESC LIMIT 1;"

    //---------------------------------------------------------------------------------------------------------//

    // la concatination des requetes 
    sql = sql1 + sql2 + sql3 + sql4 + sql5 + sql6
    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }

        // Configuration de la date et la position avec Moment.JS
        //----------------------------------------------------------//
        let dateDernierPosition, LT, LG, dateDernierMeteo

        //  extraire la date et la position
        // La Position 

        dateDernierPosition = moment(result[4][0]['DA']).fromNow()
        LT = result[4][0]['LT']
        LG = result[4][0]['LG']

        // La date
        result[5].forEach(element => {
            dateDernierMeteo = moment(element.DA).fromNow()
        });

        //-----------------------------------------------------------//


        dateAbonnement = extraireDate(result)
        const resultatCouleur = validationAbonnement(dateAbonnement)


        res.render('navire/singleNavire', {
            navire: result[0], // retourner les données de la navire 
            nombrePositionEnvoyer: result[1][0]['TOTAL'], // retourner le nombre total des positions de la navire 
            nombreSOS: result[2][0]['TOTAL'], // retourner le nombre des SOS total de la navire 
            nombreBulletins: result[3][0]['TOTAL'], // retourner les nombre des Bulletins total de la navire 
            dateDernierPosition: dateDernierPosition, // retourner la date de la dernier position 
            position: { LT: LT, LG: LG }, // les cordonnées de la position 
            dateDernierMeteo: dateDernierMeteo, // la date de la dernieres Meteo
            couleurValidationAbonnement: resultatCouleur[0]['couleur'], // couleur d'abonnement 
            msgValidationAbonnement: resultatCouleur[0]['msg'], // msg d'abonnement 
        })
    });

});
//----------------------------------------------------------------------------------------------//




//------------------- modifier navire ------------------------------------//
// GET method
navireRouter.get('/modifier/:id', function(req, res) {
    const sql = "SELECT * FROM tobInfo Where ID = ? "
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }

        res.render('navire/modifierNavire', { navire: result, name: result[0]['NA'] })
    })

});


// POST method
navireRouter.post('/modifier/:id', function(req, res) {
    const sql = "SELECT * FROM tobInfo WHERE ID = ?"
    db.query(sql, [req.params.id, ], (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }
        const sqlUpdate = "UPDATE tobInfo SET NA = ?, ID_VMS = ?, REG_ID = ?, IMEI = ?, ICCID = ?, RC = ?, KEY_AES = ?, DA_BEG = ?, DA_END = ? WHERE ID = ?"
        db.query(sqlUpdate, [req.body.NA, req.body.ID_VMS, req.body.REG_ID, req.body.IMEI, req.body.ICCID, req.body.RC, req.body.KEY_AES, req.body.DABEG, req.body.DAEND, req.params.id, ], (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }
        })
    })
    res.redirect('/navire/navires')
});
//------------------------------------------------------------------------//







//------------------- supprimer navire ------------------------------------//

// GET method
navireRouter.get('/supprimer/:id', function(req, res) {
    const sql = "SELECT * FROM tobInfo WHERE ID = ?"
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }
        res.render('navire/validSupprission', { navire: result })
    })

});

// POST method
navireRouter.post('/supprimer/:id', function(req, res) {
    const sql = "SELECT * FROM tobInfo WHERE ID = ?"
    db.query(sql, (req.params.id), (err, result) => {
        if (err) {
            throw err
        }
        const sqlDelete = "DELETE FROM tobInfo where id = ?"
        db.query(sqlDelete, (req.params.id), (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }
        })
    })
    res.redirect('/navire/navires')
});
//------------------------------------------------------------------------//








// afficher l'historique du tracking de la navire
//---------------------------------------------------------------------------//
navireRouter.get('/historique/:name', function(req, res) {
    const sql = "SELECT * FROM trackingData WHERE NA = ? LIMIT 20"
    db.query(sql, (req.params.name), (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }
        res.render('navire/historiqueTracking', { navire: result })
    })
});
//---------------------------------------------------------------------------//







// ------------------ afficher l'historique des positions, des SOS et des bulletins ------------------//

// Afficher les positions
navireRouter.get('/totalposition/:name', function(req, res) {
    const id = "'" + req.params.name + "'"
    sql = "SELECT * FROM trackingData WHERE NA = " + id + " LIMIT 20;";

    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }

        res.render('navire/totalposition', { navirePositions: result, navireName: result[0]['NA'] })
    })
});

// afficher les SOS
navireRouter.get('/totalSOS/:name', function(req, res) {
    const id = "'" + req.params.name + "'"
    sql = "SELECT * FROM trackingData WHERE (NA = " + id + ") AND (TM LIKE '%DIS%');"

    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }

        let navireName;

        res.render('navire/totalSOS', { navireSOS: result, navireName: result[0]['NA'] })
    })
});



// afficher les bulletins
navireRouter.get('/totalBulletins/:name', function(req, res) {
    const id = "'" + req.params.name + "'"
    sql = "SELECT * FROM weatherCRCData WHERE (NA = " + id + ") AND (TM LIKE '%ACKp%' OR TM LIKE '%ACKb%') ;"

    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }

        res.render('navire/totalBulletins', { navireBulletins: result, navireName: result[0]['NA'] })
    })
});
//--------------------------------------------------------------------------------------------------------//







//---------------------------------- Supprimer les positions de la navire -------------------------------------//
// GET method
navireRouter.get('/supprimerPosition/:id', function(req, res) {
    res.render('navire/validSupprission')
});

// POST method
navireRouter.post('/supprimerPosition/:id', function(req, res) {
    const sql = "SELECT * FROM trackingData WHERE ID = ?"
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }
        const sqlDelete = "DELETE FROM trackingData WHERE ID = ?"
        db.query(sqlDelete, (req.params.id), (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }
        })
    })
    res.redirect('/navire/navires')

});
//----------------------------------------------------------------------------------------------------------------//









//---------------------------------- Supprimer les SOS de la navire -------------------------------------------------//
// GET method
navireRouter.get('/supprimerSOS/:id', function(req, res) {
    res.render('navire/validSupprission')
});

// POST method
navireRouter.post('/supprimerSOS/:id', function(req, res) {
    const sql = "SELECT * FROM trackingData WHERE ID = ?"
    db.query(sql, (req.params.id), (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }
        const sqlDelete = "DELETE FROM trackingData where id = ?"
        db.query(sqlDelete, (req.params.id), (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }
        })
    })
    res.redirect('/navire/navires')

});
//-------------------------------------------------------------------------------------------------------------------//





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





// l'exportation du module
module.exports = navireRouter;
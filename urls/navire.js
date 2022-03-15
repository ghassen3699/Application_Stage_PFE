const express = require('express');
const mysql = require('mysql');
const moment = require('moment');
const validationAbonnement = require('../fonctionDeTravail/validationAbonnement');
const extraireDate = require('../fonctionDeTravail/extraireDate');
const testDate = require('../fonctionDeTravail/testerDate');
const navireModel = require('../fonctionDeTravail/ModeleNavire');
const { redirect, render } = require('express/lib/response');
const validationUndifined = require('../fonctionDeTravail/validationUndefined');
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
    var msg = ""
    res.render('navire/ajouterNavire', { msg: msg })
});

// POST method
navireRouter.post('/ajouter', function(req, res) {




    const sql2 = "INSERT INTO tobInfo VALUES(?,?,?,?,?,?,?,?,?,?)"
    const sql1 = "SELECT * FROM tobInfo WHERE ID = '" + req.body.id_nav + "' OR ID_VMS = '" + req.body.ID_VMS + "';";
    console.log(sql1)
        // tester si le ID n'existe pas 
    db.query(sql1, (err, result) => {

        if (err) {
            throw err;
        }
        console.log(result)
            // si les données est vrais on enregistre la navire 
        if ((result.length === 0) && (testDate(req.body.DABEG, 1)) && (testDate(req.body.DAEND, 1))) {

            db.query(sql2, [req.body.id_nav, req.body.NA, req.body.ID_VMS, req.body.REG_ID, req.body.IMEI, req.body.ICCID, req.body.RC, req.body.KEY_AES, testDate(req.body.DAEND, 0), testDate(req.body.DAEND, 0)], (err, result) => {
                if (err) {
                    throw err;
                }
            });
            res.redirect('/navire/navires')


        } else {
            msg = "Entrer correctement les données"
            res.render('navire/ajouterNavire', { msg: msg })
        }
    });





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
    sql1 = "SELECT * FROM tobInfo WHERE ID_VMS = " + id + ";";
    sql2 = "SELECT COUNT(*) AS TOTAL FROM trackingData WHERE ID_VMS = " + id + ";";
    sql3 = "SELECT COUNT(*) AS TOTAL FROM trackingData WHERE ID_VMS = " + id + " AND TM LIKE '%DIS%';"
    sql4 = "SELECT COUNT(*) AS TOTAL FROM weatherCRCData WHERE (ID_VMS = " + id + ") AND (TM LIKE '%ACKp%' OR TM LIKE '%ACKb%');"
    sql5 = "SELECT * FROM trackingData WHERE ID_VMS = " + id + " ORDER by ID DESC LIMIT 1;";
    sql6 = "SELECT * FROM weatherCRCData WHERE ID_VMS = " + id + " AND TM LIKE '%ACKp%' ORDER BY ID DESC LIMIT 1;"

    //---------------------------------------------------------------------------------------------------------//

    // la concatination des requetes 
    sql = sql1 + sql2 + sql3 + sql4 + sql5 + sql6
    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }


        var dateDernierPosition, LT, LG, dateDernierMeteo, resultatCouleur


        // La date du derniere position & les caractéristiques 
        if (result[4].length > 0) {
            dateDernierPosition = moment(result[4][0]['DA']).fromNow() // Configuration de la date et la position avec Moment.JS
            LT = result[4][0]['LT']
            LG = result[4][0]['LG']

        }


        if (result[5].length > 0) {
            // La date de la dernier meteo
            result[5].forEach(element => {
                dateDernierMeteo = moment(element.DA).fromNow()
            });
        }


        if (result[0].length > 0) {
            // la date de l'abonnement & le couleur de la validation 
            dateAbonnement = extraireDate(result[0][0]['DAEnd'])
            resultatCouleur = validationAbonnement(dateAbonnement)
        }

        // La verifications des données 
        var nombrePositionEnvoyer = validationUndifined(result[1][0]['TOTAL'], 'Aucune position Envoyer')
        var nombreSOS = validationUndifined(result[2][0]['TOTAL'], "Aucune SOS Envoyer")
        var nombreBulletins = validationUndifined(result[3][0]['TOTAL'], "Aucune Bulletins envoyer")
        dateDernierPosition = validationUndifined(dateDernierPosition, "Aucune position envoyer")
        dateDernierMeteo = validationUndifined(dateDernierMeteo, "Aucune Meteo envoyer")
        LT = validationUndifined(LT, "Aucune")
        LG = validationUndifined(LG, "Aucune")




        console.log(result[0][0]['ID_VMS'])
        res.render('navire/singleNavire', {
            navire: result[0][0],
            nombrePositionEnvoyer: nombrePositionEnvoyer,
            nombreSos: nombreSOS,
            nombreBulletins: nombreBulletins,
            dateDernierPosition: dateDernierPosition,
            position: { LT: LT, LG: LG },
            dateDernierMeteo: dateDernierMeteo,
            validationAbonnement: resultatCouleur[0]['couleur'],
            msgAbonnement: resultatCouleur[0]['msg']
        })
    });

});
//----------------------------------------------------------------------------------------------//




//------------------- modifier navire ------------------------------------//
// GET method
navireRouter.get('/modifier/:id', function(req, res) {
    const sql = "SELECT * FROM tobInfo Where ID = ? "
    const msg = ""
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }
        const navire = new navireModel(
            result[0]['ID'],
            result[0]['NA'],
            result[0]['ID_VMS'],
            result[0]['REG_ID'],
            result[0]['IMEI'],
            result[0]['ICCID'],
            result[0]['RC'],
            result[0]['KEY_AES'],
            extraireDate(result[0]['DABeg']),
            extraireDate(result[0]['DAEnd']),
        )

        res.render('navire/modifierNavire', { navireData: navire, name: navire.NA, msg: msg })
    })

});


// POST method
navireRouter.post('/modifier/:id', function(req, res) {
    const sql1 = "SELECT * FROM tobInfo WHERE ID = ?"
    const sql2 = "UPDATE tobInfo SET NA = ?, REG_ID = ?, IMEI = ?, ICCID = ?, RC = ?, KEY_AES = ?, DABeg = ?, DAEnd = ? WHERE ID = ?"
    var msg = ""


    // tester si la navire existe ou non 
    db.query(sql1, [req.params.id, ], (err, result) => {
        if (err) {
            throw err
        }

        // si les données est vrais on enregistre la navire 
        if ((testDate(req.body.DABEG, 1)) && (testDate(req.body.DAEND, 1))) {
            console.log(req.body)
            db.query(sql2, [req.body.NA, req.body.REG_ID, req.body.IMEI, req.body.ICCID, req.body.RC, req.body.KEY_AES, testDate(req.body.DABEG, 0), testDate(req.body.DAEND, 0), req.params.id], (err, result) => {
                if (err) {
                    throw err;
                }
            });
            res.redirect('/navire/navires')


        } else {
            const navire = new navireModel(
                result[0]['ID'],
                result[0]['NA'],
                result[0]['ID_VMS'],
                result[0]['REG_ID'],
                result[0]['IMEI'],
                result[0]['ICCID'],
                result[0]['RC'],
                result[0]['KEY_AES'],
                extraireDate(result[0]['DABeg']),
                extraireDate(result[0]['DAEnd']),
            )
            msg = "Entrer les donnees correctement"
            res.render('navire/modifierNavire', { navireData: navire, name: navire.NA, msg: msg })
        }
    })

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
navireRouter.get('/historique/:IDVMS', function(req, res) {
    const sql = "SELECT * FROM trackingData WHERE ID_VMS = ? LIMIT 20"
    db.query(sql, (req.params.IDVMS), (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }
        res.render('navire/historiqueTracking', { navire: result })
    })
});
//---------------------------------------------------------------------------//







// ------------------ afficher l'historique des positions, des SOS et des bulletins ------------------//

// Afficher les positions
navireRouter.get('/totalposition/:IDVMS', function(req, res) {
    const id = "'" + req.params.IDVMS + "'"
    sql = "SELECT * FROM trackingData WHERE ID_VMS = " + id + " LIMIT 20;";

    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }

        res.render('navire/totalposition', { navirePositions: result, navireName: result[0]['NA'] })
    })
});

// afficher les SOS
navireRouter.get('/totalSOS/:IDVMS', function(req, res) {
    const id = "'" + req.params.IDVMS + "'"
    sql = "SELECT * FROM trackingData WHERE (ID_VMS = " + id + ") AND (TM LIKE '%DIS%');"

    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }

        let navireName;

        res.render('navire/totalSOS', { navireSOS: result, navireName: result[0]['NA'] })
    })
});



// afficher les bulletins
navireRouter.get('/totalBulletins/:IDVMS', function(req, res) {
    const id = "'" + req.params.IDVMS + "'"
    sql = "SELECT * FROM weatherCRCData WHERE (ID_VMS = " + id + ") AND (TM LIKE '%ACKp%' OR TM LIKE '%ACKb%') ;"

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
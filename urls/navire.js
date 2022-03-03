const express = require('express');
const mysql = require('mysql');
const moment = require('moment');
const { redirect, render } = require('express/lib/response');
const navireRouter = express.Router();





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
            throw err;
        }
    });
    res.redirect('/navire/navires')
});
//-----------------------------------------------------------------//



//------------------------ afficher tous les navires --------------//
navireRouter.get('/navires', function(req, res) {

    db.query("SELECT * FROM tobInfo order by ID DESC LIMIT 10;", (err, result) => {
        if (err) {
            throw err;
        }

        res.render('navire/touslesnavires', { navires: result });
    });

});

//------------------------- le fonctionement de la bar de recherche -----------------------//

navireRouter.get('/recherche', function(req, res) {
    const recherche = req.query.search

    const sql = "SELECT * FROM tobInfo WHERE NA LIKE '%" + recherche + "%' OR ID_VMS LIKE '%" + recherche + "%' OR REG_ID LIKE '%" + recherche + "%' OR IMEI LIKE '%" + recherche + "%' OR RC LIKE '%" + recherche + "%' OR KEY_AES LIKE '%" + recherche + "%' OR DAEnd LIKE '%" + recherche + "%';"

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        res.render('navire/touslesnavires', { navires: result })
    })
});
//------------------------------------------------------------------------//


//------------------- afficher le compte de la navire  ---------------------//

navireRouter.get('/navire/:id', function(req, res) {

    const id = req.params.id

    //les requetes SQL de la page
    //---------------------------------------------------------------------------------------------------------//
    sql1 = "SELECT * FROM tobInfo WHERE NA LIKE '%" + id + "%';";
    sql2 = "SELECT * FROM trackingData WHERE NA LIKE '%" + id + "%';";
    sql3 = "SELECT * FROM trackingData WHERE NA LIKE '%" + id + "%' AND TM LIKE '%DIS%';"
    sql4 = "SELECT * FROM weatherCRCData WHERE NA LIKE '%" + id + "%' AND TM LIKE '%ACKp%' OR TM LIKE '%ACKb%' ;"
    sql5 = "SELECT * FROM trackingData WHERE NA LIKE '%" + id + "%' order by ID desc LIMIT 1;";
    sql6 = "SELECT * FROM weatherCRCData WHERE NA LIKE '%" + id + "%' AND TM LIKE '%ACKp%' ORDER BY ID DESC LIMIT 1;"

    //---------------------------------------------------------------------------------------------------------//

    // la concatination des requetes 
    sql = sql1 + sql2 + sql3 + sql4 + sql5 + sql6
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }

        // Configuration de la date et la position avec Moment.JS
        //----------------------------------------------------------//
        let dateDernierPosition, LT, LG, dateDernierMeteo

        // parcourir la resultat n4 pour extraire la date et la position
        result[4].forEach(element => {
            dateDernierPosition = moment(element.DA).fromNow()
            LT = element.LT
            LG = element.LG
        });
        //-----------------------------------------------------------//

        result[5].forEach(element => {
            dateDernierMeteo = moment(element.DA).fromNow()
        })


        res.render('navire/singleNavire', {
            navire: result[0],
            nombrePositionEnvoyer: result[1].length,
            nombreSOS: result[2].length,
            nombreBulletins: result[3].length,
            dateDernierPosition: dateDernierPosition,
            position: { LT: LT, LG: LG },
            dateDernierMeteo: dateDernierMeteo
        })
    });

});


//------------------- modifier navire ------------------------------------//
// GET method
navireRouter.get('/modifier/:id', function(req, res) {
    const sql = "SELECT * FROM tobInfo Where ID = ? "
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            throw err
        }
        var x;
        result.forEach(r => {
            nomNavire = r.NA
        });
        res.render('navire/modifierNavire', { navire: result, name: nomNavire })
    })

});


// POST method
navireRouter.post('/modifier/:id', function(req, res) {
    const sql = "select * from tobInfo where ID = ?"
    db.query(sql, [req.params.id, ], (err, result) => {
        if (err) {
            throw err
        }
        const sqlUpdate = "UPDATE tobInfo SET NA = ?, ID_VMS = ?, REG_ID = ?, IMEI = ?, ICCID = ?, RC = ?, KEY_AES = ?, DA_BEG = ?, DA_END = ? WHERE ID = ?"
        db.query(sqlUpdate, [req.body.NA, req.body.ID_VMS, req.body.REG_ID, req.body.IMEI, req.body.ICCID, req.body.RC, req.body.KEY_AES, req.body.DABEG, req.body.DAEND, req.params.id, ], (err, result) => {
            if (err) {
                throw err
            }
        })
    })
    res.redirect('/navire/navires')
});
//------------------------------------------------------------------------//


//------------------- supprimer navire ------------------------------------//

// GET method
navireRouter.get('/supprimer/:id', function(req, res) {
    const sql = "select * from tobInfo where ID = ?"
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            throw err
        }
        res.render('navire/validSupprission', { navire: result })
    })

});

// POST method
navireRouter.post('/supprimer/:id', function(req, res) {
    const sql = "select * from tobInfo where ID = ?"
    db.query(sql, (req.params.id), (err, result) => {
        if (err) {
            throw err
        }
        const sqlDelete = "DELETE FROM tobInfo where id = ?"
        db.query(sqlDelete, (req.params.id), (err, result) => {
            if (err) {
                throw err
            }
        })
    })
    res.redirect('/navire/navires')
});
//------------------------------------------------------------------------//




// afficher l'historique du tracking de la navire
//---------------------------------------------------------------------------//
navireRouter.get('/historique/:name', function(req, res) {
    const sql = "SELECT * FROM trackingData WHERE NA LIKE ? LIMIT 20"
    db.query(sql, ('%' + req.params.name + "%"), (err, result) => {
        if (err) {
            throw err
        }
        res.render('navire/historiqueTracking', { navire: result })
    })
});
//---------------------------------------------------------------------------//




// ------------------ afficher l'historique des positions, des SOS et des bulletins ------------------//

// Afficher les positions
navireRouter.get('/totalposition/:name', function(req, res) {
    id = req.params.name
    sql = "SELECT * FROM trackingData WHERE NA LIKE '%" + id + "%' LIMIT 20;";

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        res.render('navire/totalposition', { navirePositions: result })
    })
});

// afficher les SOS
navireRouter.get('/totalSOS/:name', function(req, res) {
    id = req.params.name
    sql = "SELECT * FROM trackingData WHERE NA LIKE '%" + id + "%' AND TM LIKE '%DIS%';"

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        res.render('navire/totalSOS', { navireSOS: result })
    })
});

// afficher les bulletins
navireRouter.get('/totalBulletins/:name', function(req, res) {
    id = req.params.name
    sql = "SELECT * FROM weatherCRCData WHERE NA LIKE '%" + id + "%' AND TM LIKE '%ACKp%' OR TM LIKE '%ACKb%' ;"

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        res.render('navire/totalBulletins', { navireBulletins: result })
    })
});
//--------------------------------------------------------------------------------------------------------//


//---------------------------------- Supprimer les positions de la navire -------------------------------------//
// GET method
navireRouter.get('/supprimerPosition/:id', function(req, res) {
    res.render('navire/validSupprission', { navire: result })
});

// POST method
navireRouter.post('/supprimerPosition/:id', function(req, res) {
    const sql = "select * from trackingData where ID = ?"
    db.query(sql, (req.params.id), (err, result) => {
        if (err) {
            throw err
        }
        const sqlDelete = "DELETE FROM trackingData where id = ?"
        db.query(sqlDelete, (req.params.id), (err, result) => {
            if (err) {
                throw err
            }
        })
    })
    res.redirect('/navire/navires')

});
//----------------------------------------------------------------------------------------------------------------//


// GET method
navireRouter.get('/supprimerSOS/:id', function(req, res) {
    res.render('navire/validSupprission')
});

// POST method
navireRouter.post('/supprimerSOS/:id', function(req, res) {
    const sql = "select * from trackingData where ID = ?"
    db.query(sql, (req.params.id), (err, result) => {
        if (err) {
            throw err
        }
        const sqlDelete = "DELETE FROM trackingData where id = ?"
        db.query(sqlDelete, (req.params.id), (err, result) => {
            if (err) {
                throw err
            }
        })
    })
    res.redirect('/navire/navires')

});




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





// l'exportation du module
module.exports = navireRouter;
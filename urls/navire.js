const express = require('express');
const mysql = require('mysql');
const { redirect, render } = require('express/lib/response');
const navireRouter = express.Router();





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









///////////////////////////////////////////////////////////// LES CRUD DE LA TABLE TOPINFO ///////////////////////////////////////////////////////////////////////

//---------------------- Ajouter navire --------------------------//
// GET method
navireRouter.get('/ajouter', function(req, res) {

    res.render('navire/ajouterNavire')
});

// POST method
navireRouter.post('/ajouter', function(req, res) {


    const sql = "insert into tobInfo values(?,?,?,?,?,?,?,?,?,?)"
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

    db.query("SELECT * FROM tobInfo order by ID limit 10;", (err, result) => {
        if (err) {
            throw err;
        }
        res.render('navire/touslesnavires', { navires: result });
        console.log(result);
    });

});


navireRouter.get('/recherche', function(req, res) {

    const sql = "SELECT * FROM tobInfo WHERE ID = ?";
    db.query(sql, [req.query.search], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length === 0) {
            const sql = "SELECT * FROM tobInfo WHERE NA LIKE ?";
            db.query(sql, ['%' + req.query.search + '%'], (err, result) => {
                if (err) {
                    throw err
                }
                return res.render('navire/touslesnavires', { navires: result })
            })
        }
    })

});
//------------------------------------------------------------------------//


//------------------- afficher une navire specifique ---------------------//
//
navireRouter.get('/navire/:id', function(req, res) {
    const sql = "select * from tobInfo where ID = ?"
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            throw err
        }
        var x;
        result.forEach(r => {
            nomNavire = r.NA
        });
        res.render('navire/singleNavire', { navire: result, name: nomNavire })
    })
});
//------------------------------------------------------------------------//


//------------------- modifier navire ------------------------------------//
// GET method
navireRouter.get('/modifier/:id', function(req, res) {
    const sql = "select * from tobInfo where ID = ?"
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
        console.log(result)
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





// l'exportation du module
module.exports = navireRouter;
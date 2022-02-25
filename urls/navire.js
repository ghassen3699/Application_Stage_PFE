const express = require('express');
const mysql = require('mysql');
const { redirect, render } = require('express/lib/response');
const navireRouter = express.Router();





//------------------------------- La connexion entre NodeJs et Mysql -------------------------------------//

// creation d'une connexion entre le server et Mysql
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ghassen1234@',
    database: 'testdb'
});


// connecter au SGBD
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Mysql')
});
//----------------------------------------------------------------------------------------------------------//


//---------------------- Ajouter navire --------------------------//
// GET method
navireRouter.get('/ajouter', function(req, res) {
    res.render('ajouterNavire')
});

// POST method
navireRouter.post('/ajouter', function(req, res) {


    const sql = "insert into tobInfo values(?,?,?,?,?,?,?,?,?,?)"
    db.query(sql, [req.body.id_nav, req.body.NA, req.body.ID_VMS, req.body.REG_ID, req.body.IMEI, req.body.ICCID, req.body.RC, req.body.KEY_AES, req.body.DABEG, req.body.DAEND], (err, result) => {
        if (err) {
            throw err;
        }
    });
    res.redirect('/home')
});
//-----------------------------------------------------------------//



//------------------------ afficher tous les navires --------------//
navireRouter.get('/navires', function(req, res) {

    db.query("SELECT * FROM tobInfo", (err, result) => {
        if (err) {
            throw err;
        }
        res.render('touslesnavires', { navires: result });
        console.log(result);
    });

});
//------------------------------------------------------------------------//


//------------------- afficher une navire specifique ---------------------//

navireRouter.get('/navire/:id', function(req, res) {
    const sql = "select * from tobInfo where ID = ?"
    db.query(sql, (req.params.id), (err, result) => {
        if (err) {
            throw err;
        }
        res.render('touslesnavires', { navire: result })
    })
});
//------------------------------------------------------------------------//


//------------------- modifier navire ------------------------------------//
// GET method
navireRouter.get('/modifier/:id', function(req, res) {
    const sql = "select * from tobInfo where ID = ?"
    db.query(sql, (req.params.id), (err, result) => {
        if (err) {
            throw err
        }
        res.render('modifier', { navire: result })
    })
});


// POST method
navireRouter.post('/modifier/:id', function(req, res) {
    const sql = "select * from tobInfo where ID = ?"
    db.query(sql, (req.params.id), (err, result) => {
        if (err) {
            throw err
        }
        const sqlUpdate = "UPDATE tobInfo SET NA = ?, ID_VMS = ?, REG_ID = ?, IMEI = ?, ICCID = ?, RC = ?, KEY_AES = ?, DA_BEG = ?, DA_END = ? WHERE ID = ?"
        db.query(sqlUpdate, (req.body.NA, req.body.ID_VMS, req.body.REG_ID, req.body.IMEI, req.body.ICCID, req.body.RC, req.body.KEY_AES, req.body.DABEG, req.body.DAEND, req.params.id), (err, result) => {
            if (err) {
                throw err
            }
        })
    })
    res.redirect('/navires')
});
//------------------------------------------------------------------------//




//------------------- supprimer navire ------------------------------------//
navireRouter.get('/supprimer/:id', function(req, res) {
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
    res.redirect('/navires')
});
//------------------------------------------------------------------------//





// l'exportation du module
module.exports = navireRouter;
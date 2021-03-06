const express = require('express');
const mysql = require('mysql');
const testDate = require('../fonctionDeTravail/testDate');
const validateNavireCouleur = require('../fonctionDeTravail/validateNavireCouleur');
const mapRouter = express.Router();




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



// les api des positions d'aujourd'hui
mapRouter.get('/navireMapApi', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql1 = "SELECT * FROM VMS.trackingData T1 WHERE DATE_FORMAT(DA,'%Y%m%d')=DATE_FORMAT(20220418,'%Y%m%d') AND TI=(SELECT MAX(TI) FROM VMS.trackingData T2 WHERE (T1.NA=T2.NA AND T1.DA=T2.DA)) order by ID_VMS DESC; "
        const sql2 = " SELECT * FROM trackingData ORDER BY ID DESC ;"
        const sql3 = " SELECT * FROM tobInfo ORDER BY ID DESC; "
        const sql4 = "SELECT * FROM weatherCRCData WHERE DA = CURDATE()+0 ;"
        db.query(sql1 + sql2 + sql3 + sql4, (err, result) => {
            if (err) {
                throw err
            }
            res.json(result)
        })
    } else {
        return res.redirect('/')
    }


});


// les api des positions par picker 
mapRouter.get('/navirePositionApi/:ID_VMS/:Date1/:Date2', function(req, res) {
    var user = req.session.user

    if (user) {
        const ID_VMS = req.params.ID_VMS;
        const date1 = req.params.Date1;
        const date2 = req.params.Date2;
        const sql = "SELECT * FROM trackingData WHERE (DA BETWEEN '" + date1 + "' AND '" + date2 + "') AND (ID_VMS = '" + ID_VMS + "') ORDER BY ID DESC ;"

        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            res.json(result)
        })
    } else {
        return res.redirect('/')
    }

});




// la page MAP
mapRouter.get('/', function(req, res) {
    var user = req.session.user

    if (user) {
        res.render('map/map', { user: user })
    } else {
        res.redirect('/')
    }

})



// la page tableau des derniers positions pour aujourd'hui
// ------------------------------------------------------------------------------------------------------------------------------------------ //
mapRouter.get('/navireAujourdhui', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql = "SELECT * FROM VMS.trackingData T1 WHERE DATE_FORMAT(DA,'%Y%m%d')=DATE_FORMAT(20220418,'%Y%m%d') AND TI=(SELECT MAX(TI) FROM VMS.trackingData T2 WHERE (T1.NA=T2.NA AND T1.DA=T2.DA)) ORDER BY TI DESC;"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            res.render('map/positionAujourdhui', { navires: result, user: user })
        })
    } else {
        res.redirect('/')
    }


});



// la pagination du tableau de la dernier positions pour aujourd'hui
mapRouter.get('/navireAujourdhuiPagination', function(req, res) {

    var user = req.session.user

    if (user) {
        const pagination = req.query.pagination
        var sql
        if (pagination === "TOUS") {
            sql = "SELECT * FROM VMS.trackingData T1 WHERE DATE_FORMAT(DA,'%Y%m%d')=DATE_FORMAT(20220418,'%Y%m%d') AND TI=(SELECT MAX(TI) FROM VMS.trackingData T2 WHERE (T1.NA=T2.NA AND T1.DA=T2.DA)) ORDER BY TI DESC;"
        } else {
            sql = "SELECT * FROM VMS.trackingData T1 WHERE DATE_FORMAT(DA,'%Y%m%d')=DATE_FORMAT(20220418,'%Y%m%d') AND TI=(SELECT MAX(TI) FROM VMS.trackingData T2 WHERE (T1.NA=T2.NA AND T1.DA=T2.DA)) ORDER BY TI DESC LIMIT " + pagination + " ;"
        }

        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render('map/positionAujourdhui', { navires: result, user: user })
        })
    } else {
        return res.redirect('/')
    }

});



// la fonction recherche du tableaux positions d'aujourd'hui
mapRouter.get('/mapRecherchePositions', function(req, res) {
    var user = req.session.user

    if (user) {
        const search = "'" + req.query.recherche + "'"
        const sql = "SELECT * FROM VMS.trackingData T1 WHERE DATE_FORMAT(DA,'%Y%m%d')=DATE_FORMAT(20220418,'%Y%m%d') AND TI=(SELECT MAX(TI) FROM VMS.trackingData T2 WHERE (T1.NA=T2.NA AND T1.DA=T2.DA)) AND (NA = " + search + " OR ID_VMS = " + search + " OR TI = " + search + " OR LT = " + search + " OR LG = " + search + " OR CO = " + search + " OR TM = " + search + ");"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render('map/positionAujourdhui', { navires: result, user: user })
        })
    } else {
        res.redirect('/')
    }


});
// ------------------------------------------------------------------------------------------------------------------------------------------ //






// la page de tracking pour les navires 
// ------------------------------------------------------------------------------------------------------------------------------------------ //
mapRouter.get('/mapTracking', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql = "SELECT * FROM trackingData ORDER BY ID DESC LIMIT 200;"

        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }

            return res.render('map/mapTracking', { navires: result, nombreDesNavire: result.length, user: user })
        })
    } else {
        res.redirect('/')
    }

});

// recherche par une date simple
mapRouter.get('/mapSingleDate', function(req, res) {
    var user = req.session.user

    if (user) {
        const date = testDate(req.query.date, 0)
        const sql = "SELECT * FROM trackingData WHERE DA = " + date + " ORDER BY ID DESC ;"

        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render('map/mapTracking', { navires: result, nombreDesNavire: result.length, user: user })
        })
    } else {
        res.redirect('/')
    }

});


// recherche par deux dates 
mapRouter.get('/mapBetweenDate', function(req, res) {

    var user = req.session.user

    if (user) {
        const date1 = testDate(req.query.date1, 0)
        const date2 = testDate(req.query.date2, 0)

        const sql = "SELECT * FROM trackingData WHERE DA BETWEEN " + date1 + " AND " + date2 + " ORDER BY ID DESC  ;"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render('map/mapTracking', { navires: result, nombreDesNavire: result.length, user: user })
        })
    } else {
        res.redirect('/')
    }
});



// recherche par une requete
mapRouter.get('/mapRequete', function(req, res) {

    var user = req.session.user

    if (user) {
        const search = req.query.recherche

        const sql = "SELECT * FROM trackingData WHERE (NA Like '%" + search + "%') OR (ID_VMS = '" + search + "') OR (DA = '" + search + "') OR (TI = '" + search + "') OR (LT = '" + search + "') OR (LG = '" + search + "') OR (TM = '" + search + "') OR (CO = '" + search + "') ORDER BY ID DESC;"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render('map/mapTracking', { navires: result, nombreDesNavire: result.length, user: user })
        })

    } else {
        res.redirect('/')
    }


});


// -------------------------------------------------------------------------------------------------------------------------------------------------------------- //



module.exports = mapRouter;
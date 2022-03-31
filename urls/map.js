const express = require('express');
const mysql = require('mysql');
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



// home page
mapRouter.get('/navireMapApi', function(req, res) {


    sql = "SELECT * FROM VMS.trackingData T1 WHERE DATE_FORMAT(DA,'%Y%m%d')=DATE_FORMAT('20210706','%Y%m%d') AND TI=(SELECT MAX(TI) FROM VMS.trackingData T2 WHERE (T1.NA=T2.NA AND T1.DA=T2.DA)) order by TI DESC;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        var listeNavireConnecter = []

        result.forEach(navire => {
            var c = validateNavireCouleur(navire['TI']);
        });

        res.json(result)
    })

});


mapRouter.get('/', function(req, res) {
    res.render('map')
})

module.exports = mapRouter;
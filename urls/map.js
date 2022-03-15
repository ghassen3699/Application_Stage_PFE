const express = require('express');
const mysql = require('mysql');

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

    sql = "SELECT * FROM trackingData WHERE DA = '20210705'";
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }

        res.json(result)
    })

});


mapRouter.get('/', function(req, res) {
    res.render('map')
})

module.exports = mapRouter;
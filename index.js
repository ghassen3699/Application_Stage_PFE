const express = require('express');
const ejs = require("ejs");
const mysql = require('mysql');
const bodyParser = require("body-parser");


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


const app = express(); // creation d'une application express
app.set("view engine", "ejs"); // utilisation de la bibliothéque ejs pour l'affichage des templates
app.use(express.static('public')); // le dossier static 

//--------------------- L'importation des routes -------------------------//
const mapRouter = require('./urls/map');
const homeRouter = require('./urls/home');
const parametreRouter = require('./urls/parametre');
const meteoRouter = require('./urls/meteo');
const navireRouter = require('./urls/navire');
const statistiqueRouter = require('./urls/statistique');
//------------------------------------------------------------------------//



app.use(bodyParser.urlencoded({ extended: true }));;
app.use('/map', mapRouter); // le route map
app.use('/home', homeRouter); // le route home
app.use('/parametre', parametreRouter); // le route des parametres
app.use('/meteo', meteoRouter); // le route des meteo
app.use('/navire', navireRouter); //le route des navires
app.use('/statistique', statistiqueRouter); //le route des navires

var port = 3000
app.listen(port, function() {
    console.log('server run ...')
})
const express = require('express');
const mysql = require('mysql');


// creation d'une connexion entre le server et Mysql
const db = mysql.createConnection({
    host: 'localhost',
    //host: '193.95.21.63',
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


module.exports = db;
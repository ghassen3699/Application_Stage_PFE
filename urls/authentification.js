const express = require('express');
const authRouter = express.Router();
const { registerFormLogin, registerFormRegisterUser } = require('../fonctionDeTravail/validationUsersJoi');






//-------------------------------------------------- la page login de l'application -------------------------------------------------------//
// GET method 
authRouter.get('/', function(req, res) {
    return res.render('authentication/loginPage')
});


// POST method 
authRouter.post('/', function(req, res) {
    res.render('authentication/loginPage')
});
//----------------------------------------------------------------------------------------------------------------------------------------//




//-------------------------------------------------- la page signUp de l'application -------------------------------------------------------//
// GET method 
authRouter.get('/register', function(req, res) {
    return res.render('authentication/registerPage')
});


// POST method 
authRouter.post('/register', function(req, res) {
    res.render('authentication/registerPage')
});
//----------------------------------------------------------------------------------------------------------------------------------------//



module.exports = authRouter;
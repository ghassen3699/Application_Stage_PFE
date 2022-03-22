const express = require('express');
const authRouter = express.Router();



// la page login de l'application
authRouter.get('/', function(req, res) {
    return res.render('authentication/loginPage')
});


module.exports = authRouter;
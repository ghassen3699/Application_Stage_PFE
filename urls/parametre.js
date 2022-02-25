const express = require('express');
const parametreRouter = express.Router();




parametreRouter.get('/', function(req, res) {
    res.render('parametre')
});


module.exports = parametreRouter;
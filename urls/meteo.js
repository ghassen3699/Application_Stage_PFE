const express = require('express');
const meteoRouter = express.Router();



meteoRouter.get('/', function(req, res) {
    res.render('meteo')
});

module.exports = meteoRouter;
const express = require('express');
const https = require('https');
const homeRouter = express.Router();





homeRouter.get('/', function(req, res) {

    //const url = "https://api.openweathermap.org/data/2.5/weather?lat=36.8472&lon=10.2040&units=metric&appid=9d35eb879889e4a3c2bc559347144202"
    //https.get(url, function(response) {

    //    response.on("data", async function(data) {
    //        const weatherData = await JSON.parse(data)
    //        const temp = weatherData.main.temp
    //        res.render("home", { temp: temp })
    //    })
    //});
    res.render("home", { temp: 13 })
});


module.exports = homeRouter;
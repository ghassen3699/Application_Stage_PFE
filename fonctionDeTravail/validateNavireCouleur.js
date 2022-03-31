const moment = require('moment');


// calculer la diff entre le temps courant est le temps du dernier position et retourner un couleur
function validateNavireCouleur(TI, DA) {

    var date = moment(DA, "YYYY-MM-DD");
    var time = TI.substr(0, 2) + ':' + TI.substr(2, 4);

    var fullDateFormat = moment("24/12/2019 09:15:00", "DD MM YYYY hh:mm:ss");


    console.log(fullDateFormat)
}

validateNavireCouleur('0915', '20210303')

// module.exports = validateNavireCouleur
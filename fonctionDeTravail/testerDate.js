function testDate(date, choix) {


    if (date.length === 10) {
        var year = date.substring(0, 4); // extraire l'annee de la date  d'abonnement 
        var month = date.substring(5, 7); // extraire le mois de la date d'abonnement 
        var day = date.substring(8, 10); // extraire la journee de la date d'abonnement 
        var date = year + month + day;
        if (date.length === 8) {
            if (choix === 1) {
                return true;
            } else {
                return date
            }

        }
    }

    return false;
};

module.exports = testDate;
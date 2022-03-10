function extraireDate(date) {
    var year = date[0][0]['DAEnd'].substring(0, 4); // extraire l'annee de la date  d'abonnement 
    var month = date[0][0]['DAEnd'].substring(4, 6); // extraire le mois de la date d'abonnement 
    var day = date[0][0]['DAEnd'].substring(6, 8); // extraire la journee de la date d'abonnement 

    const dateAbonnement = year + '-' + month + '-' + day
    return dateAbonnement
}

module.exports = extraireDate;
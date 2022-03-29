function pickerConfigDate(recherche, choix) {
    var month, day

    // la date d'aujourd'hui
    var currentDate = new Date()

    // tester la validation du mois
    if (currentDate.getMonth().toString().length === 1) {
        month = '0' + (currentDate.getMonth() + 1)
    } else {
        month = currentDate.getMonth() + 1
    }


    // tester la validation du journee
    if (currentDate.getDate().toString().length === 1) {
        day = '0' + currentDate.getDate()
    } else {
        day = currentDate.getDate()
    }


    // si 0 -> debut d'abonnement et si 1 -> fin d'abonnement
    if (choix === 0) {
        // changer la format de la date 
        currentDate = currentDate.getFullYear() + '-' + month + '-' + day
            // initialisation de la premiere recherche par date 
        recherche.value = currentDate
    } else {
        year = currentDate.getFullYear() + 1
        currentDate = year + '-' + month + '-' + day
        recherche.value = currentDate

    }

};



var recherche1 = document.getElementById('dateDebut')
var recherche2 = document.getElementById('DateFin')
pickerConfigDate(recherche2, 1);
pickerConfigDate(recherche1, 0);
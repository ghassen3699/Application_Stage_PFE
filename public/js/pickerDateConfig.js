function pickerConfig(recherche) {
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


    // changer la format de la date 
    currentDate = currentDate.getFullYear() + '-' + month + '-' + day



    // initialisation de la premiere recherche par date 
    recherche.value = currentDate
};

var recherche1 = document.getElementById('recherche1')
pickerConfig(recherche1);
var recherche2 = document.getElementById('recherche2')
pickerConfig(recherche2);
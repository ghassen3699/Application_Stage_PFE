const moment = require('moment');

// la validation du compte 
function validationAbonnement(date) {
    var now = new Date;
    var dur = moment.duration({ from: now, to: date });
    var resultat = [
        { msg: '', couleur: '' }
    ]
    if (dur.asDays() <= 0) {
        resultat[0]['msg'] = "L'abonnement est expirée"
        resultat[0]['couleur'] = "red"
    } else if (dur.asDays() <= 30) {
        resultat[0]['msg'] = "L'abonnement s'expire bientot"
        resultat[0]['couleur'] = "red"
    } else if ((90 >= dur.asDays()) && (dur.asDays() > 30)) {
        resultat[0]['msg'] = "L'abonnement s'expire aprés quelque mois"
        resultat[0]['couleur'] = "orange"
    } else if ((90 < dur.asDays())) {
        resultat[0]['msg'] = ""
        resultat[0]['couleur'] = ""
    }

    return resultat;
};



module.exports = validationAbonnement;
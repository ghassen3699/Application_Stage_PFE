function homePositionToday(listeResult) {
    var listeFinal = []
    k = 0
    while (k <= listeResult.length) {
        if (listeResult[k]['weekDate'] === listeResult[k + 1]['weekDate']) {
            if (listeResult[k]['result'] !== listeResult[k + 1]['result']) {
                if (listeResult[k]['result'] > listeResult[k + 1]['result']) {
                    listeFinal.push({ weekDate: listeResult[k]['weekDate'], result: listeResult[k]['result'] })
                } else {
                    listeFinal.push({ weekDate: listeResult[k]['weekDate'], result: listeResult[k + 1]['result'] })
                }
            }
        }
    }

    return listeFinal
}



module.exports = homePositionToday
const fs = require('fs');


fs.readFile('BMSFormat.json', (err, data) => {
    if (err) {
        throw err
    }
    var listeBMSInfo = []
    var BMSData = JSON.parse(data)
    BMSData.forEach(bmsInfo => {


        var meteorologieInfo = bmsInfo['BMS']['meteorologie_Ar'].split('-')

        meteorologieInfo = {
            'type': meteorologieInfo[0].split(':')[0],
            'zoneA': meteorologieInfo[1].split(':')[0].split(' ')[1] + ' ' + meteorologieInfo[1].split(':')[0].split(' ')[2],
            'BMSZoneA': meteorologieInfo[1].split(':')[1],
            'zoneB': meteorologieInfo[1].split(':')[0].split(' ')[4] + ' ' + meteorologieInfo[1].split(':')[0].split(' ')[5],
            'BMSZoneB': meteorologieInfo[1].split(':')[1],
            'zoneC': meteorologieInfo[2].split(':')[0],
            'BMSZoneC': meteorologieInfo[2].split(':')[1]
        }

        listeBMSInfo.push({ 'titre': bmsInfo['BMS']['avisde'], 'dateDébut': bmsInfo['BMS']['validatedebut'], 'dateFin': bmsInfo['BMS']['validatefin'], 'heureDebut': bmsInfo['BMS']['validateheuredebut'], 'heureFin': bmsInfo['BMS']['validateheurefin'], 'meteorologieInfo': meteorologieInfo })
    });
    console.log(listeBMSInfo)
});
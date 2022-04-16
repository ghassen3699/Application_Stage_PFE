// fonction pour afficher les positions d'aujourd'hui
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function positionsAujourdhui(navireInformation, L) {
    var listePositionsToday = []

    navireInformation[0].forEach(navire => {

        // Ajouter les informations de cheque navire
        var navireName = document.querySelector('#navireName')
        var ID_VMS = document.querySelector('#IDVMS_Navire')
        navireName.innerHTML = navire['NA']
        ID_VMS.innerHTML = navire['ID_VMS']

        // afficher les positions d'ajourd'hui sur Map
        document.querySelector('#bar').appendChild(document.querySelector('#navireInfo').cloneNode(true))
        var markerLocation = new L.LatLng(navire['LT'], navire['LG'])
        var marker = new L.Marker(markerLocation).bindPopup(navire['NA'] + " || Lat:" + navire['LT'] + " || Lng:" + navire['LG']).openPopup()
        listePositionsToday.push(marker)
    });

    var navireInfoBar = document.querySelectorAll('#navireInfo')
    if (navireInfoBar.length > 1) {
        navireInfoBar[0].innerHTML = ''
    }
    listePositionsToday = L.layerGroup(listePositionsToday)
    return listePositionsToday
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





// fonction pour filter les positions par picker
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function positionsParFilter(navireInformation, L, Date1, Date2, ID_VMS) {
    var listePositionsFilter = []
    var navirePositionMarker = []
    const DATE1 = Date1.substring(0, 4) + Date1.substring(5, 7) + Date1.substring(8, 10)
    const DATE2 = Date2.substring(0, 4) + Date2.substring(5, 7) + Date2.substring(8, 10)


    // enregistrer les positions 
    var listePositionsFilter = navireInformation[1].filter(function(navire) {
        return (((parseInt(DATE1) <= parseInt(navire.DA)) && (parseInt(navire.DA) <= parseInt(DATE2))) && (navire.ID_VMS === ID_VMS));
    })



    // afficher les positions sur la map
    listePositionsFilter.forEach(navire => {
        var markerLocation = new L.LatLng(navire['LT'], navire['LG'])
        var marker = new L.Marker(markerLocation).bindPopup(navire['NA'] + " || Lat:" + navire['LT'] + " || Lng:" + navire['LG']).openPopup()
        navirePositionMarker.push(marker)
    });

    navirePositionMarker = L.layerGroup(navirePositionMarker)
    return navirePositionMarker
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// afficher les SOS pour aujourd'hui
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function SOSAujourdhui(navireInformation, ID_VMS) {
    var listeSOSToday = []

    listeSOSToday = navireInformation.filter(function(navire) {
        var duration = durationDays(navire.DA)

        return ((navire.ID_VMS === ID_VMS) && (navire.TM === "POS") && (duration <= 3));
    })
    return listeSOSToday

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// afficher les SOS filtrer par picker
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function SOSFilterPicker(navireInformation, ID_VMS, DATE1, DATE2) {


    var listeSOSFilter = []

    const DAte1 = DATE1.substring(0, 4) + DATE1.substring(5, 7) + DATE1.substring(8, 10)
    const DAte2 = DATE2.substring(0, 4) + DATE2.substring(5, 7) + DATE2.substring(8, 10)


    // enregistrer les positions 
    listeSOSFilter = navireInformation.filter(function(navire) {
        return (((parseInt(DAte1) <= parseInt(navire.DA)) && (parseInt(navire.DA) <= parseInt(DAte2))) && (navire.ID_VMS === ID_VMS) && (navire.TM === 'POS'));
    })
    return listeSOSFilter

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// afficher les Infractions de chaque navire 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function InfractionNavire(navireInformation, ID_VMS) {
    var listeInfraction = []
    listeInfraction = navireInformation.filter(function(navire) {

        var duration = durationHours(navire.TI, navire.DA)
        return ((navire.ID_VMS === ID_VMS) && (duration > 3))
    })
    return listeInfraction
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






// former le temps de chaque position
function formatTIME(time) {
    var formatTIME = time[0] + time[1] + ":" + time[2] + time[3]
    return formatTIME
}

// duration des jours
function durationDays(date) {

    // former la date d'ajourd'hui
    var today = new Date();
    today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var curdate = new Date(today);

    // former la date du position
    var positionDate = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 10)
    const navireSOSDate = new Date(positionDate);


    const diffTime = Math.abs(curdate - navireSOSDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays
}




function durationHours(tempsPosition, datePosition) {

    // le temps courant 
    var currentDate = new Date()
    var currentTime = currentDate.getHours().toString() + currentDate.getMinutes().toString()

    var minute = currentDate.getMinutes().toString()
    if (minute.length === 2) {
        // changer les informations du temps a un objet
        var time1 = { hour: tempsPosition[0] + tempsPosition[1], minute: tempsPosition[2] + tempsPosition[3], second: 00 } // le temps de la navire 
        var time2 = { hour: currentTime[0] + currentTime[1], minute: currentTime[2] + currentTime[3], second: 00 } // le temps courant 
    } else {
        // changer les informations du temps a un objet
        var time1 = { hour: tempsPosition[0] + tempsPosition[1], minute: tempsPosition[2] + tempsPosition[3], second: 00 } // le temps de la navire 
        var time2 = { hour: currentTime[0] + currentTime[1], minute: '0' + currentTime[2], second: 00 } // le temps courant 
    }



    // extraire les informations de la date courante 
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
    const currentDay = currentDate.getDate()

    // extraire les informations de la date du position
    const positionDateYear = datePosition.substring(0, 4)
    const positionDateMonth = datePosition.substring(4, 6)
    const positionDateDay = datePosition.substring(6, 10)

    // format du Date
    var d1 = new Date(positionDateYear, positionDateMonth, positionDateDay, time1.hour, time1.minute, time1.second);
    var d2 = new Date(currentYear, currentMonth, currentDay, time2.hour, time2.minute, time2.second);


    // nombre des heures
    var diff = Math.abs((d2.getTime() - d1.getTime()) / 1000);
    var heures = Math.floor(diff / 3600);


    return heures
}







//---------------------------------------------la creation de la map---------------------------------------------------//
const mapDiv = document.getElementById('map');
const map = L.map(mapDiv).setView([39.2009, 11.2153], 11);
const atribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    atribution
});
tiles.addTo(map);
//----------------------------------------------------------------------------------------------------------------------//




//-------------------------------- Lire les Informations des navires qui connecte aujourd'hui ---------------------------//



var url = "http://127.0.0.1:3000/map/navireMapApi";
fetch(url)
    .then(async(resp) => await resp.json())
    .then(async function(data) {

        // lire les données sous forme Json
        var navireInformation = await data

        console.log(navireInformation[2])
            // enregistrer les données d'ajourd'hui
        var listePositionsToday = positionsAujourdhui(navireInformation, L)
        var listePositionsFilter

        // afficher les positions d'aujourd'hui
        map.addLayer(listePositionsToday)


        // le fonctionnement de checkbox
        var checkbox = document.querySelectorAll('.onoff')

        // affecter les IDVMS pour chaque navire 
        for (let i = 0; i < checkbox.length; i++) {
            let IDVMS = navireInformation[0][i]['ID_VMS']
            checkbox[i].classList.add(IDVMS)

        }




        for (let i = 0; i < checkbox.length; i++) {


            // lire et afficher les SOS d'aujourd'hui
            //--------------------------------------------------------------------------------------------------//
            var SOSData = document.querySelectorAll("#SOSData")
            var sosToday = SOSAujourdhui(navireInformation[0], checkbox[i].classList[1])
            sosToday.forEach(navireSOS => {

                SOSData[i].innerHTML = 'SOS :    ' + formatTIME(navireSOS['TI']) + " <br> LT/LG :  " + navireSOS['LT'] + "/" + navireSOS['LG']

            });
            //--------------------------------------------------------------------------------------------------//




            // lire et afficher les Infractions de chaque navire 
            //--------------------------------------------------------------------------------------------------//
            var infractionToday = InfractionNavire(navireInformation[0], checkbox[i].classList[1])
            var divInfraction = document.querySelectorAll('#Infraction')
            infractionToday.forEach(navireInfraction => {
                divInfraction[i].innerHTML = 'Infraction Trouver a ' + formatTIME(navireInfraction['TI'])
            });
            //--------------------------------------------------------------------------------------------------//






            checkbox[i].addEventListener('change', function() {
                currentvalue = document.getElementById('onoff').value;

                // si le mode filter est activee
                if (currentvalue == "Off") {

                    map.removeLayer(listePositionsToday)

                    var buttonClickFormulaire = document.querySelectorAll("#buttonClickFormulaire")
                    buttonClickFormulaire[i].addEventListener('click', function() {
                        var date1Picker = document.querySelectorAll('#date1')
                        var date2Picker = document.querySelectorAll('#date2')

                        listePositionsFilter = positionsParFilter(navireInformation, L, date1Picker[i].value, date2Picker[i].value, 'VMS2030')
                        var SOSParPicker = SOSFilterPicker(navireInformation[1], 'VMS2030', date1Picker[i].value, date2Picker[i].value)
                        console.log(SOSParPicker)

                        // afficher les SOS suivant le filtre de picker 
                        if (SOSParPicker.length > 0) {
                            var SOSData = document.querySelectorAll("#SOSData")
                            SOSParPicker.forEach(navireSOS => {
                                SOSData[i].innerHTML = 'SOS :    ' + formatTIME(navireSOS['TI']) + " <br> LT/LG :  " + navireSOS['LT'] + "/" + navireSOS['LG']
                            })
                        }

                        // checkbox[i].classList[1] le IDVMS

                        map.addLayer(listePositionsFilter)
                    })




                    //afficher les positions d'ajourd'hui
                    document.getElementById("onoff").value = "On"

                    // si le mode filter non activee
                } else {

                    // afficher les SOS d'aujourd'hui
                    var SOSData = document.querySelectorAll("#SOSData")
                    var sosToday = SOSAujourdhui(navireInformation[0], checkbox[i].classList[1])
                    if (sosToday.length === 0) {
                        SOSData[i].innerHTML = 'Aucune SOS'
                    } else {
                        sosToday.forEach(navireSOS => {

                            SOSData[i].innerHTML = 'SOS :    ' + formatTIME(navireSOS['TI']) + " <br> LT/LG :  " + navireSOS['LT'] + "/" + navireSOS['LG']

                        });
                    }



                    // afficher les positions d'aujourd'hui 
                    document.getElementById("onoff").value = "Off"
                    listePositionsFilter.clearLayers();
                    map.addLayer(listePositionsToday)
                }
            })
        }

    });



//-------------------------------------------------------------------------------------------------------------------------//





// var c = L.circle([39.2009, 11.2153], { radius: 20000 }).addTo(map);


// var distance = Math.sqrt(Math.pow((c.getLatLng().lat - marker1.getLatLng().lat), 2) + Math.pow((c.getLatLng().lng - marker1.getLatLng().lng), 2));

// if (distance < c.getRadius()) {
//     console.log('in')
// }
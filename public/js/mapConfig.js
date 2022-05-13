// fonction pour afficher les positions d'aujourd'hui
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function positionsAujourdhui(navireInformation, L) {

    var LeafIcon = L.Icon.extend({
        options: {
            iconSize: [25],
        },

    });

    var TargetIcon = new LeafIcon({ iconUrl: '/js/boat.svg' });
    var TargetIconRed = new LeafIcon({ iconUrl: '/js/boatRed.svg' });


    var listePositionsToday = []

    navireInformation[0].forEach(navire => {

        if (navire.TM === "POS") {
            // Ajouter les informations de cheque navire
            var navireName = document.querySelector('#navireName')
            var ID_VMS = document.querySelector('#IDVMS_Navire')
            navireName.innerHTML = navire['NA']
            ID_VMS.innerHTML = navire['ID_VMS']



            // afficher les positions d'ajourd'hui sur Map
            document.querySelector('#bar').appendChild(document.querySelector('#navireInfo').cloneNode(true))
            var markerLocation = new L.LatLng(navire['LT'], navire['LG'])

            var sos = SOSAujourdhui(navireInformation[1], navire['ID_VMS'], 1)
            var INFRA = InfractionNavire(navireInformation[0], navire['ID_VMS'])
            var BMSinfo = BMS(navireInformation[3], navire['ID_VMS'])
            var PREVinfo = PREV(navireInformation[3], navire['ID_VMS'])

            // if (sos.length === 0) {
            //     var sosColor = "<br> <span style='height: 25px; width:25px; background-color: orange; border-radius: 50%; display: inline-block;'></span> &nbsp;&nbsp;"
            // } else {
            //     var sosColor = "<br> <span style='height: 25px; width:25px; background-color: red; border-radius: 50%; display: inline-block;'></span> &nbsp;&nbsp;"

            // }
            // if (BMSinfo.length === 0) {
            //     var BMSColor = " <span style='height: 25px; width:25px; background-color: red; border-radius: 50%; display: inline-block;'></span> &nbsp;&nbsp;"
            // } else {
            //     var BMSColor = " <span style='height: 25px; width:25px; background-color: orange; border-radius: 50%; display: inline-block;'></span> &nbsp;&nbsp;"

            // }
            // if (INFRA.length === 0) {
            //     var INFRAColor = " <span style='height: 25px; width:25px; background-color: orange; border-radius: 50%; display: inline-block;'></span> &nbsp;&nbsp;"
            // } else {
            //     var INFRAColor = " <span style='height: 25px; width:25px; background-color: red; border-radius: 50%; display: inline-block;'></span> &nbsp;&nbsp;"

            // }
            // if (PREVinfo.length === 0) {
            //     var ACKPColor = " <span style='height: 25px; width:25px; background-color: red; border-radius: 50%; display: inline-block;'></span> &nbsp;&nbsp;"
            // } else {
            //     var ACKPColor = " <span style='height: 25px; width:25px; background-color: orange; border-radius: 50%; display: inline-block;'></span> &nbsp;&nbsp;"

            // }






            var bgColorOnError = '#FF0000';
            var bgColorOnSuccess = '#FF0000';
            var bgSOSColor = '#c4c4c4';
            var bgBMSColor = '#c4c4c4';
            var bgPREVColor = '#c4c4c4';
            var bgINFRAColor = '#c4c4c4';
            var icon = TargetIcon

            if (sos.length > 0) {
                bgSOSColor = bgColorOnError;
                icon = TargetIconRed
            }
            if (BMSinfo.length > 0) {
                bgBMSColor = bgColorOnSuccess
            }
            if (INFRA.length > 0) {
                bgINFRAColor = bgColorOnError
            }
            if (PREVinfo.length > 0) {
                bgPREVColor = bgColorOnSuccess
            }

            var SOSIcon = "<br> <span style='height: 25px; width:25px; background-color:" + bgSOSColor + "; border-radius: 50%; display: inline-block;'></span> &nbsp;&nbsp;"
            var BMSIcon = "<span style='height: 25px; width:25px; background-color:" + bgBMSColor + "; border-radius: 50%; display: inline-block;'></span> &nbsp;&nbsp;"
            var PREVIcon = "<span style='height: 25px; width:25px; background-color:" + bgPREVColor + "; border-radius: 50%; display: inline-block;'></span> &nbsp;&nbsp;"
            var INFRAIcon = "<span style='height: 25px; width:25px; background-color:" + bgINFRAColor + "; border-radius: 50%; display: inline-block;'></span> &nbsp;&nbsp;"



            marker = new L.Marker(markerLocation, { icon: icon, rotationAngle: trackAngle, rotationOrigin: "center" }).bindPopup("<center>" + navire['NA'] + " <br> Lat:" + navire['LT'] + " || Lng:" + navire['LG'] + SOSIcon + BMSIcon + INFRAIcon + PREVIcon + " <br> SOS   &nbsp; BMS  &nbsp; INFRA  &nbsp; PREV" + " </center> ").openPopup()


            listePositionsToday.push(marker)
        }

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

    var LeafIcon = L.Icon.extend({
        options: {
            iconSize: [25]
        }
    });

    var TargetIcon = new LeafIcon({ iconUrl: '/js/boat.svg' });


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
        var marker = new L.Marker(markerLocation, { icon: TargetIcon, rotationAngle: trackAngle, rotationOrigin: "center" }).bindPopup('<center>' + navire['NA'] + " <br> Lat:" + navire['LT'] + " || Lng:" + navire['LG'] + ' <center>').openPopup()
        navirePositionMarker.push(marker)
    });

    navirePositionMarker = L.layerGroup(navirePositionMarker)
    return navirePositionMarker
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// afficher les SOS pour aujourd'hui
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function SOSAujourdhui(navireInformation, ID_VMS, choix) {
    var listeSOSToday = []

    if (choix === 0) {
        listeSOSToday = navireInformation.filter(function(navire) {
            var duration = durationDays(navire.DA)
            return ((navire.ID_VMS === ID_VMS) && ((navire.TM === "DIS") || (navire.TM === "DIs")) && (duration <= 3));
        })
    } else {
        listeSOSToday = navireInformation.filter(function(navire) {
            var duration = durationDays(navire.DA)
            return ((navire.ID_VMS === ID_VMS) && ((navire.TM === "DIS") || (navire.TM === "DIs")) && (duration <= 1));
        })
    }

    return listeSOSToday

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// afficher les SOS filtrer par picker
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function SOSFilterPicker(navireInformation, ID_VMS, DATE1, DATE2) {


    var listeSOSFilter = []

    const DAte1 = DATE1.substring(0, 4) + DATE1.substring(5, 7) + DATE1.substring(8, 10)
    const DAte2 = DATE2.substring(0, 4) + DATE2.substring(5, 7) + DATE2.substring(8, 10)

    console.log(DAte1)
    console.log(DAte2)
        // enregistrer les positions 
    listeSOSFilter = navireInformation.filter(function(navire) {
        console.log(navire.DA)
        console.log(navire.TM)
        return (((parseInt(DAte1) <= parseInt(navire.DA)) && (parseInt(navire.DA) <= parseInt(DAte2))) && (navire.ID_VMS === ID_VMS) && (navire.TM === 'DIs'));
    })
    console.log(listeSOSFilter)
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


// la validation des previsions et des BMS 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// valider lee PREV d'aujourd'hui pour chaque navire
function PREV(navireInformation, ID_VMS) {
    var listePREV = []
    listePREV = navireInformation.filter(function(navire) {
        console.log(navire)
        return ((navire.ID_VMS === ID_VMS) && (navire.TM === 'ACKp'))
    })
    return listePREV
}

// valider les BMS d'aujourd'hui pour chaque navire
function BMS(navireInformation, ID_VMS) {
    var listeBMS = []
    listeBMS = navireInformation.filter(function(navire) {
        return ((navire.ID_VMS === ID_VMS) && (navire.TM === 'ACKb'))
    })
    return listeBMS
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// former le temps de chaque position
function formatTIME(time) {
    var formatTIME = time[0] + time[1] + ":" + time[2] + time[3]
    return formatTIME
}


function formatDate(date) {
    var formatDate = date[0] + date[1] + date[2] + date[3] + '/' + date[4] + date[5] + '/' + date[6] + date[7]
    return formatDate
}

// duration des jours
function durationDays(date) {

    // former la date d'ajourd'hui
    var today = new Date();
    // today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    today = '2022-04-18'
    var curdate = new Date(today);

    // former la date du position
    var positionDate = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 10)
    const navireSOSDate = new Date(positionDate);


    const diffTime = Math.abs(curdate - navireSOSDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays
}



// duree des heures
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


// afficher et supprimer les DIV du toggleBar d'une façon dynamique
function displayDiv(ID_Buttton, ID_Div, compteur) {
    navireDIV = document.querySelectorAll(ID_Div)

    navireDIV[compteur].classList.toggle('displayDiv')
    if (ID_Buttton[compteur].classList.value === "fa fa-angle-double-down") {
        ID_Buttton[compteur].classList.value = "fa fa-angle-double-up"
    } else {
        ID_Buttton[compteur].classList.value = "fa fa-angle-double-down"
    }
}


function affectNavireInformation(navireName, IDVMS) {
    document.querySelector('#IDVMS_select').innerText = navireName
    document.querySelector('#IDVMS_select').value = IDVMS
    document.querySelector('#navireSelect').appendChild(document.querySelector('#IDVMS_select').cloneNode(true))

    var IDVMS_select = document.querySelectorAll('#IDVMS_select')
    if (IDVMS_select.length > 1) {
        IDVMS_select[0].innerText = 'choisir navire'
        IDVMS_select[0].value = 'IDVMS'
    }
}








//---------------------------------------------la creation de la map---------------------------------------------------//
const mapDiv = document.getElementById('map');
const map = L.map('map', {
    center: [35.04, 12.6],
    zoomSnap: 0.15,
    zoomDelta: 0.25,
    zoom: 6.7,
    //maxZoom: 21,//5m
    maxZoom: 17, //50m
    minZoom: 6.7,
    zoomControl: true, // pour supprimer les bouton zoom par defaut, on ajouter dans le menu home
    //layers: [ports, lighthouse]
});
const atribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="">VMD</a> 2022 |'
});
tiles.addTo(map);


//----------------------------------------------------------------------------------------------------------------------//



var LeafPortIcon = L.Icon.extend({
    options: {
        iconSize: [30],
        iconAnchor: [15, 10]
    }
});
var PortIcon = new LeafPortIcon({ iconUrl: '/js/port-icon-png-19.jpg' }); //anchor1







//http://w.apip.nat.tn/contact.asp
//https://www.marinetraffic.com/en/ais/home/centerx:10.487/centery:36.031/zoom:14

var Tabarka = L.marker([36.95917, 8.7579], //
        { icon: PortIcon }).bindPopup('<center>Port de Tabarka <br> ميناء جرزونة <br> Medium<br>36.9592 | 8.7579</center>'),
    Zarzouna = L.marker([37.268, 9.891], { icon: PortIcon }).bindPopup('<center>Port de Zarzouna <br> Small<br>37.2680 | 9.8910</center>'),
    SidiMechreg = L.marker([36.80858, 10.307729], { icon: PortIcon }).bindPopup('Port de '),
    MenzelAbdrahmen = L.marker([37.231408, 9.862278], //
        { icon: PortIcon }).bindPopup('<center>Port de Menzel Abdrahmen <br> Small<br>37.2314 | 9.8623</center>'),
    CapZbib = L.marker([37.266893, 10.069209], //
        { icon: PortIcon }).bindPopup('<center>Port de Cap Zbib <br> Small<br>37.26690 | 10.0692</center>'),
    GharElMelh = L.marker([37.155121, 10.230009], //
        { icon: PortIcon }).bindPopup('<center>Port de Ghar El Melh <br> Small<br>37.1525 | 10.2300</center>'),
    KalaatLandalous = L.marker([36.80858, 10.307729], { icon: PortIcon }).bindPopup('Port de '),
    LaGoulette = L.marker([36.80858, 10.307729], //
        { icon: PortIcon }).bindPopup('<center>Port de La Goulette <br> Small<br>36.8086 | 10.3077</center>'),
    SidiDaoud = L.marker([37.02038, 10.9075], { icon: PortIcon }).bindPopup('<center>Port de Sidi Daoud <br> Small<br>37.0204 | 10.9075</center>'),
    Haouaria = L.marker([36.80858, 10.307729], { icon: PortIcon }).bindPopup('Port de '),
    Kelibia = L.marker([36.83386, 11.111], { icon: PortIcon }).bindPopup('<center>Port de Kelibia <br> Medium<br>36.8339 | 11.1110</center>'),
    BeniKhiar = L.marker([36.45195, 10.7955], //
        { icon: PortIcon }).bindPopup('<center>Port de Beni Khiar <br> Medium<br>37.02038 | 10.9075</center>'),
    Hergla = L.marker([36.0326, 10.51], //
        { icon: PortIcon }).bindPopup('<center>Port de Harglah <br> Medium<br>36.0326 | 10.5100</center>'),
    Sousse = L.marker([35.8255, 10.6485], //
        { icon: PortIcon }).bindPopup('<center>Port de Sousse <br> Medium<br>35.8255 | 10.6485</center>'),
    Monastir = L.marker([35.77953, 10.8342], //
        { icon: PortIcon }).bindPopup('<center>Port de Monastir <br> Medium<br>35.7795 | 10.8342</center>'),
    KsibetElMediouni = L.marker([35.69232, 10.8464], //
        { icon: PortIcon }).bindPopup('<center>Port de Ksibet El Mediouni <br> Small<br>35.6923 | 10.8464</center>'),
    Sayada = L.marker([35.67449, 10.89283], //
        { icon: PortIcon }).bindPopup('<center>Port de Sayada <br> Medium<br>35.6745 | 10.8928</center>'),
    Teboulba = L.marker([35.66, 10.9559], //
        { icon: PortIcon }).bindPopup('<center>Port de Teboulba <br> Medium<br>35.6600 | 10.9559</center>'),
    Bekalta = L.marker([36.80858, 10.307729], { icon: PortIcon }).bindPopup('<center>Port de Bekalta <br> Medium<br>35.8255 | 10.6485</center>'),
    Mahdia = L.marker([35.4984, 11.068], //
        { icon: PortIcon }).bindPopup('<center>Port de Mahdia <br> Medium<br>35.4984 | 11.0680</center>'),
    Salakta = L.marker([36.80858, 10.307729], { icon: PortIcon }).bindPopup('Port de '),
    Chebba = L.marker([35.23009, 11.1606], //
        { icon: PortIcon }).bindPopup('<center>Port de Chebba <br> Medium<br>35.2301 | 11.1606</center>'),
    Malloulech = L.marker([36.80858, 10.307729], { icon: PortIcon }).bindPopup('Port de '),
    LouzaLouata = L.marker([35.04309, 11.03402], //
        { icon: PortIcon }).bindPopup('Port de Louza Louata'),
    ElAwebed = L.marker([36.80858, 10.307729], { icon: PortIcon }).bindPopup('Port de '),
    Kraten = L.marker([36.80858, 10.307729], { icon: PortIcon }).bindPopup('Port de '),
    ElAttaya = L.marker([36.80858, 10.307729], { icon: PortIcon }).bindPopup('Port de '),
    Sfax = L.marker([34.728, 10.7789], //
        { icon: PortIcon }).bindPopup('<center>Port de Sfax <br> Medium<br>34.7280 | 10.7789</center>'),
    Mahres = L.marker([34.51738, 10.4993], //
        { icon: PortIcon }).bindPopup('<center>Port de Mahres <br> Small<br>34.5174 | 10.4993</center>'),
    Zabboussa = L.marker([34.3248, 10.1509], //
        { icon: PortIcon }).bindPopup('Port de Zabboussa'),
    Skhira = L.marker([34.29949, 10.1168], //
        { icon: PortIcon }).bindPopup('<center>Port de Skhira <br> Small<br>34.2995 | 10.1168</center>'),
    Gabes = L.marker([33.923783, 10.10338], //
        { icon: PortIcon }).bindPopup('<center>Port de Gabes <br> Small<br>33.923783 | 10.1034</center>'),
    Zarrat = L.marker([36.80858, 10.307729], { icon: PortIcon }).bindPopup('Port de '),
    HoumetEssouk = L.marker([33.88936, 10.8568], //
        { icon: PortIcon }).bindPopup('<center>Port de Houmet Essouk <br> Small<br>33.8894 | 10.8568</center>'),
    Aghir = L.marker([33.7582, 11.023], //
        { icon: PortIcon }).bindPopup('Port de Aghir'),
    Zarzis = L.marker([33.4923, 11.1197], //
        { icon: PortIcon }).bindPopup('<center>Port de Zarzis <br> Small<br>33.4815 | 11.1135</center>'),
    ElGrin = L.marker([36.80858, 10.307729], { icon: PortIcon }).bindPopup('Port de '),
    HassiJallaba = L.marker([36.80858, 10.307729], { icon: PortIcon }).bindPopup('Port de '),
    Boughrara = L.marker([33.54052, 10.68888], //
        { icon: PortIcon }).bindPopup('Port de Boughara'),
    ElKetf = L.marker([36.80858, 10.307729], { icon: PortIcon }).bindPopup('Port de ');

var tab_port = [Tabarka, MenzelAbdrahmen];



var LeafLightHouseIcon = L.Icon.extend({
    options: {
        iconSize: [22],
        iconAnchor: [11, 2]
    }
});

var LightHouseIcon = new LeafLightHouseIcon({ iconUrl: '/js/port-icon-png-19.jpg' }); //anchor1

///var LesCani = L.marker([37.35474,10.12327],
//{ icon: LightHouseIcon, draggable:true,title : 'title popup' }).bindPopup('<center>Île Cani <br>WR | 2 flashes (/10s) | 39m<br>37.35474,10.12327</center>'),


var LesCani = L.marker([37.35474, 10.12327], { icon: LightHouseIcon, title: 'Île Cani' }).bindPopup('<center>Île Cani <br>WR | 2 flashes (/10s) | 39m<br>37.3547 | 10.1233</center>'),
    RasEnghela = L.marker([37.34454, 9.738801], { icon: LightHouseIcon, title: 'Ras Enghela' }).bindPopup('<center>Ras Enghela <br>W | 1 flashes (/2s) | 38m<br>37.3445 | 9.7388</center>'),
    LePlane = L.marker([37.1813, 10.32845], { icon: LightHouseIcon, title: 'Île Plane' }).bindPopup('<center>Île Plane <br>WR | 2 flashes (/10s) | 20m<br>37.1813 | 10.3285</center>'),
    LaGouletteLH = L.marker([36.8065, 10.30866], { icon: LightHouseIcon, title: 'La Goulette LH' }).bindPopup('<center>La Goulette LH <br>W | 2 flashes (/12s) | 13m<br>36.8065 | 10.309</center>'),
    LeKuriat = L.marker([35.80032, 11.03392], { icon: LightHouseIcon, title: 'Île Kuriat' }).bindPopup('<center>Île Kuriat <br>WR | 1 flashes (/5s) | 30m<br>35.8003 | 11.0339</center>'),
    PuntaSanLeonardo = L.marker([36.83597, 11.94413], { icon: LightHouseIcon, title: 'Punta San Leonardo' }).bindPopup('<center>Punta San Leonardo <br>WR | 1 flashes (/3s)<br>36.8360 | 11.9441</center>');


var lighthouse = L.layerGroup([LesCani, //z7.5
    RasEnghela, //z6
    LePlane, //z9
    LaGouletteLH, //z9
    LeKuriat, //z7.5
    PuntaSanLeonardo
]); //z10




var ports = L.layerGroup([Tabarka,
    Zarzouna, //z7.5
    // SidiMechreg,  
    MenzelAbdrahmen, //z10
    CapZbib, //z10
    GharElMelh, //z9
    // KalaatLandalous,  
    LaGoulette, //z6
    SidiDaoud, //z9
    // Haouaria,  
    Kelibia, //z9
    BeniKhiar, //z10
    Hergla, //z10
    Sousse, //z10
    Monastir, //z9
    KsibetElMediouni, //z10
    Sayada, //z9
    Teboulba, //z6
    // Bekalta,  
    Mahdia, //z9
    // Salakta,  
    Chebba, //z7.5
    // Malloulech,  
    // LouzaLouata,  
    // ElAwebed,  
    // Kraten,  
    // ElAttaya,  
    Sfax, //z6
    Mahres, //z9
    // Zabboussa,  
    Skhira, //z10
    Gabes, //z7.5
    // Zarrat,  
    HoumetEssouk, //z9
    // Aghir,  
    Zarzis, //z7.5
    // ElGrin,  
    // HassiJallaba,  
    // Boughrara,  
    // ElKetf  
]);
LaGoulette.addTo(map);
Teboulba.addTo(map);
Sfax.addTo(map);
//LesCani.addTo(map);
RasEnghela.addTo(map);

// var zoom_bar = new L.Control.ZoomBar({ position: 'bottomright' }).addTo(map);


map.on('zoomend', function(e) {
    //var geo = map.getCenter();                
    //console.log(map.getZoom());
    if (map.getZoom() >= 6 && map.getZoom() < 7.5) {
        //LesCani.setLatLng(geo);
        //map.removeLayer(ports);
        LaGoulette.addTo(map);
        Teboulba.addTo(map);
        Sfax.addTo(map);
        //LesCani.addTo(map);
        RasEnghela.addTo(map);
        //LeKuriat.addTo(map);

        Zarzouna.remove(map);
        Chebba.remove(map);
        Gabes.remove(map);
        Zarzis.remove(map);
        GharElMelh.remove(map);
        SidiDaoud.remove(map);
        Kelibia.remove(map);
        Monastir.remove(map);
        Sayada.remove(map);
        Mahdia.remove(map);
        Mahres.remove(map);
        HoumetEssouk.remove(map);
        MenzelAbdrahmen.remove(map);
        CapZbib.remove(map);
        BeniKhiar.remove(map);
        Hergla.remove(map);
        Sousse.remove(map);
        KsibetElMediouni.remove(map);
        Skhira.remove(map);

        LesCani.remove(map); //z7.5
        LePlane.remove(map); //z9
        LaGouletteLH.remove(map); //z9
        LeKuriat.remove(map); //z7.5
        PuntaSanLeonardo.remove(map); //z10

        //console.info("6");
    } else if (map.getZoom() >= 7.5 && map.getZoom() < 9) {
        //map.removeLayer(ports);
        Zarzouna.addTo(map);
        Chebba.addTo(map);
        Gabes.addTo(map);
        Zarzis.addTo(map);

        LesCani.addTo(map);
        LeKuriat.addTo(map);

        GharElMelh.remove(map);
        SidiDaoud.remove(map);
        Kelibia.remove(map);
        Monastir.remove(map);
        Sayada.remove(map);
        Mahdia.remove(map);
        Mahres.remove(map);
        HoumetEssouk.remove(map);
        MenzelAbdrahmen.remove(map);
        CapZbib.remove(map);
        BeniKhiar.remove(map);
        Hergla.remove(map);
        Sousse.remove(map);
        KsibetElMediouni.remove(map);
        Skhira.remove(map);

        LePlane.remove(map); //z9
        LaGouletteLH.remove(map); //z9
        PuntaSanLeonardo.remove(map); //z10

        //console.info("7.5");
    } else if (map.getZoom() >= 9 && map.getZoom() < 10) {
        //map.removeLayer(ports);
        GharElMelh.addTo(map);
        SidiDaoud.addTo(map);
        Kelibia.addTo(map);
        Monastir.addTo(map);
        Sayada.addTo(map);
        Mahdia.addTo(map);
        Mahres.addTo(map);
        HoumetEssouk.addTo(map);

        LePlane.addTo(map);
        LaGouletteLH.addTo(map);

        MenzelAbdrahmen.remove(map);
        CapZbib.remove(map);
        BeniKhiar.remove(map);
        Hergla.remove(map);
        Sousse.remove(map);
        KsibetElMediouni.remove(map);
        Skhira.remove(map);

        PuntaSanLeonardo.remove(map); //z10

        //console.info("9");
    } else if (map.getZoom() >= 10) {
        //map.removeLayer(ports);
        MenzelAbdrahmen.addTo(map);
        CapZbib.addTo(map);
        BeniKhiar.addTo(map);
        Hergla.addTo(map);
        Sousse.addTo(map);
        KsibetElMediouni.addTo(map);
        Skhira.addTo(map);

        PuntaSanLeonardo.addTo(map);
        //console.info("10");
    } else {
        map.removeLayer(ports);
        //console.info("Else");
    }
});

var trackAngle = '77';
var Speedo = '0';
// var TargetMaker = L.marker(['36.11', '12.11'], { icon: TargetIcon, rotationAngle: trackAngle, rotationOrigin: "center" });





Zarzouna.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});

MenzelAbdrahmen.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
CapZbib.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
GharElMelh.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
LaGoulette.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
SidiDaoud.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
Kelibia.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
BeniKhiar.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
Hergla.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
Sousse.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
Monastir.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
KsibetElMediouni.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
Sayada.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
Teboulba.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
Mahdia.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
Teboulba.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
Chebba.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
Sfax.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
Mahres.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 15);
});
Skhira.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
Gabes.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
HoumetEssouk.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});
Zarzis.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 17);
});



var popup = L.popup({
    closeButton: true,
    autoClose: true,
    //keepInView: true,
    //className: "another-popup" // classname for the popup acting like a splash screen
});

var coordMap = true;


function onMapClick(e) {

    if (coordMap) {

        var data = e.latlng.toString().replaceAll("LatLng(", "").replaceAll(")", "").replaceAll(" ", "");
        //.substring(1, 4)
        var latMapClick = data.substring(0, data.indexOf(","));
        var lonMapClick = data.substring(data.indexOf(",") + 1, data.length);
        //console.info("Lat "+latMapClick);
        //console.info("Lon "+lonMapClick);
        data = "Lat " + latFormatter(latMapClick) + " | Lon " + lonFormatter(lonMapClick);
        //data = latMapClick+","+lonMapClick;
        //console.info(data.indexOf(","));
        popup
            .setLatLng(e.latlng)
            .setContent(data)
            .openOn(map);
    }
}
map.on('click', onMapClick); /**/


function lonFormatter(num) {
    var direction = (num < 0) ? 'W' : 'E';
    var formatted = Math.abs(L.Util.formatNum(num, 3)) + 'º ' + direction;
    return formatted;
}

function latFormatter(num) {
    var direction = (num < 0) ? 'S' : 'N';
    var formatted = Math.abs(L.Util.formatNum(num, 3)) + 'º ' + direction;
    return formatted;
}


var options = {
    position: 'bottomright', // Position to show the control. Values: 'topright', 'topleft', 'bottomright', 'bottomleft'
    unit: 'nauticalmiles', // Show imperial or metric distances. Values: 'metres', 'landmiles', 'nauticalmiles'
    clearMeasurementsOnStop: false, // Clear all the measurements when the control is unselected
    showBearings: true, // Whether bearings are displayed within the tooltips
    bearingTextIn: 'In', // language dependend label for inbound bearings
    bearingTextOut: 'Out', // language dependend label for outbound bearings
    tooltipTextFinish: 'Click to <b>finish line</b><br>',
    tooltipTextDelete: 'Press SHIFT-key and click to <b>delete point</b>',
    tooltipTextMove: 'Click and drag to <b>move point</b><br>',
    tooltipTextResume: '<br>Press CTRL-key and click to <b>resume line</b>',
    tooltipTextAdd: 'Press CTRL-key and click to <b>add point</b>',
    // language dependend labels for point's tooltips
    measureControlTitleOn: 'Turn on Polyline Measure', // Title for the control going to be switched on
    measureControlTitleOff: 'Turn off Polyline Measure', // Title for the control going to be switched off
    measureControlLabel: '&#8614;', // Label of the Measure control (maybe a unicode symbol)
    measureControlClasses: [], // Classes to apply to the Measure control
    showClearControl: true, // Show a control to clear all the measurements
    clearControlTitle: 'Clear Measurements', // Title text to show on the clear measurements control button
    clearControlLabel: '&times', // Label of the Clear control (maybe a unicode symbol)
    clearControlClasses: [], // Classes to apply to clear control button
    showUnitControl: true, // Show a control to change the units of measurements
    distanceShowSameUnit: true, // Keep same unit in tooltips in case of distance less then 1 km/mi/nm
    unitControlTitle: { // Title texts to show on the Unit Control button
        text: 'Change Units',
        metres: 'metres',
        kilometres: 'km',
        nauticalmiles: 'nautical miles',
        feet: 'feet',
        landmiles: 'land miles'
    },
    unitControlLabel: { // Unit symbols to show in the Unit Control button and measurement labels
        metres: 'm',
        kilometres: 'km',
        nauticalmiles: 'nm',
        feet: 'ft',
        landmiles: 'mi'
    },
    tempLine: { // Styling settings for the temporary dashed line
        color: '#00f', // Dashed line color
        weight: 2 // Dashed line weight
    },
    fixedLine: { // Styling for the solid line
        color: '#006', // Solid line color
        weight: 2 // Solid line weight
    },
    startCircle: { // Style settings for circle marker indicating the starting point of the polyline
        color: '#000', // Color of the border of the circle
        weight: 1, // Weight of the circle
        fillColor: '#0f0', // Fill color of the circle
        fillOpacity: 1, // Fill opacity of the circle
        radius: 3 // Radius of the circle
    },
    intermedCircle: { // Style settings for all circle markers between startCircle and endCircle
        color: '#000', // Color of the border of the circle
        weight: 1, // Weight of the circle
        fillColor: '#ff0', // Fill color of the circle
        fillOpacity: 1, // Fill opacity of the circle
        radius: 3 // Radius of the circle
    },
    currentCircle: { // Style settings for circle marker indicating the latest point of the polyline during drawing a line
        color: '#000', // Color of the border of the circle
        weight: 1, // Weight of the circle
        fillColor: '#f0f', // Fill color of the circle
        fillOpacity: 1, // Fill opacity of the circle
        radius: 3 // Radius of the circle
    },
    endCircle: { // Style settings for circle marker indicating the last point of the polyline
        color: '#000', // Color of the border of the circle
        weight: 1, // Weight of the circle
        fillColor: '#f00', // Fill color of the circle
        fillOpacity: 1, // Fill opacity of the circle
        radius: 3 // Radius of the circle
    },
};

L.control.scale().addTo(map);



// let polylineMeasure = L.control.polylineMeasure({
//     position: "topleft",
//     unit: "metres",
//     showBearings: true,
//     clearMeasurementsOnStop: false,
//     showClearControl: true,
//     showUnitControl: true
// });
// polylineMeasure.addTo(map);


// L.control.mousePosition({
//     prefix: "",
//     position: 'bottomleft',
//     separator: '&nbsp; &nbsp;|&nbsp; &nbsp;',
//     emptyString: '0º N&nbsp; &nbsp;|&nbsp; &nbsp;0º E',
//     numDigits: 3,
//     lngFormatter: function(num) {
//         var direction = (num < 0) ? 'W' : 'E';
//         var formatted = Math.abs(L.Util.formatNum(num, 3)) + 'º ' + direction;
//         return formatted;
//     },
//     latFormatter: function(num) {
//         var direction = (num < 0) ? 'S' : 'N';
//         var formatted = Math.abs(L.Util.formatNum(num, 3)) + 'º ' + direction;
//         return formatted;
//     }
// }).addTo(map);

//L.control.scale({maxWidth:240, metric:true, imperial:false, position: 'bottomleft'}).addTo (map);




//-------------------------------- Lire les Informations des navires qui connecte aujourd'hui ---------------------------//



var url = "http://127.0.0.1:3000/map/navireMapApi";
fetch(url)
    .then(async(resp) => await resp.json())
    .then(async function(data) {

        // lire les données sous forme Json
        var navireInformation = await data

        // enregistrer les données d'aujourd'hui
        var listePositionsToday = positionsAujourdhui(navireInformation, L)
        var listePositionsFilter = L.layerGroup(listePositionsFilter)

        // affecter les informations de chaque navire pour la formulaire recherche spécifique
        navireInformation[2].forEach(navireInfo => {
            affectNavireInformation(navireInfo['NA'], navireInfo['ID_VMS'])
        });


        // afficher les positions d'aujourd'hui
        map.addLayer(listePositionsToday)


        // le fonctionnement de checkbox et navireButton
        var checkbox = document.querySelectorAll('.onoff')

        var rechercheFormSpecifique = document.querySelector('#rechercheFormSpecifique')
        rechercheFormSpecifique.addEventListener('click', function() {
            map.removeLayer(listePositionsToday)
            if (listePositionsFilter) {
                map.removeLayer(listePositionsFilter)
            }

            var IDVMS_select = document.querySelector('#navireSelect').value
            var date1 = document.querySelector('#rechercheDate1').value
            var date2 = document.querySelector('#rechercheDate2').value
            listePositionsFilter = positionsParFilter(navireInformation, L, date1, date2, IDVMS_select)
            map.addLayer(listePositionsFilter)
        })


        // ajouter eventListener pour afficher les DIV des navires d'une façon dynamique
        var iconBouttonNavire = document.querySelectorAll('#iconNavire')
        for (let i = 0; i < iconBouttonNavire.length; i++) {
            iconBouttonNavire[i].addEventListener('click', function() {
                if (listePositionsFilter) {
                    map.removeLayer(listePositionsFilter)
                    map.addLayer(listePositionsToday)
                }

                displayDiv(iconBouttonNavire, '#affichage', i)
            })
        }

        // ajouter eventListener pour afficher les SOS des navires d'une façon dynamique
        var iconBouttonSOS = document.querySelectorAll('#iconSOS')
        for (let i = 0; i < iconBouttonSOS.length; i++) {
            iconBouttonSOS[i].addEventListener('click', function() {
                displayDiv(iconBouttonSOS, '#affichageSOS', i)
            })
        }

        // ajouter eventListener pour afficher les INFRACTIONS des navires d'une façon dynamique
        var iconBouttonInfraction = document.querySelectorAll('#iconInfraction')
        for (let i = 0; i < iconBouttonInfraction.length; i++) {
            iconBouttonInfraction[i].addEventListener('click', function() {
                displayDiv(iconBouttonInfraction, '#affichageInfraction', i)
            })
        }

        // ajouter eventListener pour afficher les ACKV des navires d'une façon dynamique
        var iconBouttonACKV = document.querySelectorAll('#iconAckv')
        for (let i = 0; i < iconBouttonACKV.length; i++) {
            iconBouttonACKV[i].addEventListener('click', function() {
                displayDiv(iconBouttonACKV, '#affichageACKV', i)
            })
        }


        // affecter les IDVMS pour chaque navire 
        for (let i = 0; i < checkbox.length; i++) {

            let IDVMS = navireInformation[0][i]['ID_VMS']
            checkbox[i].classList.add(IDVMS)

        }




        for (let i = 0; i < checkbox.length; i++) {



            // lire et afficher les SOS d'aujourd'hui
            //--------------------------------------------------------------------------------------------------//
            var SOSData = document.querySelectorAll("#SOSData")
            var sosToday = SOSAujourdhui(navireInformation[1], checkbox[i].classList[1], 0)
            if (sosToday.length > 0) {
                var html = ''
                sosToday.forEach(navireSOS => {
                    html += ' <b>SOS</b> : <br> Temps :    ' + formatTIME(navireSOS['TI']) + "<br> Date : " + formatDate(navireSOS['DA']) + " <br> LT/LG :  " + navireSOS['LT'] + "/" + navireSOS['LG'] + ' <br>'
                });

                SOSData[i].innerHTML = html
            }

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


                    // filterDiv dynamique
                    var filterDiv = document.querySelectorAll('#filterDiv')
                    filterDiv[i].classList.remove('displayDiv')


                    // supprimer les positions d'aujourd'hui
                    map.removeLayer(listePositionsToday)

                    // selectionner les bouttons des formulaires 
                    var buttonClickFormulaire = document.querySelectorAll("#buttonClickFormulaire")

                    // ajouter un eventListener au boutton de la formulaire 
                    buttonClickFormulaire[i].addEventListener('click', function() {
                        var date1Picker = document.querySelectorAll('#date1')
                        var date2Picker = document.querySelectorAll('#date2')

                        listePositionsFilter = positionsParFilter(navireInformation, L, date1Picker[i].value, date2Picker[i].value, checkbox[i].classList[1])
                        var SOSParPicker = SOSFilterPicker(navireInformation[1], checkbox[i].classList[1], date1Picker[i].value, date2Picker[i].value)

                        // afficher les SOS suivant le filtre de picker 
                        if (SOSParPicker.length > 0) {
                            var SOSData = document.querySelectorAll("#SOSData")
                            var html = ''
                            SOSParPicker.forEach(navireSOS => {
                                html = ' <b>SOS</b> : <br> Temps :    ' + formatTIME(navireSOS['TI']) + "<br> Date : " + formatDate(navireSOS['DA']) + " <br> LT/LG :  " + navireSOS['LT'] + "/" + navireSOS['LG'] + ' <br>'
                            })
                            SOSData[i].innerHTML = html
                        }


                        map.addLayer(listePositionsFilter)
                    })




                    //afficher les positions d'ajourd'hui
                    document.getElementById("onoff").value = "On"








                    // si le mode filter non activee
                } else {

                    // filterDiv dynamique
                    var filterDiv = document.querySelectorAll('#filterDiv')
                    filterDiv[i].classList.add('displayDiv')

                    // afficher les SOS d'aujourd'hui
                    var SOSData = document.querySelectorAll("#SOSData")
                    var sosToday = SOSAujourdhui(navireInformation[0], checkbox[i].classList[1], 0)
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


// listePositionsToday.on('click', function(e) {
//     map.setView([coordinates_lat_dd, coordinates_lon_dd], map.getZoom() + 14, { animate: false });
// });






// var c = L.circle([39.2009, 11.2153], { radius: 20000 }).addTo(map);


// var distance = Math.sqrt(Math.pow((c.getLatLng().lat - marker1.getLatLng().lat), 2) + Math.pow((c.getLatLng().lng - marker1.getLatLng().lng), 2));

// if (distance < c.getRadius()) {
//     console.log('in')
// }
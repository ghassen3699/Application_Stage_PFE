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
        var navireInformation = await data

        navireInformation.forEach(navire => {

            var markerLocation = new L.LatLng(navire['LT'], navire['LG'])
            var marker = new L.Marker(markerLocation).bindPopup(navire['NA'] + " || Lat:" + navire['LT'] + " || Lng:" + navire['LG']).openPopup()
            map.addLayer(marker)
        });
    });


//-------------------------------------------------------------------------------------------------------------------------//










var c = L.circle([39.2009, 11.2153], { radius: 20000 }).addTo(map);


var distance = Math.sqrt(Math.pow((c.getLatLng().lat - marker1.getLatLng().lat), 2) + Math.pow((c.getLatLng().lng - marker1.getLatLng().lng), 2));

if (distance < c.getRadius()) {
    console.log('in')
}
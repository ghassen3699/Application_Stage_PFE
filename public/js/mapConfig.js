// get Div element 
const mapDiv = document.getElementById('map');


// create the map 
const map = L.map(mapDiv).setView([39.2009, 11.2153], 11);
const atribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    atribution
});
tiles.addTo(map);


// define the Icons 
var myIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/45/45998.png',
    iconSize: [38, 38],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});


// create Markers & Popup
var marker1 = L.marker([39.2006, 11.173]).bindPopup("Lat:" + 39.2006 + " Lng:" + 11.173).openPopup().addTo(map);
L.marker([37.2002, 11.173], { icon: myIcon }).bindPopup("Lat :" + 37.2002 + " Long :" + 11.173).openPopup().addTo(map);
L.marker([38.2001, 12.173], { icon: myIcon }).bindPopup("Lat :" + 38.2001 + " Long :" + 12.173).openPopup().addTo(map);
L.marker([38.2000, 0.173], { icon: myIcon }).bindPopup("Lat :" + 38.2000 + " Long :" + 0.173).openPopup().addTo(map);


var c = L.circle([39.2009, 11.2153], { radius: 20000 }).addTo(map);


var distance = Math.sqrt(Math.pow((c.getLatLng().lat - marker1.getLatLng().lat), 2) + Math.pow((c.getLatLng().lng - marker1.getLatLng().lng), 2));

if (distance < c.getRadius()) {
    console.log('in')
}
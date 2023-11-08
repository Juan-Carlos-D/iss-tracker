var map = L.map('map').setView([34.57, -118.07], 1);

L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'OSM-Overlay-WMS,TOPO-WMS'
}).addTo(map);

const homeIcon = L.icon({
    iconUrl: 'assets/home.png',
    iconSize: [30, 30],
    iconAnchor: [15, 16]
})

var marker = L.marker([34.57, -118.07], {icon: homeIcon}).addTo(map);
marker.bindPopup('You are here').openPopup();


var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}
    
map.on('click', onMapClick);

// Open Notify API endpoint for ISS current location
const issApiUrl = 'http://api.open-notify.org/iss-now.json';

const issIcon = L.icon({
    iconUrl: 'assets/iss.png',
    iconSize: [50, 32],
    iconAnchor: [25, 16]
})

// Marker for the ISS
var issMarker = L.marker([0, 0], {icon: issIcon}).addTo(map); 
issMarker.bindPopup('ISS is here!').openPopup();

// Function to update the ISS marker's position
function updateMap(latitude, longitude) {
    issMarker.setLatLng([latitude, longitude]).update();
}

// Function to fetch ISS location data
function getISSLocation() {
    fetch(issApiUrl)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const latitude = data.iss_position.latitude;
        const longitude = data.iss_position.longitude;

        // Use the lat and long to update the map or marker 
        updateMap(latitude, longitude); // call the updateMap function
    })
    .catch(error => console.error('Error fetching ISS location data:', error));
}

// Fetch ISS location data at regular intervals (e.g. every 2 seconds)
setInterval(getISSLocation, 2000);

//Initial call to get ISS location
getISSLocation();

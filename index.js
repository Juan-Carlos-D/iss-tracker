var map = L.map('map').setView([34.57, -118.07], 1);

var USGS_USImagery = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 20,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
}).addTo(map);

const homeIcon = L.icon({
    iconUrl: 'assets/astronaut.png',
    iconSize: [30, 30],
    iconAnchor: [15, 16]
})

var marker = L.marker([34.57, -118.07], {icon: homeIcon}).addTo(map);
marker.bindPopup('Home').openPopup();


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
    iconUrl: 'assets/space-station-3.png',
    iconSize: [50, 50],
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

        // Update the HTML elements with the new data
        document.getElementById('iss-lat').textContent = latitude;
        document.getElementById('iss-lon').textContent = longitude;
    })
    .catch(error => console.error('Error fetching ISS location data:', error));
}

// Fetch ISS location data at regular intervals (e.g. every 2 seconds)
setInterval(getISSLocation, 2000);

//Initial call to get ISS location
getISSLocation();

// Create an array to store the ISS path coordinates
var issPathCoordinates = [];

// Function to fetch ISS location data and update the map and path
function updateISSLocation() {
    fetch(issApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const latitude = data.iss_position.latitude;
            const longitude = data.iss_position.longitude;

            // Use the lat and long to update the map or marker
            updateMap(latitude, longitude);

            // Add the new coordinates to the path
            issPathCoordinates.push([latitude, longitude]);
            
            // Update the path with the new coordinates
            issPath.setLatLngs(issPathCoordinates);

            // Update the HTML elements with the new data
            document.getElementById('iss-lat').textContent = latitude;
            document.getElementById('iss-lon').textContent = longitude;
        })
        .catch(error => console.error('Error fetching ISS location data:', error));
}

// Create a polyline (path) for the ISS
var issPath = L.polyline(issPathCoordinates, { color: 'red' }).addTo(map);

// Fetch ISS location data and update at regular intervals (e.g., every 2 seconds)
setInterval(updateISSLocation, 2000);

// Initial call to get ISS location
updateISSLocation();

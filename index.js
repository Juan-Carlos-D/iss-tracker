var map = L.map('map').setView([34.57, -118.07], 1);

var USGS_USImagery = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
}).addTo(map);

const homeIcon = L.icon({
    iconUrl: 'assets/astronaut.png',
    iconSize: [30, 30],
    iconAnchor: [15, 16]
});

var marker = L.marker([34.57, -118.07], { icon: homeIcon }).addTo(map);
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
const issApiUrl = 'https://api.wheretheiss.at/v1/satellites/25544';


const issIcon = L.icon({
    iconUrl: 'assets/space-station-3.png',
    iconSize: [50, 50],
    iconAnchor: [25, 16]
});

// Marker for the ISS
var issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);
issMarker.bindPopup('ISS is here!').openPopup();

// Function to update the ISS marker's position
function updateMap(latitude, longitude) {
    issMarker.setLatLng([latitude, longitude]).update();
}

// Create an array to store the ISS path coordinates
var issPathCoordinates = [];
var issPath = L.polyline(issPathCoordinates, { color: 'red' }).addTo(map);

function updateISSLocation() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    fetch(issApiUrl, { signal: controller.signal })
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(data);
            const latitude = data.latitude;
            const longitude = data.longitude;
            const speed = data.velocity; // Extract ISS speed in km/h

            // Update the ISS marker position
            updateMap(latitude, longitude);

            // Add new coordinates to the path and update it
            issPathCoordinates.push([latitude, longitude]);
            issPath.setLatLngs(issPathCoordinates);

            // Update the HTML elements with new data
            document.getElementById('iss-lat').textContent = latitude.toFixed(5);
            document.getElementById('iss-lon').textContent = longitude.toFixed(5);
            document.getElementById('iss-speed').textContent = speed.toFixed(2) + " km/h"; // Update speed
        })
        .catch(error => console.error('Error fetching ISS location data:', error.message));
}


// Fetch ISS location data at regular intervals (every 2 seconds)
setInterval(updateISSLocation, 2000);

// Initial call to get ISS location
updateISSLocation();

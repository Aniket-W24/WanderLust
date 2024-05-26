//for google maps
//   // Step 4: Initialize the map
//         function initMap() {
//           // The location of the center of the map
//           const location = { lat: 28.7 , lng: 77.1 };
          
//           // The map, centered at the location
//           const map = new google.maps.Map(document.getElementById("map"), {
//             zoom: 8,
//             center: location,
//           });
          
//           // The marker, positioned at the location
//           const marker = new google.maps.Marker({
//             position: location,
//             map: map,
//           });
//         }

//for mapbox
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    // center: [77.2088, 28.6139], // starting position [lng, lat]
    center: coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({color : "red"})
    .setLngLat(coordinates)
    .addTo(map);
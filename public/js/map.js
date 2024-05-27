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
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12",
  // center: [77.2088, 28.6139], // starting position [lng, lat]
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${listing.location}</h3><p>Exact Location will be provided after booking </p>`
    )
  )
  .addTo(map);

// map.on("load", () => {
//   // Load an image from an external URL.
//   map.loadImage(
//     // "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
//     "https://cdn-icons-png.flaticon.com/512/2111/2111320.png",
//     // "<i class='fa-regular fa-compass'>",
//     (error, image) => {
//       if (error) throw error;

//       // Add the image to the map style.
//       map.addImage("cat", image);

//       // Add a data source containing one point feature.
//       map.addSource("point", {
//         type: "geojson",
//         data: {
//           type: "FeatureCollection",
//           features: [
//             {
//               type: "Feature",
//               geometry: listing.geometry,
//             },
//           ],
//         },
//       });

//       // Add a layer to use the image to represent the data.
//       map.addLayer({
//         id: "points",
//         type: "symbol",
//         source: "point", // reference the data source
//         layout: {
//           "icon-image": "cat", // reference the image
//           "icon-size": 0.25,
//         },
//       });
//     }
//   );
// });

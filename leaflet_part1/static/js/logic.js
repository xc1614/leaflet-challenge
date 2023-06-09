// Creating the map object
let myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 6
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(response) {
  // Process the earthquake data
  let earthquakes = response.features;

  // Loop through the earthquakes data and add markers with size and color based on magnitude
  earthquakes.forEach(function(earthquake) {
    let coords = earthquake.geometry.coordinates;
    let magnitude = earthquake.properties.mag;

    // Calculate marker size based on magnitude
    let markerSize = magnitude * 5;

    // Calculate marker color based on magnitude
    let markerColor = getColor(coords[2]);

    // Create a circle marker with size and color
    L.circleMarker([coords[1], coords[0]], {
      radius: markerSize,
      fillColor: markerColor,
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 1,
    }).addTo(myMap)
      .bindPopup(`<strong>Place:</strong> ${earthquake.properties.place}<br>
                  <strong>Magnitude:</strong> ${magnitude}<br>`);
  });

  // Create a legend for the map
  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let grades = [-10, 10, 30, 50, 70, 90];
    let colors = ["#98ff00", "#d4ff00", "#ccff00", "#eecc00", "#ffcc00", "#ff0000"];
    let labels = [];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background-color:' +  colors[i]+'"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}

    return div;
  };

  legend.addTo(myMap);

  // Define the getColor function to calculate marker color based on magnitude
  function getColor(depth) {console.log(depth)
    switch (true) {
      case depth > 90:
      return "#ff0000";
      case depth >70:
      return "#ffcc00";
      case depth >50:
        return "#eecc00";
      case depth >30:
        return "#ccff00";
      case depth >10:
        return "#d4ff00";
    default:
    return "#98ff00";
    }
  }
});


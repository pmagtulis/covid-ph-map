mapboxgl.accessToken = 'pk.eyJ1IjoicG1hZ3R1bGlzMDciLCJhIjoiY2wzdTgyNzh0MjlqNjNjbTl4YWdyczE2aiJ9.OusPbpMc7Ue0YyVgHINiAA';
const bounds = [
  [-106.52384311422753, 26.336565113655656], // Southwest coordinates
  [-92.93354123119515, 36.694146838114285] // Northeast coordinates
  ];
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/pmagtulis07/cl4bop9c5000d14qweqz24ghl',
    zoom: 5,
    maxZoom: 8,
    minZoom: 5,
    center: [-97.854, 32.103],
    projection:'albers',
    maxBounds: bounds
});

map.on("load", function () {
  map.resize();
    map.addLayer({
      id: "texas_outline",
      type: "line",
      source: {
        type: "geojson",
        data: "https://raw.githubusercontent.com/pmagtulis/mapping/main/wildfires/data/countiesWildfire.geojson",
      },
      paint: {
        "line-color": "#ffffff",
        "line-width": 0.7,
      },
    });
    map.addLayer({
      id: "wildfire_numbers",
      type: "fill",
      source: {
        type: "geojson",
        data: "https://raw.githubusercontent.com/pmagtulis/mapping/main/wildfires/data/countiesWildfire.geojson",
      },
      maxzoom: 8, 
      minzoom: 5,
      "paint": {
        "fill-color": [
          "match",
          ["get", "percentiles"],
          "0-10", "#5e4fa2",
          "11-20", "#3288bd",
          "21-30", "#66c2a5",
          "31-40", "#abdda4",
          "41-50", "#e6f598",
          "51-60", "#fee08b",
          "61-70", "#fdae61",
          "71-80", "#f46d43",
          "81-90", "#d53e4f",
          "91-100", "#9e0142",
          "#ffffff",
        ],
    }
    }, "waterway-label");
  });


// Create the popup
map.on('click', 'wildfire_numbers', function (e) {
    var countyName = e.features[0].properties.name_y;
    var burnedPct = e.features[0].properties.pct_burned.toLocaleString('en-US');
    var housingUnits = e.features[0].properties.housing_units.toLocaleString('en-US');
    var burnedHousing = e.features[0].properties.exposed_units.toLocaleString('en-US');
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h1>'+ '<strong>' + countyName + '</strong>' + '</h1>'
            + '<h2>' + 'Total housing units:' + " " + housingUnits + '</h2>'
            + '<h2>' + 'Total units at risk from wildfires:' + " " + '<strong>' + burnedHousing + '</strong>' + '</h2>'
            +'<h1>' + '% of total houses' + " " + '<strong>' + burnedPct + '%' + '</strong>' + '</h1>')
        .addTo(map);
});
// Change the cursor to a pointer when the mouse is over the map
map.on('mouseenter', 'wildfire_numbers', function () {
    map.getCanvas().style.cursor = 'pointer';
});
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'wildfire_numbers', function () {
    map.getCanvas().style.cursor = '';
});
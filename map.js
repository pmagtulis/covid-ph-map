mapboxgl.accessToken = 'pk.eyJ1IjoicG1hZ3R1bGlzMDciLCJhIjoiY2wzdTgyNzh0MjlqNjNjbTl4YWdyczE2aiJ9.OusPbpMc7Ue0YyVgHINiAA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/pmagtulis07/cl47r8lhp001014n747gw9ltk',
    zoom: 4,
    maxZoom: 9,
    minZoom: 3,
    center: [121.630, 11.404],
   // maxBounds: [[104.7, 10.647], [140.59, 10.6]]
});

map.on("load", function () {
    map.addLayer({
      id: "regions_outline",
      type: "line",
      source: {
        type: "geojson",
        data: "data/simplified_regions.geojson",
      },
      paint: {
        "line-color": "#ffffff",
        "line-width": 0.7,
      },
    });
    map.addLayer({
      id: "regions_cases",
      type: "fill",
      source: {
        type: "geojson",
        data: "data/simplified_regions.geojson",
      },
      maxzoom: 5, 
      minzoom: 4,
      "paint": {
        "fill-color": {
            property: "covid_cases",
            stops: [[0, '#004c6d'],
                    [100000, '#09435f'],
                    [200000, '#0e3a51'],
                    [300000, '#103144'],
                    [400000, '#112837'],
                    [500000, '#10202b'],
                    [600000, '#0e181f'],
                    [700000, '#080e13'],
                    [800000, '#000000']]
        }
    }
    }, "waterway-label");

    map.addLayer(
        {
          id: "cities_outline",
          type: "line",
          source: {
            type: "geojson",
            data: "data/simplified_provinces.geojson",
          },
          minzoom: 5,
          maxzoom: 7,
          paint: {
            "line-color": "#ffffff",
            "line-width": 0.25,
          },
        },
        "regions_cases"
      );
      map.addLayer(
        {
          id: "cities_cases",
          type: "fill",
          source: {
            type: "geojson",
            data: "data/simplified_provinces.geojson",
          },
          minzoom: 5,
          maxzoom: 7,
          "paint": {
            "fill-color": {
                property: "covid_cases",
                stops: [[0, '#004c6d'],
                [50000, '#09435f'],
                [100000, '#0e3a51'],
                [150000, '#103144'],
                [200000, '#112837'],
                [250000, '#10202b'],
                [300000, '#0e181f'],
                [350000, '#080e13'],
                [400000, '#000000']]
            }
        }
        },
        "cities_outline"
      );


      map.addLayer(
        {
          id: "municipal_outline",
          type: "line",
          source: {
            type: "geojson",
            data: "data/simplified_municipalities.geojson",
          },
          minzoom: 7,
          paint: {
            "line-color": "#ffffff",
            "line-width": 0.25,
          },
        },
        "cities_cases"
      );
      map.addLayer(
        {
          id: "municipal_cases",
          type: "fill",
          source: {
            type: "geojson",
            data: "data/simplified_municipalities.geojson",
          },
          minzoom: 7,
          "paint": {
            "fill-color": {
                property: "covid_cases",
                stops: [[0, '#004c6d'],
                [25001, '#09435f'],
                [50001, '#0e3a51'],
                [75001, '#103144'],
                [100001, '#112837'],
                [125001, '#10202b'],
                [150001, '#0e181f'],
                [175001, '#080e13'],
                [200001, '#000000']]
            }
        }
        },
        "municipal_outline"
      );
  });

  


// Create the popup
map.on('click', 'regions_cases', function (e) {
    var regionName = e.features[0].properties.regions;
    var covidCases = e.features[0].properties.covid_cases;
    regionName = regionName.toUpperCase();
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h4>'+regionName+'</h4>'
            +'<h2>'+covidCases+'</h2>')
        .addTo(map);
});
// Change the cursor to a pointer when the mouse is over the us_states_elections layer.
map.on('mouseenter', 'regions_cases', function () {
    map.getCanvas().style.cursor = 'pointer';
});
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'regions_cases', function () {
    map.getCanvas().style.cursor = '';
});

map.on('click', 'cities_cases', function (e) {
    var regionName = e.features[0].properties.adm1_en;
    var provinceName = e.features[0].properties.adm2_en;
    var covidCases = e.features[0].properties.covid_cases;
    regionName = regionName.toUpperCase();
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h4>' + provinceName + ' - ' + regionName + '</h4>'
            + '<h2>' + covidCases + '</h2>')
        .addTo(map);
});
map.on('mouseenter', 'cities_cases', function () {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'cities_cases', function () {
    map.getCanvas().style.cursor = '';
});

map.on('click', 'municipal_cases', function (e) {
  var provinceName = e.features[0].properties.province;
  var municipalName = e.features[0].properties.municipality;
  var covidCases = e.features[0].properties.covid_cases;
  provinceName = provinceName.toUpperCase();
  new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML('<h4>' + provinceName + ' - ' + municipalName + '</h4>'
          + '<h2>' + covidCases + '</h2>')
      .addTo(map);
});
map.on('mouseenter', 'municipal_cases', function () {
  map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'municipal_cases', function () {
  map.getCanvas().style.cursor = '';
});
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
  map.resize();
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
            property: "case_per_pop",
            stops: [[0, '#f2e926'],
                    [1000, '#efd124'],
                    [2000, '#ebb822'],
                    [3000, '#e8a01f'],
                    [4000, '#e5871d'],
                    [5000, '#e16f1b'],
                    [6000, '#de5619'],
                    [7000, '#db3e16'],
                    [8000, '#d72514']]
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
                property: "case_per_pop",
                stops: [[0, '#f2e926'],
                [1000, '#efd124'],
                [2000, '#ebb822'],
                [3000, '#e8a01f'],
                [4000, '#e5871d'],
                [5000, '#e16f1b'],
                [6000, '#de5619'],
                [7000, '#db3e16'],
                [8000, '#d72514']]
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
                property: "case_per_pop",
                stops: [[0, '#f2e926'],
                [201, '#efd124'],
                [401, '#ebb822'],
                [601, '#e8a01f'],
                [801, '#e5871d'],
                [1001, '#e16f1b'],
                [1201, '#de5619'],
                [1401, '#db3e16'],
                [1601, '#d72514']]
            }
        }
        },
        "municipal_outline"
      );
  });

  


// Create the popup
map.on('click', 'regions_cases', function (e) {
    var regionName = e.features[0].properties.regions;
    var casePerPop = e.features[0].properties.case_per_pop.toLocaleString('en-US');
    var covidCases = e.features[0].properties.covid_cases.toLocaleString('en-US');
    regionName = regionName.toUpperCase();
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h2>'+ '<strong>' + regionName + '</strong>' + '</h2>'
            + '<h2>' + 'Number of cases:' + " " + covidCases + '</h2>'
            +'<h1>' + 'Case per 100,000:' + " " + '<strong>' + casePerPop + '</strong>' + '</h1>')
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
    var casePerPop = e.features[0].properties.case_per_pop.toLocaleString('en-US');
    var provinceName = e.features[0].properties.province;
    var covidCases = e.features[0].properties.covid_cases.toLocaleString('en-US');
    regionName = regionName.toUpperCase();
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h2>'+ '<strong>' + provinceName + '</strong>' + '-' + regionName + '</h2>'
            + '<h2>' + 'Number of cases:' + " " + covidCases + '</h2>'
            +'<h1>' + 'Case per 100,000:' + " " + '<strong>' + casePerPop + '</strong>' + '</h1>')
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
  var casePerPop = e.features[0].properties.case_per_pop.toLocaleString('en-US');
  var covidCases = e.features[0].properties.covid_cases.toLocaleString('en-US');
  provinceName = provinceName.toUpperCase();
  new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML('<h2>'+ '<strong>' + municipalName + '</strong>' + '-' + provinceName + '</h2>'
            + '<h2>' + 'Number of cases:' + " " + covidCases + '</h2>'
            +'<h1>' + 'Case per 10,000:' + " " + '<strong>' + casePerPop + '</strong>' + '</h1>')
      .addTo(map);
});
map.on('mouseenter', 'municipal_cases', function () {
  map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'municipal_cases', function () {
  map.getCanvas().style.cursor = '';
});
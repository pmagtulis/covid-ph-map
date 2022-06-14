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
            stops: [[0, '#f2e926'],
                    [100000, '#efd124'],
                    [200000, '#ebb822'],
                    [300000, '#e8a01f'],
                    [400000, '#e5871d'],
                    [500000, '#e16f1b'],
                    [600000, '#de5619'],
                    [700000, '#db3e16'],
                    [800000, '#d72514']]
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
                stops: [[0, '#f2e926'],
                [50000, '#efd124'],
                [100000, '#ebb822'],
                [150000, '#e8a01f'],
                [200000, '#e5871d'],
                [250000, '#e16f1b'],
                [300000, '#de5619'],
                [350000, '#db3e16'],
                [400000, '#d72514']]
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
                stops: [[0, '#f2e926'],
                [25001, '#efd124'],
                [50001, '#ebb822'],
                [75001, '#e8a01f'],
                [100001, '#e5871d'],
                [125001, '#e16f1b'],
                [150001, '#de5619'],
                [175001, '#db3e16'],
                [200001, '#d72514']]
            }
        }
        },
        "municipal_outline"
      );
  });

  


// Create the popup
map.on('click', 'regions_cases', function (e) {
    var regionName = e.features[0].properties.regions;
    var covidCases = e.features[0].properties.covid_cases.toLocaleString('en-US');
    regionName = regionName.toUpperCase();
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h2>'+ '<strong>' + regionName + '</strong>' + '</h2>'
            +'<h1>'+covidCases+'</h1>')
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
    var covidCases = e.features[0].properties.covid_cases.toLocaleString('en-US');
    regionName = regionName.toUpperCase();
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h2>' + '<strong>' + provinceName + '</strong>' + ' - ' + regionName + '</h2>'
            + '<h1>' + covidCases + '</h1>')
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
  var covidCases = e.features[0].properties.covid_cases.toLocaleString('en-US');
  provinceName = provinceName.toUpperCase();
  new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML('<h2>' + '<strong>' + municipalName + '</strong>' + ' - ' + provinceName + '</h2>'
          + '<h1>' + covidCases + '</h1>')
      .addTo(map);
});
map.on('mouseenter', 'municipal_cases', function () {
  map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'municipal_cases', function () {
  map.getCanvas().style.cursor = '';
});
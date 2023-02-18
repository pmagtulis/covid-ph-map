mapboxgl.accessToken =
  'pk.eyJ1IjoicG1hZ3R1bGlzMDciLCJhIjoiY2wzdTgyNzh0MjlqNjNjbTl4YWdyczE2aiJ9.OusPbpMc7Ue0YyVgHINiAA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/pmagtulis07/cl47r8lhp001014n747gw9ltk',
  zoom: 5,
  maxZoom: 10,
  minZoom: 5,
  center: [122.104, 12.100],
  // maxBounds: [[104.7, 10.647], [140.59, 10.6]]
});

map.on('load', function () {
  map.resize();
  map.addLayer({
    id: 'regions_outline',
    type: 'line',
    source: {
      type: 'geojson',
      data: 'data/simplified_regions.geojson',
    },
    paint: {
      'line-color': '#ffffff',
      'line-width': 0.7,
    },
  });
  map.addLayer(
    {
      id: 'regions_cases',
      type: 'fill',
      source: {
        type: 'geojson',
        data: 'data/simplified_regions.geojson',
      },
      maxzoom: 6,
      minzoom: 5,
      paint: {
        'fill-color': [
          'match',
          ['get', 'percentiles'],
          '0-1000',
          '#f2e926',
          '1001-2000',
          '#efd124',
          '2001-3000',
          '#ebb822',
          '3001-4000',
          '#e8a01f',
          '4001-5000',
          '#e5871d',
          '5001-6000',
          '#e16f1b',
          '6001-7000',
          '#de5619',
          '7001-8000',
          '#db3e16',
          '8001-9000',
          '#ea3322',
          '9001-10000',
          '#d72514',
          '10001-11000',
          '#91260d',
          '#ffffff',
        ],
      },
    },
    'waterway-label'
  );

  map.addLayer(
    {
      id: 'cities_outline',
      type: 'line',
      source: {
        type: 'geojson',
        data: 'data/simplified_provinces.geojson',
      },
      minzoom: 5,
      maxzoom: 7,
      paint: {
        'line-color': '#ffffff',
        'line-width': 0.25,
      },
    },
    'regions_cases'
  );
  map.addLayer(
    {
      id: 'cities_cases',
      type: 'fill',
      source: {
        type: 'geojson',
        data: 'data/simplified_provinces.geojson',
      },
      minzoom: 6,
      maxzoom: 8,
      paint: {
        'fill-color': [
          'match',
          ['get', 'percentiles'],
          '0-1000',
          '#f2e926',
          '1001-2000',
          '#efd124',
          '2001-3000',
          '#ebb822',
          '3001-4000',
          '#e8a01f',
          '4001-5000',
          '#e5871d',
          '5001-6000',
          '#e16f1b',
          '6001-7000',
          '#de5619',
          '7001-8000',
          '#db3e16',
          '8001-9000',
          '#ea3322',
          '9001-10000',
          '#d72514',
          '10001-11000',
          '#91260d',
          '11001-12000',
          '#91260d',
          '#ffffff',
        ],
      },
    },
    'cities_outline'
  );

  map.addLayer(
    {
      id: 'municipal_outline',
      type: 'line',
      source: {
        type: 'geojson',
        data: 'data/simplified_municipalities.geojson',
      },
      minzoom: 8,
      paint: {
        'line-color': '#ffffff',
        'line-width': 0.25,
      },
    },
    'cities_cases'
  );
  map.addLayer(
    {
      id: 'municipal_cases',
      type: 'fill',
      source: {
        type: 'geojson',
        data: 'data/simplified_municipalities.geojson',
      },
      minzoom: 7,
      paint: {
        'fill-color': [
          'match',
          ['get', 'percentiles'],
          '0-200',
          '#f2e926',
          '201-400',
          '#efd124',
          '401-600',
          '#ebb822',
          '601-800',
          '#e8a01f',
          '801-1000',
          '#e5871d',
          '1001-1200',
          '#e16f1b',
          '1201-1400',
          '#de5619',
          '1401-1600',
          '#db3e16',
          '1601-1800',
          '#ea3322',
          '1801-2000',
          '#d72514',
          '#ffffff',
        ],
      },
    },
    'municipal_outline'
  );
});

// Create the popup
map.on('click', 'regions_cases', function (e) {
  var regionName = e.features[0].properties.regions;
  var casePerPop = e.features[0].properties.case_per_pop.toLocaleString(
    'en-US'
  );
  var covidCases = e.features[0].properties.covid_cases.toLocaleString('en-US');
  regionName = regionName.toUpperCase();
  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(
      '<h5>' +
        '<strong>' +
        regionName +
        '</strong>' +
        '</h5>' +
        '<h5>' +
        'Number of cases:' +
        ' ' +
        covidCases +
        '</h5>' +
        '<h4>' +
        'Case per 100,000:' +
        ' ' +
        '<strong>' +
        casePerPop +
        '</strong>' +
        '</h4>'
    )
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
  var casePerPop = e.features[0].properties.case_per_pop.toLocaleString(
    'en-US'
  );
  var provinceName = e.features[0].properties.province;
  var covidCases = e.features[0].properties.cases.toLocaleString('en-US');
  regionName = regionName.toUpperCase();
  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(
      '<h5>' +
        '<strong>' +
        provinceName +
        '</strong>' +
        '-' +
        regionName +
        '</h5>' +
        '<h5>' +
        'Number of cases:' +
        ' ' +
        covidCases +
        '</h5>' +
        '<h4>' +
        'Case per 100,000:' +
        ' ' +
        '<strong>' +
        casePerPop +
        '</strong>' +
        '</h4>'
    )
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
  var casePerPop = e.features[0].properties.case_per_pop.toLocaleString(
    'en-US'
  );
  var covidCases = e.features[0].properties.covid_cases.toLocaleString('en-US');
  provinceName = provinceName.toUpperCase();
  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(
      '<h5>' +
        '<strong>' +
        municipalName +
        '</strong>' +
        '-' +
        provinceName +
        '</h5>' +
        '<h5>' +
        'Number of cases:' +
        ' ' +
        covidCases +
        '</h5>' +
        '<h4>' +
        'Case per 10,000:' +
        ' ' +
        '<strong>' +
        casePerPop +
        '</strong>' +
        '</h4>'
    )
    .addTo(map);
});
map.on('mouseenter', 'municipal_cases', function () {
  map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'municipal_cases', function () {
  map.getCanvas().style.cursor = '';
});

(function () {
  const margin = { top: 55, right: 40, bottom: 40, left: 50 };

  const width = 300 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  const container = d3.select('#small-multiples');

  const colorScale = d3.scaleOrdinal().range(d3.schemeDark2);
  const xPositionScale = d3.scaleTime().range([0, width]);
  const yPositionScale = d3.scaleLinear().range([height, 0]);
  const parseDate = d3.timeParse('%Y-%m-%d');

  const line = d3
    .line()
    .x((d) => xPositionScale(d.date))
    .y((d) => yPositionScale(d['Case per 100,000']));

  d3.csv('data/regional cases.csv')
    .then(ready)
    .catch(function (error) {
      console.log('Failed with', error);
    });

  function ready(datapoints) {
    // Try it without this and see what happens!
    datapoints.forEach(function (d) {
      d.date = parseDate(d.date);
      d['Case per 100,000'] = +d['Case per 100,000'];
    });

    // Update the scales
    // You could also try putting this inside of the .each
    const maxCases = d3.max(datapoints, (d) => d['Case per 100,000']);
    yPositionScale.domain([0, maxCases]).nice();
    xPositionScale.domain(d3.extent(datapoints, (d) => d.date));

    const grouped = d3.group(datapoints, (d) => d['Region']);

    container
      .selectAll('div')
      .data(grouped)
      .enter('div')
      .each(function (group) {
        const groupName = group[0];
        const datapoints = group[1].sort((a, b) =>
          d3.ascending(a.date, b.date)
        );
        const container = d3.select(this);

        const svg = container
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

        svg
          .append('path')
          .datum(datapoints)
          .attr('stroke', '#d72514')
          .attr('stroke-linecap', 'round')
          .attr('stroke-width', 2)
          .attr('fill', 'none')
          .attr('d', line);

        const yAxis = d3.axisLeft(yPositionScale).ticks(3);
        svg
          .append('g')
          .attr('class', 'axis y-axis')
          .style('stroke-width', 2) // increase stroke width of axis
          .style('font-size', '14px')
          .style('font-family', 'Roboto')
          .call(yAxis);

        const xAxis = d3.axisBottom(xPositionScale).ticks(3);
        svg
          .append('g')
          .attr('class', 'axis x-axis')
          .style('stroke-width', 2) // increase stroke width of axis
          .style('font-size', '14px')
          .style('font-family', 'Roboto')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);

        svg
          .append('text')
          .attr('x', width / 2)
          .style('font-size', '15px')
          .style('font-family', 'Roboto')
          .style('font-weight', 'bold')
          .attr('text-anchor', 'middle')
          .attr('transform', 'translate(0,-30)')
          .text(`${groupName}`);
      });
  }
})();

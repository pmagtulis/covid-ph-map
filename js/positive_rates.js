(function () {
  const margin = { top: 20, right: 30, bottom: 30, left: 70 };

  const width = 400 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  const svg = d3
    .select('#single-line')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const xPositionScale = d3.scaleTime().range([0, width]);
  const yPositionScale = d3.scaleLinear().range([height, 0]);
  const parseDate = d3.timeParse('%m/%d/%y');

  const line = d3
    .line()
    .x((d) => xPositionScale(d.date))
    .y((d) => yPositionScale(d.positivity));

  const area = d3
    .area()
    .x((d) => xPositionScale(d.date))
    .y0(height)
    .y1((d) => yPositionScale(d.positivity));

  console.log(area);

  d3.csv('data/positivity_rates.csv')
    .then(ready)
    .catch(function (error) {
      console.log('Failed with', error);
    });

  function ready(datapoints) {
    // Try it without this and see what happens!
    datapoints.forEach(function (d) {
      d.date = parseDate(d.date);
      d.positivity = +d.positivity;
    });

    // Update the scales
    const maxCases = d3.max(datapoints, (d) => d.positivity);
    yPositionScale.domain([0, maxCases]).nice();
    xPositionScale.domain(d3.extent(datapoints, (d) => d.date));

    svg
      .append('path')
      .datum(datapoints)
      .attr('fill', '#999999')
      .attr('class', 'area')
      .attr('fill-opacity', 0.3)
      .attr('d', area);

    svg
      .append('path')
      .datum(datapoints)
      .attr('stroke', '#333333')
      .attr('stroke-width', 1.5)
      .attr('fill', 'none')
      .attr('d', line);

    const yAxis = d3
      .axisLeft(yPositionScale)
      .tickSize(5, 0) // size of ticks
      .ticks(4)
      .tickPadding([5]);

    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .style('stroke-width', 3) // increase stroke width of axis
      .style('font-size', '14px')
      .style('font-family', 'Roboto')
      .call(yAxis);

    const xAxis = d3
      .axisBottom(xPositionScale)
      .tickFormat(d3.timeFormat('%Y'))
      .tickSize(5, 0) // size of ticks
      .ticks(3)
      .tickPadding([10]);

    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .style('stroke-width', 3) // increase stroke width of axis
      .style('font-size', '14px')
      .style('font-family', 'Roboto')
      .call(xAxis);

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', 'black')
      .style('font-family', 'Roboto')
      .text('Positivity rate');
  }
})();

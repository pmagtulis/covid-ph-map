;(function () {
    const margin = { top: 20, right: 50, bottom: 50, left: 70 }

    const width = 1000 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom

    const svg = d3
        .select("#single-line")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    const xPositionScale = d3.scaleTime().range([0, width])
    const yPositionScale = d3.scaleLinear().range([height, 0])
    const parseDate = d3.timeParse("%m/%d/%y")

    const line = d3
        .line()
        .x(d => xPositionScale(d.date))
        .y(d => yPositionScale(d.cases))
    
    const area = d3
        .area()
        .x(d => xPositionScale(d.date))
        .y0(height)
        .y1(d => yPositionScale(d.cases))

    console.log(area);

    d3.csv("data/covid_rolling.csv")
        .then(ready)
        .catch(function (error) {
            console.log("Failed with", error)
        })

        function ready(datapoints) {
            // Try it without this and see what happens!
            datapoints.forEach(function (d) {
                d.date = parseDate(d.date)
                d.cases = +d.cases
            })
    
            // Update the scales
            const maxCases = d3.max(datapoints, d => d.cases)
            yPositionScale.domain([0, maxCases]).nice()
            xPositionScale.domain(d3.extent(datapoints, d => d.date))
    
            svg.append("path")
                .datum(datapoints)
                .attr("fill", "red")
                .attr("class", "area")
                .attr("fill-opacity", .3)
                .attr("d", area);
    
            svg.append("path")
                .datum(datapoints)
                .attr("stroke", "red")
                .attr("stroke-width", 2)
                .attr("fill", "none")
                .attr("d", line)
    
            const yAxis = d3.axisLeft(yPositionScale)
                .tickSize(10,0) // size of ticks
                .tickPadding([5]);
    
            svg.append("g").attr("class", "axis y-axis")
                .style("stroke-width", 3) // increase stroke width of axis
                .style("font", "14px times")
                .style("font-family", "roboto")
                .call(yAxis)
    
            const xAxis = d3.axisBottom(xPositionScale)
                .ticks(5)
                .tickFormat(d3.timeFormat("%B %Y"))
                .tickSize(10,0) // size of ticks
                .tickPadding([15]);
    
            svg.append("g")
                .attr("class", "axis x-axis")
                .attr("transform", "translate(0," + height + ")")
                .style("stroke-width", 3) // increase stroke width of axis
                .style("font", "14px times")
                .style("font-family", "roboto")
                .call(xAxis)
    
            const parentSVG = d3.select("#single-line").select("svg");
            const tooltip = parentSVG
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .append("g")
                .style("pointer-events", "none");
    
            function pointermoved(event) {
                // setup a bisector to lookup the correspoding data point based on a date
                const bisectData = d3.bisector(d => d.date).center;
                // use the x scale to do a reverse lookup from x position to date
                const eventDate = xPositionScale.invert(d3.pointer(event)[0]);
                const i = bisectData(datapoints, xPositionScale.invert(d3.pointer(event)[0]));
                const dataEntry = datapoints[i]
                // show tooltip
                tooltip.style("display", null);
                // set the x and y position with the scales
                tooltip.attr("transform", `translate(${xPositionScale(dataEntry.date)},${yPositionScale(dataEntry.cases)})`);
                //
                const path = tooltip.selectAll("path")
                  .data([,])
                  .join("path")
                    .attr("fill", "white")
                    .attr("stroke", "black");
                const formatDate = d3.timeFormat("%B %d, %y");
    
                const text = tooltip.selectAll("text")
                  .data([,])
                  .join("text")
                  .call(text => text
                    .selectAll("tspan")
                    .data(`${formatDate(dataEntry.date)}\n${dataEntry.cases}`.split(/\n/))
                    .join("tspan")
                      .attr("x", 0)
                      .attr("y", (_, i) => `${i * 1.1}em`)
                      .attr("font-weight", (_, i) => i ? null : "bold")
                      .attr("fill", "#000")
                      .text(d => d));
                        
                const {x, y, width: w, height: h} = text.node().getBBox();
                text.attr("transform", `translate(${-w / 2},${15 - y})`);
                path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
            }
            function pointerleft() {
                tooltip.style("display", "none");
                svg.node().value = null;
                svg.dispatch("input", {bubbles: true});
            }
            parentSVG.on("pointerenter pointermove", pointermoved)
            parentSVG.on("pointerleave", pointerleft)
    
        }
})()
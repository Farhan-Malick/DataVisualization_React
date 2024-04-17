import React, { useEffect, useRef } from "react";
import { select } from "d3-selection";
import * as d3 from "d3";

import cricketData from "./CricketData";

const HorizontalBarChart = () => {
  // Reference to the SVG element
  const svgRef = useRef(null);

  useEffect(() => {
    // Define margins and dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Select the SVG element
    const svg = select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Ensure numeric values for runs and wickets
    cricketData.forEach(d => {
      d.runs = +d.runs;
      d.wickets = +d.wickets;
    });

    // Define scales
    const x = d3.scaleLinear()
      .domain([0, d3.max(cricketData, d => d.runs)])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(cricketData.map(d => d.player))
      .range([0, height])
      .padding(0.1);

    // Add bars
    svg.selectAll(".bar")
      .data(cricketData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("y", d => y(d.player))
      .attr("width", d => x(d.runs))
      .attr("height", y.bandwidth())
      .attr("fill", "steelblue")
      .on("mouseover", function(event, d) {
        select(this).attr("fill", "orange"); // Change color on hover
        tooltip.style("opacity", 1)
          .html(`Player: ${d.player}<br/>Runs: ${d.runs}<br/>Wickets: ${d.wickets}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 20) + "px");
      })
      .on("mouseout", function() {
        select(this).attr("fill", "steelblue"); // Revert color on mouseout
        tooltip.style("opacity", 0);
      });

    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add tooltip
    const tooltip = select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  }, []);

  return (
    <div>
      {/* Chart title */}
      <h3>Runs of Players - Horizontal Bar Chart</h3>
      {/* SVG container */}
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default HorizontalBarChart;

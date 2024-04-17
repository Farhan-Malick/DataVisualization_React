import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import cricketData from "./CricketData";

// Define years list
const yearsList = [
  { year: 2016 },
  { year: 2017 },
  { year: 2018 },
  { year: 2019 },
  { year: 2020 },
];

// Component for Pie Chart
const Pie_Chart = () => {
  // State for selected year
  const [selectedYear, setSelectedYear] = useState(2016);

  // useEffect hook to handle updates
  useEffect(() => {
    // Filter cricket data based on selected year
    const filteredData = cricketData.filter((item) => item.year === selectedYear);

    // Create color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(filteredData.map((item) => item.player))
      .range(d3.schemeCategory10);

    // Create pie generator
    const pie = d3.pie().value((d) => d.runs);

    // Define dimensions
    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2;

    // Select SVG container
    const svg = d3
      .select("#pie-chart-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 150}, 20)`)
      .selectAll(".legend")
      .data(filteredData.map((item) => item.player))
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    // Add legend rectangles
    legend
      .append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d) => colorScale(d));

    // Add legend labels
    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text((d) => d);

    // Add tooltip
    const tooltip = d3
      .select("#pie-chart-container")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Function to update chart
    const updateChart = (data) => {
      const arcs = svg.selectAll("arc").data(pie(data));

      const arcEnter = arcs
        .enter()
        .append("g")
        .attr("class", "arc")
        .on("mouseover", function (event, d) {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip.html(`${d.data.player} - ${d.data.battingStrikeRate}%`)
            .style("left", event.pageX + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function () {
          tooltip.transition().duration(500).style("opacity", 0);
        });

      arcEnter
        .append("path")
        .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
        .attr("fill", (d) => colorScale(d.data.player))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .on("click", (event, d) => {
          console.log("Clicked on:", d.data.player);
        });

      arcs.attr("d", d3.arc().innerRadius(0).outerRadius(radius));

      arcs.exit().remove();
    };

    // Call updateChart function
    updateChart(filteredData);

    // Cleanup function
    return () => {
      const chartContainer = d3.select("#pie-chart-container");
      chartContainer.selectAll("*").remove();
    };
  }, [selectedYear]);

  // Function to handle year change
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  // Return JSX
  return (
    <div>
      <h3
        style={{
          color: "black",
          marginBottom: "20px",
          marginLeft: "-110px" ,
          textAlign: "center",
        }}
      >
        Cricket Players Comparison From 2016-2020
      </h3>
      <div style={{ marginLeft: "400px" }}>
        <label htmlFor="year-select" style={{ color: "black", marginRight: "10px" }}>
          Select Year:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
          
        >
          <option value="All">All Players</option>
          {yearsList.map((d) => (
            <option key={d.year} value={d.year}>
              {d.year}
            </option>
          ))}
        </select>
      </div>
      <div
        id="pie-chart-container"
        style={{
          width: "100%",
          maxWidth: "600px",
          marginLeft: "200px",
          marginTop: "40px",
          height: "800px",
        }}
      />
    </div>
  );
};

export default Pie_Chart;

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cricketData from "./CricketData";

const Line_Chart = () => {
  // Ref to the SVG element
  const svgRef = useRef(null);

  useEffect(() => {
    // Define margins and dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 140 };
    const width = 800 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    // Select SVG element
    const svg = d3.select(svgRef.current);

    // Extract unique years from data
    const uniqueYears = Array.from(new Set(cricketData.map((d) => d.year)));

    // X scale for years
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(uniqueYears.map((year) => year.toString()))
      .padding(0.1);

    // Y scale for runs
    const y = d3.scaleLinear().range([height, 0]).domain([0, 2000]);

    // Line generator
    const line = d3
      .line()
      .x((d) => x(d.year.toString()) + x.bandwidth() / 2)
      .y((d) => y(d.runs))
      .curve(d3.curveMonotoneX);

    // Append X axis
    svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));

    // Append Y axis with label
    const yAxis = svg.append("g").call(d3.axisLeft(y).ticks(10));
    yAxis
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 10)
      .attr("dy", "0.71em")
      .style("text-anchor", "end")
      .text("Runs");

    // Customize tick labels
    svg
      .selectAll(".tick text")
      .attr("transform", "translate(-8,0)")
      .style("text-anchor", "end")
      .attr("dy", "0.35em");

    // Extract unique player names
    const players = Array.from(new Set(cricketData.map((d) => d.player)));

    // Create legend
    const legend = svg
      .selectAll(".legend")
      .data(players)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        (d, i) => `translate(${width + 20}, ${i * 32 + margin.top})`
      )
      .on("click", (event, d) => togglePlayer(d));

    // Add legend rectangle
    legend
      .append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d, i) => d3.schemeCategory10[i]);

    // Add legend text
    legend
      .append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .text((d) => d);

    // Append lines for each player
    const lines = players.map((player) => {
      const playerData = cricketData.filter((d) => d.player === player);
      return {
        player,
        line: svg
          .append("path")
          .data([playerData])
          .attr("fill", "none")
          .attr("stroke", () => d3.schemeCategory10[players.indexOf(player)])
          .attr("stroke-width", 2)
          .attr("d", line)
          .attr("data-player", player),
      };
    });

    // Append dots for each data point
    const dots = svg
      .selectAll(".dot")
      .data(cricketData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.year.toString()) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.runs))
      .attr("r", 5)
      .style("fill", (d) => d3.schemeCategory10[players.indexOf(d.player)])
      .style("display", "initial")
      .on("mouseover", (event, d) => {
        const tooltip = svg.append("g").attr("class", "tooltip");
        tooltip
          .append("rect")
          .attr("x", x(d.year.toString()) + x.bandwidth() / 2 - 30)
          .attr("y", y(d.runs) - 25)
          .attr("width", 60)
          .attr("height", 20)
          .style("fill", "white")
          .style("stroke", "black");
        tooltip
          .append("text")
          .attr("x", x(d.year.toString()) + x.bandwidth() / 2)
          .attr("y", y(d.runs) - 15)
          .style("text-anchor", "middle")
          .text(`Runs: ${d.runs}`);
      })
      .on("mouseout", () => {
        svg.selectAll(".tooltip").remove();
      });

    // Function to toggle visibility of player's line and dots
    function togglePlayer(player) {
      const index = lines.findIndex((line) => line.player === player);
      const line = lines[index].line;
      const dot = svg.selectAll(`.dot[data-player="${player}"]`);

      const isHidden = line.style("display") === "none";
      line.style("display", isHidden ? "initial" : "none");
      dot.style("display", isHidden ? "initial" : "none");
    }
  }, []);

  // Return JSX
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h3 className="align-items-center">Player Runs Based Comparison 2016-2020</h3>
      {/* SVG container */}
      <svg ref={svgRef} width={800} height={450}>
        {/* Group elements */}
        <g />
        <g />
      </svg>
    </div>
  );
};

export default Line_Chart;

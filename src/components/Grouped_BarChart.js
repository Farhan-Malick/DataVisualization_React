import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import cricketData from "./CricketData";

const Grouped_BarChart = () => {
  // Refs for SVG and tooltip
  const svgRef = useRef();
  const tooltipRef = useRef();

  // State for selected player
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    // Check if cricketData is available
    if (!cricketData || cricketData.length === 0) {
      console.error("Cricket data is empty or null");
      return;
    }

    // Define margins and dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 900 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Extract unique players and years from cricketData
    const players = [...new Set(cricketData.map((d) => d.player))];
    const years = [...new Set(cricketData.map((d) => d.year))];

    // Define scales
    const xScale = d3.scaleBand().domain(years).range([0, width]).padding(0.1);
    const yScale = d3.scaleLinear().domain([0, d3.max(cricketData, (d) => d.runs)]).range([height, 0]);
    const colorScale = d3.scaleOrdinal().domain(players).range(d3.schemeCategory10);

    // Draw bars for each data point
    svg
      .selectAll(".barGroup")
      .data(cricketData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.year) + xScale.bandwidth() / players.length * players.indexOf(d.player))
      .attr("y", (d) => yScale(d.runs))
      .attr("width", xScale.bandwidth() / players.length)
      .attr("height", (d) => height - yScale(d.runs))
      .attr("fill", (d) => colorScale(d.player))
      .style("opacity", (d) => (selectedPlayer ? (d.player === selectedPlayer ? 1 : 0.5) : 1))
      // Tooltip interactions
      .on("mouseover", (event, d) => {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`${d.player}: ${d.runs} runs`).style("left", event.pageX + "px").style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        d3.select(tooltipRef.current).transition().duration(500).style("opacity", 0);
      })
      // Click event to select/deselect player
      .on("click", (event, d) => {
        setSelectedPlayer((prev) => (prev === d.player ? null : d.player));
      });

    // Add x-axis
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));

    // Add y-axis
    svg.append("g").call(d3.axisLeft(yScale));
  }, [cricketData, selectedPlayer]);

  return (
    // Container for the chart and tooltip
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Chart title */}
      <h3 className="align-items-center">Player Runs Based Comparison 2016-2020</h3>
      {/* SVG container */}
      <svg ref={svgRef}></svg>
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          padding: "10px",
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          pointerEvents: "none",
          opacity: 0,
        }}
      ></div>
    </div>
  );
};

export default Grouped_BarChart;

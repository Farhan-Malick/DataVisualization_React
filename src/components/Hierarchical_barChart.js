import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import cricketData from "./CricketData";

// List of players for selection
const playersList = [
  { player: "Kohli" },
  { player: "Rohit Sharma" },
  { player: "Steve Smith" },
  { player: "Joe Root" },
  { player: "Kane Williamson" },
];

const Hierarchical_barChart = () => {
  // State to track the selected player
  const [selectedPlayer, setSelectedPlayer] = useState("All");

  // Reference to the chart container SVG
  const chartContainerRef = useRef(null);

  useEffect(() => {
    // Select the existing chart and remove any existing elements
    const existingChart = d3.select(chartContainerRef.current);
    existingChart.selectAll("*").remove();

    // Select the SVG element for rendering
    const svg = d3.select(chartContainerRef.current);

    // Define margins and dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 900 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    // Group data by player
    const groupedData = d3.group(cricketData, (d) => d.player);

    // Transform data into player-wise aggregated format
    const playersData = Array.from(groupedData, ([key, value]) => ({
      player: key,
      totalRuns: d3.sum(value, (d) => d.runs),
      years: Array.from(value, (d) => ({ year: d.year, runs: d.runs })),
    }));

    // Sort players by total runs
    playersData.sort((a, b) => b.totalRuns - a.totalRuns);

    // Custom color scale for players
    const colorScale = d3
      .scaleOrdinal()
      .domain(playersData.map((d) => d.player))
      .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"]);

    // Define X and Y scales
    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleBand().range([height, 0]).padding(0.1);

    // Set domain for X and Y scales
    xScale.domain([0, d3.max(playersData, (d) => d.totalRuns)]);
    yScale.domain(playersData.map((d) => d.player));

    // Filter data based on selected player
    const filteredData =
      selectedPlayer === "All"
        ? playersData
        : playersData.filter((d) => d.player === selectedPlayer);

    // Append SVG and apply margin
    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Append bars to the chart
    svg
      .selectAll(".bar")
      .data(filteredData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("width", (d) => xScale(d.totalRuns))
      .attr("height", yScale.bandwidth())
      .attr("y", (d) => yScale(d.player))
      .attr("fill", (d) => colorScale(d.player));

    // Append player labels to the chart
    svg
      .selectAll(".player-label")
      .data(filteredData)
      .enter()
      .append("text")
      .attr("class", "player-label")
      .attr("x", 0)
      .attr("y", (d) => yScale(d.player) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .style("fill", "white")
      .text((d) => `${d.player}: ${d.totalRuns} runs`);

    // Append X axis to the chart
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Append Y axis to the chart
    svg.append("g").call(d3.axisLeft(yScale));

    // Append X axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 30)
      .style("text-anchor", "middle")
      .attr("fill", "darkblue")
      // .text("Total Runs");

    // Append Y axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("x", -height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Players");

    // Cleanup function to remove existing chart elements
    return () => {
      existingChart.selectAll("*").remove();
    };
  }, [selectedPlayer]);

  // Event handler for player selection change
  const handlePlayerChange = (event) => {
    setSelectedPlayer(event.target.value);
  };

  return (
    <div>
      {/* Chart title */}
      <h3 className="align-items-center">
        Player Runs Based Comparison 2018-2022
      </h3>
      {/* Container for player selection and chart */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Player selection dropdown */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "darkblue" }}>Select Player: </label>
          <select value={selectedPlayer} onChange={handlePlayerChange}>
            <option value="All">All Players</option>
            {playersList.map((d) => (
              <option key={d.player} value={d.player}>
                {d.player}
              </option>
            ))}
          </select>
        </div>
        {/* SVG container for the chart */}
        <svg ref={chartContainerRef} width={600} height={400}></svg>
      </div>
    </div>
  );
};

export default Hierarchical_barChart;

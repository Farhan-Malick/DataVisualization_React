import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cricketData from "./CricketData";

const ChordDiagram = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    // Set width and height of SVG container
    const width = 600;
    const height = 600;

    // Create SVG element
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Transform cricket data into matrix
    const players = Array.from(new Set(cricketData.map((d) => d.player)));
    const years = Array.from(new Set(cricketData.map((d) => d.year)));
    const matrix = years.map(year => players.map(player => cricketData.find(d => d.year === year && d.player === player)?.runs || 0));

    // Set outer and inner radius for the chord diagram
    const outerRadius = Math.min(width, height) * 0.5 - 40;
    const innerRadius = outerRadius - 30;

    // Define chord layout
    const chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending);

    // Define arc generator
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    // Define ribbon generator
    const ribbon = d3.ribbon()
      .radius(innerRadius);

    // Define color scale
    const color = d3.scaleOrdinal()
      .domain(d3.range(players.length))
      .range(d3.schemeCategory10);

    // Compute chords layout
    const chords = chord(matrix);

    // Append arcs for each player
    svg.append("g")
      .selectAll("path")
      .data(chords.groups)
      .enter()
      .append("path")
      .attr("fill", d => color(d.index))
      .attr("d", arc)
      .append("title") // Add title for tooltip
      .text(d => `${players[d.index]}: ${d.value}`); // Display player and total runs on hover

    // Append ribbons for each pair of players
    svg.append("g")
      .attr("fill-opacity", 0.67)
      .selectAll("path")
      .data(chords)
      .enter()
      .append("path")
      .attr("d", ribbon)
      .attr("fill", d => color(d.target.index))
      .attr("stroke", d => d3.rgb(color(d.target.index)).darker())
      .append("title") // Add title for tooltip
      .text(d => `${players[d.source.index]} → ${players[d.target.index]}: ${d.source.value}`); // Display source and target player with runs transferred between them on hover

  }, []);

  return (
    // Container for SVG
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
      <h3
        style={{
          color: "black",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Players Comparison 2016-2020
      </h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ChordDiagram;

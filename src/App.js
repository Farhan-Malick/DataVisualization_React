import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import {
  Equalizer,
  BarChart,
  Timeline,
  PieChart as PieChartIcon,
} from "@mui/icons-material";

import "./App.css";
import Hierarchical_barChart from "./components/Hierarchical_barChart";
import Pie_Chart from "./components/Pie_Chart";
import Line_Chart from "./components/Line_Chart";
import Grouped_BarChart from "./components/Grouped_BarChart";
import ChordDiagram from "./components/ChordDiagram";
import HorizontalBarChart from "./components/HorizontalBarChart";

import Spinner from "./Spinner/index";

function App() {
  // State to manage loading spinner
  const [loading, setLoading] = useState(false);

  // Function to handle nav link click
  const handleNavLinkClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Navigation items
  const navbarItems = [
    { to: "/", text: "Hierarchical Bar Chart", icon: <Equalizer /> },
    { to: "/group-Bar_chart", text: "Grouped Bar Chart", icon: <BarChart /> },
    { to: "/line_chart", text: "Line Chart", icon: <Timeline /> },
    { to: "/pieChart", text: "Pie Chart", icon: <PieChartIcon /> },
    { to: "/chord_diagram", text: "Chord Diagram", icon: <PieChartIcon /> },
    { to: "/Horizontal-BarChart", text: "Horizontal Bar Chart", icon: <PieChartIcon /> },
  ];

  return (
    <Router>
      <div className="app-container">
        {/* App bar */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Visualizing Statistics of Cricket Players
            </Typography>
            <Box>
              {/* Navigation buttons */}
              {navbarItems.map((item, index) => (
                <Button
                  key={index}
                  component={NavLink}
                  to={item.to}
                  color="inherit"
                  activeClassName="active-link"
                  onClick={handleNavLinkClick}
                  startIcon={item.icon}
                  sx={{ textTransform: "none" }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </AppBar>

        <div className="main-content">
          {/* Conditional rendering of spinner */}
          {loading ? (
            <div className="loader-container">
              <Spinner loading={loading} color={"black"} />
              <div style={{ color: "black" }}>Loading Charts.</div>
            </div>
          ) : (
            <Routes>
              {navbarItems.map((item, index) => (
                <Route
                  key={index}
                  path={item.to}
                  element={
                    <div style={{ marginTop: "100px" }}>
                      <div className="chart">
                        {item.to === "/" && (
                          <Hierarchical_barChart player="All" />
                        )}
                        {item.to === "/group-Bar_chart" && <Grouped_BarChart />}
                        {item.to === "/line_chart" && <Line_Chart />}
                        {item.to === "/pieChart" && <Pie_Chart />}
                        {item.to === "/chord_diagram" && <ChordDiagram />}
                        {item.to === "/Horizontal-BarChart" && <HorizontalBarChart />}
                      </div>
                    </div>
                  }
                />
              ))}
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;

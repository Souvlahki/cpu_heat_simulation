import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { data } from "../utils/data";
import "../styles/sidebar.css";

export default function Sidebar({ setGrid }) {
  const [cpuUtilization, setCpuUtilization] = useState(45);
  const [selectedCpu, setSelectedCpu] = useState("Intel Core i9-14900K");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const popularCpus = data.slice();

  const getUtilizationClass = (percentage) => {
    if (percentage < 30) return "low";
    if (percentage < 60) return "moderate";
    if (percentage < 80) return "high";
    return "critical";
  };

  const getUtilizationLabel = (percentage) => {
    if (percentage < 30) return "Low";
    if (percentage < 60) return "Moderate";
    if (percentage < 80) return "High";
    return "Critical";
  };

  const startSimulation = () => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/simulation");

    console.log("starting simulation");
    console.log("Sending simulation request with:", {
      cpu_util: cpuUtilization,
      cpu_name: selectedCpu,
    });
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          cpu_util: cpuUtilization,
          cpu_name: selectedCpu,
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Grid update:", data.grid);
      console.log("average temp:" ,data.average_temp)
      setGrid(data.grid);
    };

    socket.onclose = () => {
      console.log("Simulation completed");
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  };

  return (
    <aside className="sidebar">
      {/* CPU Selection Dropdown */}
      <div className="dropdown-section">
        <label className="section-label">Processor</label>
        <div className="dropdown-container">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="dropdown-button"
          >
            <span className="dropdown-text">{selectedCpu}</span>
            <ChevronDown
              className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              {popularCpus.map((cpu) => (
                <button
                  key={cpu}
                  onClick={() => {
                    setSelectedCpu(cpu);
                    setIsDropdownOpen(false);
                  }}
                  className={`dropdown-item ${
                    selectedCpu === cpu ? "selected" : ""
                  }`}
                >
                  {cpu}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CPU Utilization Slider */}
      <div className="utilization-section">
        <div className="utilization-header">
          <label className="section-label">CPU Utilization</label>
          <div className="utilization-info">
            <span
              className={`status-badge ${getUtilizationClass(cpuUtilization)}`}
            >
              {getUtilizationLabel(cpuUtilization)}
            </span>
            <span className="percentage">{cpuUtilization}%</span>
          </div>
        </div>

        {/* Custom Slider */}
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={cpuUtilization}
            onChange={(e) => setCpuUtilization(parseInt(e.target.value))}
            className={`slider ${getUtilizationClass(cpuUtilization)}`}
          />
        </div>
      </div>

      {/*simulation button  */}
      <div>
        <button onClick={startSimulation}>simulate</button>
      </div>
    </aside>
  );
}

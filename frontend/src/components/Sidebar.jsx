import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { data } from "../utils/data";
import "../styles/sidebar.css";

export default function Sidebar({
  setGrid,
  setInterpAverageTemp,
  setTotalPower,
  setOptimizedCooling,
  setAverageTemp,
  setIsShown,
  setTime,
  setIsLoading,
  setTimeStep,
  isShown,
}) {
  const [cpuUtilization, setCpuUtilization] = useState(8);
  const [selectedCpu, setSelectedCpu] = useState("Intel Core i9-14900K");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [coolingRate, setCoolingRate] = useState(0.01);
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
          cooling_rate: coolingRate,
        })
      );

      setAverageTemp(null);
      setInterpAverageTemp(null);
      setTotalPower(null);
      setOptimizedCooling(null);
      setGrid(null);
      setTime(null);
      setTimeStep(null);
      setIsLoading(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.grid) {
        setGrid(data.grid);
      }

      if (data.average_temp) {
        setAverageTemp(data.average_temp);
      }

      if (data.interp_average) {
        setInterpAverageTemp(data.interp_average);
        setIsShown(true);
        setIsLoading(false);
      }

      if (data.total_power) {
        setTotalPower(data.total_power);
      }

      if (data.optimized_cooling_rate) {
        setOptimizedCooling(data.optimized_cooling_rate);
      }

      if (data.time) {
        setTime(data.time);
      }

      if (data.time_step) {
        setTimeStep(data.time_step + 1);
      }
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

      {/* CPU Utilization section */}
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

        {/* Cpu utilization slider */}
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

      {/* Cooling Rate section */}
      <div className="utilization-seciton">
        <div className="utilization-header">
          <label className="section-label">Cooling Rate</label>
          <div className="utilization-info">
            <span className="percentage">{coolingRate.toFixed(3)}</span>
          </div>
        </div>

        <div className="slider-container">
          <input
            type="range"
            min="0.001"
            max="0.1"
            step="0.001"
            value={coolingRate}
            onChange={(e) => setCoolingRate(parseFloat(e.target.value))}
            className={`slider ${getUtilizationClass(cpuUtilization)}`}
          />
        </div>
      </div>

      {/*simulation button  */}
      <div className="simulate-btn-container">
        <button onClick={startSimulation} className="simulate-btn">
          simulate
        </button>
      </div>

      <div className="show-chart-container">
        <label htmlFor="panelCheck">Show Chart</label>
        <input
          type="checkbox"
          name="panelCheck"
          id="panelCheck"
          checked={isShown}
          onChange={() => setIsShown(!isShown)}
        />
      </div>
    </aside>
  );
}

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "../styles/sidebar.css";

export default function Sidebar() {
  const [cpuUtilization, setCpuUtilization] = useState(45);
  const [selectedCpu, setSelectedCpu] = useState("Intel Core i7-13700K");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const popularCpus = [
    "Intel Core i9-14900K",
    "Intel Core i7-13700K",
    "Intel Core i5-13600K",
    "AMD Ryzen 9 7950X",
    "AMD Ryzen 7 7700X",
    "AMD Ryzen 5 7600X",
    "Apple M3 Pro",
    "Apple M3 Max",
    "Intel Core i9-13900H",
    "AMD Ryzen 9 7940HS",
  ];

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
    </aside>
  );
}

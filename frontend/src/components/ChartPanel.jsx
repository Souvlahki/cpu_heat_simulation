import Plot from "react-plotly.js";
import "../styles/chartPanel.css";

export default function ChartPanel({
  interpAverageTemp,
  totalPower,
  optimizedCoolingRate,
  isShown,
}) {
  console.log("ChartPanel props", {
    interpAverageTemp,
    totalPower,
    optimizedCoolingRate,
    isShown,
  });

  if (!isShown) return null;
  if (!interpAverageTemp) return null;

  const x = interpAverageTemp.map((_, i) => i);
  const y = interpAverageTemp.map((t) => parseFloat(t));

  return (
    <div className="chart-panel">
      <h3 className="chart-title">Interpolated CPU Temperature</h3>

      <Plot
        data={[
          {
            x,
            y,
            type: "scatter",
            mode: "lines+markers",
            line: { color: "#82ca9d", width: 3 },
            marker: { size: 4 },
            name: "Temperature (°C)",
          },
        ]}
        layout={{
          paper_bgcolor: "#1e1e2f",
          plot_bgcolor: "#2a2a3d",
          font: { color: "#ffffff" },
          xaxis: { title: "Time Step" },
          yaxis: { title: "Temperature (°C)" },
          margin: { l: 60, r: 30, t: 30, b: 50 },
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "400px" }}
      />

      <div className="summary-section">
        <h4>Simulation Summary</h4>
        <p>
          <strong>Total Power:</strong>{" "}
          {totalPower !== undefined ? totalPower.toFixed(2) + " W" : "N/A"}
        </p>
        {optimizedCoolingRate !== undefined ? (
          <p>
            <strong>Optimized Cooling Rate:</strong>{" "}
            {optimizedCoolingRate.toFixed(4)}
          </p>
        ) : (
          <p className="optimization-note">
            No optimization needed — cooling rate was sufficient.
          </p>
        )}
      </div>
    </div>
  );
}

import Chart from "./Chart";
import "../styles/chartPanel.css";

export default function ChartPanel({
  interpAverageTemp,
  totalPower,
  optimizedCoolingRate,
  averageTemp,
  timeStep,
  time,
  isShown,
  isLoading,
}) {
  if (!isShown) return null;

  let x, y;

  if (interpAverageTemp) {
    x = time;
    y = interpAverageTemp.map((t) => parseFloat(t));
  }

  return (
    <div className="chart-panel">
      <h3 className="chart-title">Interpolated CPU Temperature</h3>

      <div className="chart-container">
        {isLoading ? <p>Loading chart...</p> : <Chart x={x} y={y} />}
      </div>

      <div className="summary-section">
        <p className="temp-values">
          <strong>Average temprature:</strong>{" "}
          {averageTemp && averageTemp.toFixed(2)} (C)
          <strong>Time:</strong> {timeStep && timeStep} (s)
        </p>
      </div>
      
      <div className="summary-section">
        <h4>Simulation Summary</h4>
        <p>
          <strong>Total Power:</strong>{" "}
          {totalPower ? totalPower.toFixed(2) + " W" : "N/A"}
        </p>

        {optimizedCoolingRate === "loading" && (
          <p className="optimization-note">
            Heat is too critical calculating the optimzed cooling rate for the
            simulation..
          </p>
        )}

        {!optimizedCoolingRate && (
          <p className="optimization-note">
            No optimization needed — cooling rate was sufficient.
          </p>
        )}

        {optimizedCoolingRate !== "loading" && optimizedCoolingRate && (
          <p>
            <strong>Optimized Cooling Rate:</strong>{" "}
            {optimizedCoolingRate.toFixed(3)}
          </p>
        )}
      </div>
    </div>
  );
}

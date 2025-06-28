import Plot from "react-plotly.js";

export default function Chart({ x, y }) {
  return (
    <Plot
      data={[
        {
          x,
          y,
          type: "scatter",
          mode: "lines+markers",
          line: { color: "#82ca9d", width: 4 },
          marker: { size: 1 },
          name: "Temperature (°C)",
        },
      ]}
      layout={{
        paper_bgcolor: "#1e1e2f",
        plot_bgcolor: "#2a2a3d",
        font: { color: "#ffffff" },
        margin: { l: 60, r: 30, t: 30, b: 70 },
        xaxis: {
          title: { text: "Time Step", font: { color: "#ffffff" } },
          tickfont: { color: "#ffffff" },
          showgrid: true,
          gridcolor: "#444",
          zeroline: false,
        },
        yaxis: {
          title: { text: "Temperature (°C)", font: { color: "#ffffff" } },
          tickfont: { color: "#ffffff" },
          showgrid: true,
          gridcolor: "#444",
          zeroline: false,
        },
      }}
      config={{ responsive: true }}
      style={{ width: "100%", height: "400px" }}
    />
  );
}

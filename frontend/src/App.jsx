import Sidebar from "./components/Sidebar";
import CpuCanvas from "./components/CpuCanvas";
import "./styles/app.css";
import { useState } from "react";
import ChartPanel from "./components/ChartPanel";

export default function App() {
  const [grid, setGrid] = useState();
  const [interpAverageTemp, setInterpAverageTemp] = useState();
  const [interpPowerHistory, setInterpPowerHistory] = useState();
  const [totalPower, setTotalPower] = useState();

  const [isShown, setIsShown] = useState(false);

  return (
    <div className="app-wrapper">
      <Sidebar
        setGrid={setGrid}
        setTotalPower={setTotalPower}
        setInterpAverageTemp={setInterpAverageTemp}
        setInterpPowerHistory={setInterpPowerHistory}
        isShown={isShown}
        setIsShown={setIsShown}
      />
      <CpuCanvas grid={grid} />
      <ChartPanel
        interpAverageTemp={interpAverageTemp}
        totalPower={totalPower}
        interpPowerHistory={interpPowerHistory}
        isShown={isShown}
      />
    </div>
  );
}

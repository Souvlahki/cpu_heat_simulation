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
  const [optimizedCooling, setOptimizedCooling] = useState();
  const [timeStep, setTimeStep] = useState();
  const [averageTemp, setAverageTemp] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState();

  const [isShown, setIsShown] = useState(false);

  return (
    <div className="app-wrapper">
      <Sidebar
        setGrid={setGrid}
        setTotalPower={setTotalPower}
        setAverageTemp={setAverageTemp}
        setInterpAverageTemp={setInterpAverageTemp}
        setInterpPowerHistory={setInterpPowerHistory}
        setTimeStep={setTimeStep}
        setOptimizedCooling={setOptimizedCooling}
        setTime={setTime}
        isShown={isShown}
        setIsShown={setIsShown}
        setIsLoading={setIsLoading}
      />
      <CpuCanvas grid={grid} />
      <ChartPanel
        interpAverageTemp={interpAverageTemp}
        totalPower={totalPower}
        interpPowerHistory={interpPowerHistory}
        isShown={isShown}
        optimizedCoolingRate={optimizedCooling}
        isLoading={isLoading}
        time={time}
        timeStep={timeStep}
        averageTemp={averageTemp}
      />
    </div>
  );
}

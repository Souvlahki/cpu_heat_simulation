import Sidebar from "./components/Sidebar";
import CpuCanvas from "./components/CpuCanvas";
import "./styles/app.css";
import { useState } from "react";
export default function App() {
  const [grid, setGrid] = useState();

  return (
    <div className="app-wrapper">
      <Sidebar setGrid={setGrid} />
      <CpuCanvas grid={grid} />
    </div>
  );
}

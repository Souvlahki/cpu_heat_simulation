import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Cpu from "./components/Cpu";
import Sidebar from "./components/Sidebar";
import "./styles/app.css";

export default function App() {
  return (
    <div className="app-wrapper">
      <Sidebar />
      <Canvas camera={{ position: [0, 1, 5], fov: 60 }} shadows>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[0, -3, 0]} intensity={100} color="white" />
        <pointLight position={[0, 2, 0]} intensity={100} color="white" />
        <Cpu />
        <OrbitControls />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}

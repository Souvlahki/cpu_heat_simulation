import { Canvas } from "@react-three/fiber";
import Cpu from "./Cpu";
import { OrbitControls, Environment } from "@react-three/drei";

export default function CpuCanvas({ grid }) {
  return (
    <Canvas camera={{ position: [0, 1, 5], fov: 60 }} shadows>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <Cpu grid={grid} />
      <OrbitControls />
      <Environment preset="sunset" />
    </Canvas>
  );
}

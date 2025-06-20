import { useGLTF,Center } from "@react-three/drei";

export default function Cpu(props) {
  const gltf = useGLTF("../models/pc_cpu_processor/scene.gltf"); // or .gltf

  return (
    <Center>
      <primitive object={gltf.scene} {...props} />
    </Center>
  );
}

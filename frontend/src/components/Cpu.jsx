import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function createTemperatureLookup(grid) {
  const resolution = grid.length;
  return (x, y, z) => {
    const gx = Math.floor(x + resolution / 2);
    const gy = Math.floor(y + resolution / 2);
    const gz = Math.floor(z + resolution / 2);

    if (
      gx >= 0 &&
      gx < resolution &&
      gy >= 0 &&
      gy < resolution &&
      gz >= 0 &&
      gz < resolution
    ) {
      return grid[gx][gy][gz];
    }
    return 20; // default ambient temp
  };
}


export default function Cpu({ grid }) {
  const gltf = useGLTF("/models/pc_cpu_processor/scene.gltf");
  const cpuRef = useRef();

  useEffect(() => {
    if (!grid || !cpuRef.current) return;

    const resolution = grid.length;
    const getTemp = createTemperatureLookup(grid);

    cpuRef.current.traverse((child) => {
      if (child.isMesh) {
        const geometry = child.geometry.clone(); // clone to avoid modifying original
        const pos = geometry.attributes.position;
        const colorAttr = new Float32Array(pos.count * 3);
        const color = new THREE.Color();

        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const z = pos.getZ(i);

          const temp = getTemp(x, y, z);
          const tNorm = Math.min(Math.max((temp - 20) / 60, 0), 1);
          color.setHSL((1 - tNorm) * 0.7, 1, 0.5);

          colorAttr[i * 3] = color.r;
          colorAttr[i * 3 + 1] = color.g;
          colorAttr[i * 3 + 2] = color.b;
        }

        geometry.setAttribute("color", new THREE.BufferAttribute(colorAttr, 3));
        child.geometry = geometry;
        child.material.vertexColors = true;
        child.material.needsUpdate = true;
      }
    });
  }, [grid]);

  return <primitive object={gltf.scene} ref={cpuRef} />;
}

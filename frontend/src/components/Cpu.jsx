import { useGLTF, Html } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Lut } from "three/examples/jsm/math/Lut";

const DEFAULT_BOUNDS = {
  min: [-1.5683, -1.5468, -0.256],
  max: [1.6156, 1.6156, -0.025],
};

// Color Legend Component
function ColorLegend({ lut, position = [-4, 2, 0] }) {
  const legendSteps = 10;
  const minTemp = lut.minV;
  const maxTemp = lut.maxV;
  const stepSize = (maxTemp - minTemp) / (legendSteps - 1);

  const legendItems = [];
  for (let i = 0; i < legendSteps; i++) {
    const temp = minTemp + i * stepSize;
    const color = lut.getColor(temp);
    const colorHex = `#${color.getHexString()}`;

    legendItems.push({
      temp: Math.round(temp),
      color: colorHex,
    });
  }

  return (
    <Html position={position} transform>
      <div
        style={{
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
          padding: "12px",
          borderRadius: "8px",
          color: "white",
          fontFamily: "monospace",
          fontSize: "12px",
          minWidth: "100px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div
          style={{
            marginBottom: "8px",
            fontWeight: "bold",
            textAlign: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
            paddingBottom: "4px",
          }}
        >
          Temperature (°C)
        </div>

        {/* Gradient Bar */}
        <div
          style={{
            height: "150px",
            width: "15px",
            margin: "0 auto 8px",
            background: `linear-gradient(to top, ${legendItems
              .map((item) => item.color)
              .join(", ")})`,
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "3px",
          }}
        />
      </div>
    </Html>
  );
}

export default function Cpu({
  grid,
  minTemp = 30,
  maxTemp = 80,
  bounds = DEFAULT_BOUNDS,
  dimensions = [20, 20, 40],
  showLegend = true,
}) {
  const gltf = useGLTF("/models/pc_cpu_processor/scene.gltf");
  const lut = useMemo(() => {
    const newLut = new Lut("rainbow", 512);
    newLut.setMin(minTemp);
    newLut.setMax(maxTemp);
    return newLut;
  }, [minTemp, maxTemp]);

  useEffect(() => {
    if (!grid || !gltf.scene) return;

    const [nx, ny, nz] = dimensions;
    const [xmin, ymin, zmin] = bounds.min;
    const [xmax, ymax, zmax] = bounds.max;
    const dx = xmax - xmin;
    const dy = ymax - ymin;
    const dz = zmax - zmin;

    gltf.scene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        const geometry = child.geometry;
        const posAttr = geometry.attributes.position;
        const colors = new Float32Array(posAttr.count * 3);

        for (let i = 0; i < posAttr.count; i++) {
          const x = posAttr.getX(i);
          const y = posAttr.getY(i);
          const z = posAttr.getZ(i);

          const normalizedX = (x - xmin) / dx;
          const normalizedY = (y - ymin) / dy;
          const normalizedZ = (z - zmin) / dz;

          const gx = Math.floor(normalizedX * (nx - 1));
          const gy = Math.floor(normalizedY * (ny - 1));
          const gz = Math.floor(normalizedZ * (nz - 1)) - 30;

          const cx = Math.max(0, Math.min(nx - 1, gx));
          const cy = Math.max(0, Math.min(ny - 1, gy));
          const cz = Math.max(0, Math.min(nz - 1, gz));

          const temp = grid[cx][cy][cz];
          const color =
            lut.getColor(temp)?.convertSRGBToLinear() ??
            new THREE.Color(0, 0, 0);

          color.toArray(colors, i * 3);
        }

        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        child.material.vertexColors = true;
        child.material.needsUpdate = true;
      }
    });
  }, [grid, gltf.scene, lut, dimensions, bounds]);

  return (
    <>
      <primitive object={gltf.scene} />
      {showLegend && <ColorLegend lut={lut} />}
    </>
  );
}

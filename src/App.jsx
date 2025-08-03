import React, { useState, useRef } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { SketchPicker } from "react-color";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

function Beanie({ color }) {
  return (
    <mesh position={[0, 1.45, 0]} rotation={[0.3, 0, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Fedora({ color }) {
  return (
    <>
      <mesh position={[0, 1.5, 0]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.5, 0.7, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </>
  );
}

function Bucket({ color }) {
  return (
    <>
      <mesh position={[0, 1.5, 0]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 0.4, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </>
  );
}

export default function CustomHatDesigner() {
  const [hatColor, setHatColor] = useState("#d48fa7");
  const [hatText, setHatText] = useState("");
  const [hatMaterial, setHatMaterial] = useState("");
  const [hatStyle, setHatStyle] = useState("");
  const [generatedHat, setGeneratedHat] = useState(null);
  const previewRef = useRef(null);

  const handleGenerate = () => {
    const newHat = {
      color: hatColor,
      text: hatText,
      material: hatMaterial,
      style: hatStyle,
    };
    setGeneratedHat(newHat);
  };

  const handleExport = async () => {
    if (previewRef.current) {
      const canvas = await html2canvas(previewRef.current);
      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, "custom_hat.png");
      });
    }
  };

  const renderHatModel = () => {
    if (!generatedHat) return null;
    switch (generatedHat.style.toLowerCase()) {
      case "fedora":
        return <Fedora color={generatedHat.color} />;
      case "bucket":
        return <Bucket color={generatedHat.color} />;
      case "beanie":
      default:
        return <Beanie color={generatedHat.color} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">Custom Hat Generator (3D)</h1>

      <Card className="w-full max-w-6xl p-4">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Customize Your Hat</h2>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Choose Hat Color:</label>
              <SketchPicker
                color={hatColor}
                onChangeComplete={(color) => setHatColor(color.hex)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Material:</label>
              <Input
                placeholder="e.g. wool, cotton, acrylic"
                value={hatMaterial}
                onChange={(e) => setHatMaterial(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Style:</label>
              <Input
                placeholder="e.g. beanie, fedora, bucket"
                value={hatStyle}
                onChange={(e) => setHatStyle(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Text:</label>
              <Input
                placeholder="e.g. Doggo Vibes"
                value={hatText}
                onChange={(e) => setHatText(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={handleGenerate}>Generate Hat</Button>
              <Button variant="outline" onClick={handleExport}>Export Image</Button>
            </div>
          </div>

          <div ref={previewRef} className="relative w-full h-[400px] rounded-xl overflow-hidden shadow bg-white">
            <Canvas camera={{ position: [0, 1.6, 3] }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} />
              <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
              {renderHatModel()}
            </Canvas>
            <img
              src="/dog_hat_base.png"
              alt="Dog with Hat"
              className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
            />
            {generatedHat?.text && (
              <div className="absolute bottom-4 left-4 text-white text-lg font-bold drop-shadow">
                {generatedHat.text}
              </div>
            )}
            {generatedHat?.material && (
              <div className="absolute bottom-4 right-4 text-sm text-white font-medium drop-shadow text-right">
                {generatedHat.material} - {generatedHat.style}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
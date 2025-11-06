"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import { useState } from "react";

type Appliance = {
  name: string;
  power: number;
  active: boolean;
};

type RoomData = {
  appliances: Appliance[];
  color: string;
};

function HouseModel({
  selectedRoom,
  roomData,
  totalConsumption,
  onDeviceToggle,
  onClose,
}: {
  selectedRoom: string;
  roomData: RoomData;
  totalConsumption: number;
  onDeviceToggle: (room: string, index: number) => void;
  onClose: () => void;
}) {
  const { scene } = useGLTF("/models/t12_-_habitacao_sustentavel.glb");

  return (
    <>
      {/* Casa em 3D */}
      <primitive object={scene} scale={0.8} position={[0, -1, 0]} />

      {/* Painel 3D */}
      <Html position={[30, 18, 0]} transform occlude>
        <div className="bg-black/90 backdrop-blur-sm border border-gray-600 rounded-lg p-6 text-white min-w-[380px] shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold capitalize">🏠 {selectedRoom}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Consumo */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">⚡ Consumo Atual:</span>
              <span
                className="text-2xl font-bold"
                style={{ color: roomData.color }}
              >
                {totalConsumption.toFixed(2)} kW
              </span>
            </div>

            {/* Dispositivos */}
            <div className="border-t border-gray-600 pt-4">
              <h4 className="text-lg font-semibold mb-3">
                🎛️ Controle de Dispositivos:
              </h4>
              <div className="space-y-3">
                {roomData.appliances.map((appliance, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          appliance.active ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <div>
                        <span className="text-sm font-medium">
                          {appliance.name}
                        </span>
                        <div className="text-xs text-gray-400">
                          {appliance.power} kW
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeviceToggle(selectedRoom, index)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        appliance.active
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      {appliance.active ? "LIGADO" : "DESLIGADO"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custos */}
            <div className="border-t border-gray-600 pt-4">
              <div className="text-sm text-gray-300">
                <div>
                  💰 Custo por hora: R$ {(totalConsumption * 0.65).toFixed(2)}
                </div>
                <div>
                  📊 Custo diário: R$ {(totalConsumption * 0.65 * 24).toFixed(2)}
                </div>
                <div>
                  📈 Custo mensal: R${" "}
                  {(totalConsumption * 0.65 * 24 * 30).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Html>
    </>
  );
}

export default function House3D() {
  const [selectedRoom, setSelectedRoom] = useState("Sala");

  // Exemplo de dados dos dispositivos
  const [roomData, setRoomData] = useState<RoomData>({
    appliances: [
      { name: "Luz", power: 0.06, active: false },
      { name: "TV", power: 0.15, active: false },
      { name: "Ar-condicionado", power: 1.5, active: false },
    ],
    color: "yellow",
  });

  const totalConsumption = roomData.appliances
    .filter((a) => a.active)
    .reduce((sum, a) => sum + a.power, 0);

  const onDeviceToggle = (room: string, index: number) => {
    setRoomData((prev) => {
      const updated = [...prev.appliances];
      updated[index].active = !updated[index].active;
      return { ...prev, appliances: updated };
    });
  };

  const onClose = () => {
    alert("Painel fechado!");
  };

  return (
    <div className="w-full h-[80vh] rounded-lg overflow-hidden shadow-lg">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} />
        <HouseModel
          selectedRoom={selectedRoom}
          roomData={roomData}
          totalConsumption={totalConsumption}
          onDeviceToggle={onDeviceToggle}
          onClose={onClose}
        />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

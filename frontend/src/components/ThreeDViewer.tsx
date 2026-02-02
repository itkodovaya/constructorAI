import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PresentationControls, Float, MeshDistortMaterial } from '@react-three/drei';

export const ThreeDViewer: React.FC<{ modelType?: string }> = ({ modelType }) => {
  return (
    <div className="w-full h-[400px] bg-slate-50 rounded-[40px] overflow-hidden border border-slate-100 relative group">
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100">
          Interactive 3D View
        </div>
      </div>
      
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
        <Suspense fallback={null}>
          <PresentationControls speed={1.5} global zoom={0.7} polar={[-0.1, Math.PI / 4]}>
            <Stage environment="city" intensity={0.6} contactShadow={false}>
              <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                {/* Заглушка модели - если нет загруженной, рисуем абстрактную фигуру */}
                <mesh castShadow receiveShadow>
                  <sphereGeometry args={[1, 64, 64]} />
                  <MeshDistortMaterial
                    color="#6366f1"
                    speed={2}
                    distort={0.4}
                    radius={1}
                  />
                </mesh>
              </Float>
            </Stage>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]} receiveShadow>
              <planeGeometry args={[10, 10]} />
              <shadowMaterial transparent opacity={0.2} />
            </mesh>
          </PresentationControls>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-6 inset-x-6 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="bg-white px-4 py-2 rounded-xl text-[10px] font-bold shadow-sm border border-slate-100">AR View</button>
        <button className="bg-white px-4 py-2 rounded-xl text-[10px] font-bold shadow-sm border border-slate-100">Fullscreen</button>
      </div>
    </div>
  );
};


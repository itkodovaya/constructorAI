import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreeDShowcaseProps {
  title: string;
  modelUrl?: string;
  backgroundColor?: string;
  cameraPosition?: [number, number, number];
  autoRotate?: boolean;
}

export const ThreeDShowcase: React.FC<ThreeDShowcaseProps> = ({
  title,
  modelUrl,
  backgroundColor = '#f0f0f0',
  cameraPosition = [0, 0, 5],
  autoRotate = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Three.js implementation - uncomment when three.js is installed
    /*
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(...cameraPosition);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Default geometry (cube)
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x6366f1 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Animation
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      if (autoRotate) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    */
  }, [backgroundColor, cameraPosition, autoRotate]);

  return (
    <div className="w-full py-20">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-slate-900">{title}</h2>
      </div>
      <div ref={mountRef} className="w-full h-96 rounded-2xl overflow-hidden" />
    </div>
  );
};


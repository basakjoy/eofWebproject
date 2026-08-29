'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Candlestick3DUptrend() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 700;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 22);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    // Limit pixel ratio for better performance while keeping edges smooth
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    // 2. Lighting (Softened for a more pleasing, premium gradient)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Softened ambient
    scene.add(ambientLight);

    const fieryOrangeLight = new THREE.PointLight(0xff6b00, 4, 45); // Slightly wider reach
    fieryOrangeLight.position.set(-8, 10, 8);
    scene.add(fieryOrangeLight);

    const amberGoldLight = new THREE.PointLight(0xffb800, 3.5, 40);
    amberGoldLight.position.set(8, 12, 8);
    scene.add(amberGoldLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 18, 12);
    scene.add(dirLight);

    // 3. Candlesticks Group
    const candlesGroup = new THREE.Group();
    const candles: { 
      mesh: THREE.Mesh; 
      wick: THREE.Mesh; 
      baseY: number; 
    }[] = [];

    const candleCount = 14;
    const spacing = 1.6;
    const startX = -((candleCount - 1) * spacing) / 2;

    // Theme Color Materials - Adjusted roughness/metalness for softer reflections
    const fieryOrangeMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b00,
      emissive: 0xff3d00,
      emissiveIntensity: 0.35, // Softer glow
      roughness: 0.2,
      metalness: 0.65,
    });

    const amberGoldMaterial = new THREE.MeshStandardMaterial({
      color: 0xffb800,
      emissive: 0xff6b00,
      emissiveIntensity: 0.3,
      roughness: 0.25,
      metalness: 0.7,
    });

    const fieryRedMaterial = new THREE.MeshStandardMaterial({
      color: 0xff3d00,
      emissive: 0x880000,
      emissiveIntensity: 0.2,
      roughness: 0.35,
      metalness: 0.5,
    });

    const wickMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff8c33, // Slightly brighter wick for contrast
      opacity: 0.6, 
      transparent: true 
    });

    for (let i = 0; i < candleCount; i++) {
      let mat = fieryOrangeMaterial;
      if (i % 3 === 0) mat = amberGoldMaterial;
      if (i === 3 || i === 8) mat = fieryRedMaterial;

      const isDip = i === 3 || i === 8;
      const baseY = i * 0.65 + (isDip ? -0.4 : 0.4);
      const initialHeight = 1.4 + Math.random() * 1.8;

      // Candle Body
      const bodyGeo = new THREE.BoxGeometry(0.8, initialHeight, 0.8);
      const candleMesh = new THREE.Mesh(bodyGeo, mat);
      candleMesh.position.set(startX + i * spacing, baseY, 0);

      // Candle Wick
      const wickGeo = new THREE.CylinderGeometry(0.04, 0.04, initialHeight + 2.0, 8);
      const wickMesh = new THREE.Mesh(wickGeo, wickMaterial);
      wickMesh.position.set(startX + i * spacing, baseY, 0);

      candlesGroup.add(wickMesh);
      candlesGroup.add(candleMesh);

      candles.push({
        mesh: candleMesh,
        wick: wickMesh,
        baseY,
      });
    }

    // Set initial position
    candlesGroup.position.set(0, -2, -2);
    candlesGroup.rotation.x = 0.15;
    scene.add(candlesGroup);

    // 4. Floating Fiery Spark Particles
    const particleCount = 90;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleOffsets = new Float32Array(particleCount); // For organic horizontal drift

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 26; // x
      particlePositions[i + 1] = (Math.random() * 16) - 2; // y (start slightly below)
      particlePositions[i + 2] = (Math.random() - 0.5) * 12; // z
      particleOffsets[i / 3] = Math.random() * 100; // random phase offset
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('offset', new THREE.BufferAttribute(particleOffsets, 1));
    
    const particleMat = new THREE.PointsMaterial({
      color: 0xff8c33, // Softer orange for sparks
      size: 0.15,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending, // Makes particles glow beautifully when they overlap
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow, elegant background rotation & gentle floating
      candlesGroup.rotation.y = Math.sin(elapsedTime * 0.25) * 0.08;
      candlesGroup.position.y = -2 + Math.sin(elapsedTime * 0.5) * 0.25;

      // Smooth Candle Pulsing (Lowered frequency and amplitude for elegance)
      candles.forEach((candle, idx) => {
        // Multipliers reduced (1.5 instead of 2.5, 0.12 amplitude instead of 0.25)
        const pulse = Math.sin(elapsedTime * 1.5 + idx * 0.4) * 0.12 + 1;
        candle.mesh.scale.y = pulse;
        candle.wick.scale.y = pulse * 1.05;
      });

      // Float Particles Upward with Organic Drift
      const positions = particleGeo.attributes.position.array as Float32Array;
      const offsets = particleGeo.attributes.offset.array as Float32Array;

      for (let i = 0; i < particleCount * 3; i += 3) {
        const offset = offsets[i / 3];
        
        // Gentle Y upward movement
        positions[i + 1] += 0.015; 
        
        // Organic X-axis drift using sine wave based on time and individual offset
        positions[i] += Math.sin(elapsedTime * 0.8 + offset) * 0.004;

        // Smoothly loop particles back to bottom
        if (positions[i + 1] > 14) {
          positions[i + 1] = -2;
          positions[i] = (Math.random() - 0.5) * 26; // Pick a new X spot
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Cleanup geometries and materials to prevent memory leaks
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-45" />
  );
}
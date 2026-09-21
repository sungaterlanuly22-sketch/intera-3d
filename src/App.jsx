import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const AbstractShape = () => {
  const groupRef = useRef();
  const fragmentsRef = useRef([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.5 + t * 0.1, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.mouse.y * 0.5, 0.05);
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      fragmentsRef.current.forEach((mesh, i) => {
        gsap.set(mesh.position, { x: (Math.random() - 0.5) * 20, y: (Math.random() - 0.5) * 20, z: (Math.random() - 0.5) * 20 });
        const targetPos = getSpherePosition(i, 50);
        gsap.to(mesh.position, { x: targetPos.x, y: targetPos.y, z: targetPos.z, duration: 2, ease: 'power3.out', delay: i * 0.01 });
      });

      gsap.to(groupRef.current.scale, {
        x: 2.5, y: 2.5, z: 2.5,
        scrollTrigger: { trigger: '#hero-section', start: 'top top', end: 'bottom top', scrub: 1 },
      });

      fragmentsRef.current.forEach((mesh) => {
        gsap.to(mesh.position, {
          x: mesh.position.x * 3, y: mesh.position.y * 3, z: mesh.position.z * 3,
          scrollTrigger: { trigger: '#hero-section', start: 'top top', end: 'bottom top', scrub: 1 },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  const getSpherePosition = (i, total) => {
    const phi = Math.acos(-1 + (2 * i) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;
    return new THREE.Vector3(2 * Math.cos(theta) * Math.sin(phi), 2 * Math.sin(theta) * Math.sin(phi), 2 * Math.cos(phi));
  };

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {[...Array(50)].map((_, i) => (
          <mesh key={i} ref={(el) => (fragmentsRef.current[i] = el)} castShadow receiveShadow>
            <icosahedronGeometry args={[0.3, 0]} />
            <meshPhysicalMaterial color="#4338ca" emissive="#3730a3" emissiveIntensity={0.5} roughness={0.1} metalness={0.8} clearcoat={1} />
          </mesh>
        ))}
      </Float>
    </group>
  );
};

export default function HeroSection() {
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { delay: 1.5, duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } },
  };

  const letters = "INTERA".split("");

  return (
    <div className="relative bg-slate-950 text-white selection:bg-indigo-500/30 font-sans">
      <section id="hero-section" className="relative h-[150vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-between px-12 lg:px-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 -z-10" />
          <div className="relative z-10 w-full max-w-xl">
            
            {/* 3D Контейнер для текста */}
            <div className="mb-12" style={{ perspective: "1000px" }}>
              <h1 className="text-7xl md:text-8xl font-extrabold tracking-widest uppercase flex">
                {letters.map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, rotateX: -90, y: 50, z: -100 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0, z: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 1.2, type: "spring", bounce: 0.4 }}
                    whileHover={{ scale: 1.15, rotateY: 20, rotateX: -15, z: 30, color: "#fff" }}
                    className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-cyan-400 cursor-pointer inline-block transform-gpu origin-bottom pb-2"
                  >
                    {letter}
                  </motion.span>
                ))}
              </h1>
            </div>

            <motion.div initial="hidden" animate="visible" variants={formVariants} className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(79,70,229,0.15)] relative overflow-hidden">
              <h3 className="text-xl font-semibold mb-6">Начать проект</h3>
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Ваше Имя" className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                <input type="tel" placeholder="Номер WhatsApp" className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-2 group relative w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                  <span className="relative z-10">Отправить конфигурацию</span>
                </motion.button>
              </form>
            </motion.div>
          </div>
          <div className="absolute inset-0 lg:static lg:w-1/2 h-full z-0 pointer-events-none lg:pointer-events-auto opacity-40 lg:opacity-100">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <AbstractShape />
              <Environment preset="city" />
              <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2} far={4} />
            </Canvas>
          </div>
        </div>
      </section>
      <section className="h-screen bg-slate-950 flex items-center justify-center relative z-20">
        <h2 className="text-4xl font-bold text-slate-300">Следующий блок (Конфигуратор)</h2>
      </section>
    </div>
  );
}

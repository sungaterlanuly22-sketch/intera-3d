import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// Новая сцена: Премиальная ТВ-зона
const TVZoneScene = () => {
  const groupRef = useRef();

  useFrame((state) => {
    // Плавное слежение за мышью (эффект параллакса)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.2 - 0.2, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.mouse.y * 0.1, 0.05);
  });

  useEffect(() => {
    // Анимация выезда всей ТВ-зоны из глубины при загрузке
    const ctx = gsap.context(() => {
      gsap.from(groupRef.current.position, {
         z: -15, opacity: 0, duration: 2.5, ease: "power3.out"
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        
        {/* Основная стеновая панель */}
        <mesh position={[0, 1.5, -0.4]} castShadow receiveShadow>
          <boxGeometry args={[7.5, 4.5, 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>

        {/* Декоративные рейки слева */}
        {[...Array(6)].map((_, i) => (
          <mesh key={`l-${i}`} position={[-3.2 + i * 0.25, 1.5, -0.3]} castShadow receiveShadow>
            <boxGeometry args={[0.1, 4.5, 0.15]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
        ))}
        {/* Декоративные рейки справа */}
        {[...Array(6)].map((_, i) => (
          <mesh key={`r-${i}`} position={[3.2 - i * 0.25, 1.5, -0.3]} castShadow receiveShadow>
            <boxGeometry args={[0.1, 4.5, 0.15]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
        ))}

        {/* ТВ Экран */}
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.2, 3, 0.1]} />
          <meshStandardMaterial color="#000000" roughness={0.1} metalness={0.9} />
        </mesh>
        
        {/* Экран (Свечение изображения) */}
        <mesh position={[0, 1.8, 0.06]}>
          <planeGeometry args={[5.0, 2.8]} />
          <meshBasicMaterial color="#312e81" transparent opacity={0.8} />
        </mesh>

        {/* Подвесная тумба */}
        <mesh position={[0, -0.2, 0.3]} castShadow receiveShadow>
          <boxGeometry args={[7, 0.4, 0.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Декор на тумбе (умные колонки) */}
        <mesh position={[-2.5, 0.15, 0.3]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
          <meshStandardMaterial color="#64748b" roughness={0.3} />
        </mesh>
        <mesh position={[2.5, 0.15, 0.3]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
          <meshStandardMaterial color="#64748b" roughness={0.3} />
        </mesh>
      </Float>

      {/* Задняя Ambilight подсветка телевизора */}
      <pointLight position={[0, 1.8, -0.3]} distance={8} intensity={4} color="#06b6d4" />
      <pointLight position={[2, 1.8, -0.3]} distance={8} intensity={3} color="#a855f7" />
      <pointLight position={[-2, 1.8, -0.3]} distance={8} intensity={3} color="#3b82f6" />
      
      {/* Нижняя подсветка под тумбой */}
      <pointLight position={[0, -0.5, 0.2]} distance={6} intensity={2.5} color="#818cf8" />
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950 -z-10" />
          <div className="relative z-10 w-full max-w-xl">
            
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
            <Canvas camera={{ position: [0, 0, 9], fov: 45 }}>
              <ambientLight intensity={0.2} /> {/* Сделали общее освещение темнее, чтобы круче смотрелась подсветка */}
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} castShadow />
              <TVZoneScene />
              <Environment preset="city" />
              <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={20} blur={2} far={4} />
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

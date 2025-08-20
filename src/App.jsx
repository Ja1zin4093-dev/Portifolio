import { useState } from 'react';
import ParticleBackground from './components/ParticleBackground'; // Animated canvas background
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { SkillsToolsSection } from './components/SkillsToolsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ContactSection } from './components/ContactSection'; 
import Footer from './components/Footer';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import React from 'react';
import ClickSpark from './components/ClickSpark';


// SectionReveal: always-on, resettable scroll animation for each section
// Fixes: correct imports, no hook conflicts, safe animation state
const SectionReveal = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });
  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut', delay } },
  };
  // Reset and play animation on every enter/exit
  React.useEffect(() => {
    if (inView) controls.start('visible');
    else controls.start('hidden');
  }, [inView, controls]);
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ClickSpark
      sparkColor="#FFFFFF"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      {/* Particle background sits behind all content, covers viewport */}
      <ParticleBackground />
      <Header onMenuClick={() => setMenuOpen(!menuOpen)} />
      <main style={{ marginTop: 70, position: 'relative', zIndex: 1 }}>
        <Hero />
        {/* Each section is wrapped in SectionReveal for always-on, resettable scroll animation */}
        <SectionReveal><AboutSection /></SectionReveal>
        <SectionReveal delay={0.08}><SkillsToolsSection /></SectionReveal>
        <SectionReveal delay={0.16}><ProjectsSection /></SectionReveal>
        <SectionReveal delay={0.24}><ContactSection/></SectionReveal>

        {/* <SectionReveal delay={0.24}><ContactSection />...</SectionReveal> --- IGNORE */}
        
      </main>
      <Footer />
    </ClickSpark>
  );
}



export default App;

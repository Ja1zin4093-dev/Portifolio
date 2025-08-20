import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import HeroTitle from './HeroTitle';


// Placeholder for Three.js/react-three-fiber particle background
const HeroSection = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: none;
`;

const Intro = styled(motion.div)`
  z-index: 2;
  text-align: center;
`;

const Name = styled.h1`
  font-size: 3rem;
  font-family: ${({ theme }) => theme.fonts.code};
  color: ${({ theme }) => theme.colors.heading};
  margin-bottom: 0.5rem;
`;

const Typewriter = styled.span`
  color: ${({ theme }) => theme.colors.neon};
  font-family: ${({ theme }) => theme.fonts.code};
  font-size: 1.5rem;
`;

// Simple typewriter effect
const roles = ['Full Stack Developer', 'Web Developer', 'Python Enthusiast', '3D Web Explorer'];

export function Hero() {
  const [text, setText] = useState('');
  const [roleIdx, setRoleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIdx];

    if (!isDeleting && charIdx < currentRole.length) {
      const timeout = setTimeout(() => setCharIdx(charIdx + 1), 80);
      setText(currentRole.slice(0, charIdx + 1));
      return () => clearTimeout(timeout);
    } else if (isDeleting && charIdx > 0) {
      const timeout = setTimeout(() => setCharIdx(charIdx - 1), 50);
      setText(currentRole.slice(0, charIdx - 1));
      return () => clearTimeout(timeout);
    } else if (!isDeleting && charIdx === currentRole.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 1200);
      return () => clearTimeout(timeout);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setRoleIdx((roleIdx + 1) % roles.length);
    }
  }, [charIdx, isDeleting, roleIdx]);

  return (
    <HeroSection>
      {/* TODO: Add Three.js/react-three-fiber particle background here */}
      <Intro
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <HeroTitle />
        <Typewriter>{text}_</Typewriter>
      </Intro>
    </HeroSection>
  );
}

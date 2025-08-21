import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ElectricBorder from './ElectricBorder'; // novo import (coloque ElectricBorder.jsx + ElectricBorder.css na mesma pasta)

const projects = [
  {
    name: 'Busca Texto',
    tech: ['C#', '.NET Framework'],
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
    demo: 'https://your-demo-link.com',
    video: '',
    desc: 'Um software de busca de texto feito para fins acadêmicos que possui diversos tipos de busca como KMP, Rabin-Karp e Boyer-Moore.'
  },
  {
    name: 'Editor de grafos',
    tech: ['C#', '.NET Framework'],
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    demo: '',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    desc: 'Um editor de grafos interativo com animações e com algoritmos como Caminho Mínimo , Euleriano, AGM e Profundidade.'
  },
  {
    name: 'Time line',
    tech: ['HTML', 'CSS','JavaScript'],
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    demo: 'https://time-lineamorosa.netlify.app/',
    video: '',
    desc: 'Uma linha do tempo interativa para visualização de eventos.'
  },
  {
    name: 'E-commerce Store',
    tech: ['React', 'Node.js', 'MongoDB'],
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    demo: 'https://your-ecommerce-demo.com',
    video: '',
    desc: 'An online store platform with user authentication and payment integration.'
  }
];

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  color: #eaf6fb;
  padding: 48px 0 32px 0;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
`;

// ... (o resto dos styled components permanece igual)
const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  overflow: visible;
  outline: none;
`;

const CarouselViewport = styled.div`
  overflow: hidden;
  width: 100%;
`;

const CarouselTrack = styled(motion.div)`
  display: flex;
  gap: 18px;
  will-change: transform;
  cursor: grab;
  &:active { cursor: grabbing; }
`;

const ArrowBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  background: linear-gradient(135deg, rgba(0,234,255,0.12), rgba(0,122,255,0.06));
  box-shadow: 0 6px 20px rgba(0,234,255,0.08);
  color: #00eaff;
  backdrop-filter: blur(6px);
  transition: transform 160ms, box-shadow 160ms;
  &:hover { transform: translateY(-50%) scale(1.05); box-shadow: 0 10px 30px rgba(0,234,255,0.14); }
`;

const PrevBtn = styled(ArrowBtn)`
  left: -26px;
`;

const NextBtn = styled(ArrowBtn)`
  right: -26px;
`;

const Card = styled(motion.div)`
  background: linear-gradient(135deg, #23273a 60%, #00eaff22 100%);
  border-radius: 18px;
  box-shadow: 0 4px 24px #00eaff22;
  overflow: hidden;
  cursor: pointer;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 8px 32px #00eaff55;
  }
  flex: 0 0 calc((100% - 36px) / 3);
  @media (max-width: 900px) {
    flex: 0 0 calc(100%);
  }
`;

const CardImg = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-bottom: 2px solid #00eaff44;
`;

const CardContent = styled.div`
  flex: 1;
  padding: 18px 14px 10px 14px;
  display: flex;
  flex-direction: column;
`;

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 8px 0 0 0;
`;

const Tech = styled.span`
  background: #00eaff22;
  color: #00eaff;
  font-size: 0.92rem;
  border-radius: 6px;
  padding: 2px 8px;
  font-family: 'Fira Code', monospace;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(10, 13, 19, 0.92);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(motion.div)`
  background: #181c2a;
  border-radius: 18px;
  box-shadow: 0 8px 48px #00eaff55;
  padding: 32px 24px;
  max-width: 540px;
  width: 96vw;
  color: #eaf6fb;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 18px;
  right: 24px;
  background: none;
  border: none;
  color: #00eaff;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;
`;

const MediaWrapper = styled.div`
  width: 100%;
  height: auto;
  iframe, video {
    width: 100%;
    height: auto;
  }
`;

const ProjectsSection = () => {
  const [modal, setModal] = useState(null);

  const total = projects.length;
  const [itemsPerViewState, setItemsPerViewState] = useState(typeof window !== 'undefined' && window.innerWidth <= 900 ? 1 : 3);

  // infinite slides: clone projects 3x and start in the middle block
  const slides = React.useMemo(() => [...projects, ...projects, ...projects], []);
  const startIndex = total;
  const [index, setIndex] = useState(startIndex);
  const [isSnap, setIsSnap] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = React.useRef(false);

  React.useEffect(() => {
    const onResize = () => setItemsPerViewState(window.innerWidth <= 900 ? 1 : 3);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  React.useEffect(() => {
    // when itemsPerView changes, ensure index stays in valid middle range
    setIndex(startIndex);
  }, [itemsPerViewState, total, startIndex]);

  const prev = useCallback(() => { setIsSnap(false); setIndex(i => i - 1); }, []);
  const next = useCallback(() => { setIsSnap(false); setIndex(i => i + 1); }, []);

  const wrapperRef = React.useRef(null);
  React.useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Enter') {
        const active = document.activeElement;
        if (active && active.getAttribute && active.getAttribute('aria-label')?.startsWith('Open details')) {
          active.click();
        }
      }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [wrapperRef, prev, next]);

  // when index moves into cloned regions, snap back to middle equivalent
  React.useEffect(() => {
    // if index is before the first copy or after the last copy
    if (index < total) {
      // jumped to left cloned block, snap to middle
      const target = index + total;
      setTimeout(() => {
        setIsSnap(true);
        setIndex(target);
      }, 260);
    } else if (index >= total * 2) {
      const target = index - total;
      setTimeout(() => {
        setIsSnap(true);
        setIndex(target);
      }, 260);
    } else {
      // normal
    }
  }, [index, total]);

  const viewportRef = React.useRef(null);

  return (
    <Section id="projects">
      <h2 style={{ fontFamily: 'Fira Code, monospace', fontWeight: 700, fontSize: '2.1rem', letterSpacing: 1 }}>Projects</h2>
      <CarouselWrapper ref={wrapperRef} tabIndex={0}>
        <CarouselViewport ref={viewportRef}>
          <CarouselTrack
            drag="x"
            dragMomentum={false}
            dragElastic={0.12}
            onDragStart={() => { isDraggingRef.current = true; setIsDragging(true); setIsSnap(false); }}
            onDragEnd={(e, info) => {
              const viewportWidth = viewportRef.current ? viewportRef.current.clientWidth : window.innerWidth;
              const gap = 18;
              const slideWidth = (viewportWidth - (itemsPerViewState - 1) * gap) / itemsPerViewState;
              const velocityFactor = 0.22;
              const movement = info.offset.x + info.velocity.x * velocityFactor;
              const absMovement = Math.abs(movement);
              let slidesToMove = Math.max(1, Math.round(absMovement / Math.max(1, slideWidth)));
              slidesToMove = Math.min(slidesToMove, total);
              if (absMovement < slideWidth * 0.15) {
                setIndex(i => i);
              } else {
                const dir = movement < 0 ? 1 : -1;
                setIndex(i => i + dir * slidesToMove);
              }
              setTimeout(() => { isDraggingRef.current = false; setIsDragging(false); }, 50);
            }}
            animate={{ x: `-${index * (100 / itemsPerViewState)}%` }}
            transition={isSnap ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 28 }}
          >
            {slides.map((proj, i) => (
              <Card
                key={proj.name + '-' + i}
                whileHover={{ rotateY: 8, y: -8, boxShadow: '0 12px 40px #00eaff88' }}
                transition={{ type: 'spring', stiffness: 200 }}
                onClick={(e) => {
                  if (isDraggingRef.current) { e.preventDefault(); e.stopPropagation(); return; }
                  setModal(i % total);
                }}
                style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
                tabIndex={0}
                aria-label={`Open details for ${proj.name}`}
              >
                <CardImg src={proj.img} alt={proj.name + ' preview'} />
                <CardContent>
                  <div style={{ fontWeight: 600, fontSize: '1.15rem' }}>{proj.name}</div>
                  <div style={{ color: '#b2c7d9', fontSize: '0.98rem', marginTop: 2 }}>{proj.desc}</div>
                  <TechList>
                    {proj.tech.map(t => <Tech key={t}>{t}</Tech>)}
                  </TechList>
                </CardContent>
              </Card>
            ))}
          </CarouselTrack>
        </CarouselViewport>
      </CarouselWrapper>

      {modal !== null && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setModal(null)}
          aria-modal="true"
          role="dialog"
        >
          {/* Aqui envolvemos o ModalContent com ElectricBorder */}
          <ElectricBorder
  color="#7df9ff"
  speed={1}
  chaos={0.5}
  thickness={2}
  style={{ borderRadius: 18 }} // apenas radius; o ModalContent controla largura
>

            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <CloseBtn onClick={() => setModal(null)} aria-label="Close project modal">×</CloseBtn>
              <div style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 8 }}>{projects[modal].name}</div>
              <TechList style={{ marginBottom: 10 }}>
                {projects[modal].tech.map(t => <Tech key={t}>{t}</Tech>)}
              </TechList>
              <MediaWrapper>
                {projects[modal].video ? (
                  <video src={projects[modal].video} autoPlay loop muted style={{ borderRadius: 12, marginBottom: 12 }} />
                ) : (
                  <iframe
                    src={projects[modal].demo}
                    title={projects[modal].name + ' demo'}
                    style={{ height: 220, border: 'none', borderRadius: 12, marginBottom: 12 }}
                    allow="autoplay; fullscreen"
                  />
                )}
              </MediaWrapper>
              <div style={{ color: '#b2c7d9', fontSize: '1.01rem', marginBottom: 10 }}>{projects[modal].desc}</div>
              <a href={projects[modal].demo || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#00eaff', textDecoration: 'underline', fontSize: '1.05rem' }}>
                {projects[modal].demo ? 'Live Demo' : 'Project Link'}
              </a>
            </ModalContent>
          </ElectricBorder>
        </ModalOverlay>
      )}
    </Section>
  );
};

export { ProjectsSection };

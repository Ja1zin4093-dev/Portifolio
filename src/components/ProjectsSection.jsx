import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiTrendingUp, FiHeart } from 'react-icons/fi';
import { FaProjectDiagram, FaReact } from 'react-icons/fa';
import { TbTimeline } from 'react-icons/tb';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { BiCalculator, BiTransfer } from 'react-icons/bi';
import { RiRobot2Line } from 'react-icons/ri';

const projects = [
  {
  key: 'buscaTexto',
  name: 'Busca Texto',
    tech: ['C#', '.NET Framework'],
  img: '',
  icon: FiSearch,
    github: 'https://github.com/Ja1zin4093-dev/BuscaTexto',
    demo: '',
    video: '',
    desc: 'Um software de busca de texto feito para fins acadêmicos que possui diversos tipos de busca como KMP, Rabin-Karp e Boyer-Moore.'
  },
  {
  key: 'editorGrafos',
  name: 'Editor de grafos',
    tech: ['C#', '.NET Framework'],
  img: '',
  icon: FaProjectDiagram,
    github: 'https://github.com/Ja1zin4093-dev/Editor-de-Grafos-2025.1--C--',
    demo: '',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    desc: 'Um editor de grafos interativo com animações e com algoritmos como Caminho Mínimo , Euleriano, AGM e Profundidade.'
  },
  {
  key: 'timeline',
  name: 'Time line',
    tech: ['HTML', 'CSS','JavaScript'],
  img: '',
  icon: TbTimeline,
    github: 'https://github.com/Ja1zin4093-dev/Memorias',
    demo: 'https://time-lineamorosa.netlify.app/',
    video: '',
    desc: 'Uma linha do tempo interativa para visualização de eventos.'
  },
  {
  key: 'maya',
  name: 'Maya',
    tech: ['HTML', 'CSS','JavaScript', 'PHP', 'MySQL'],
  img: '',
  icon: FiTrendingUp,
    github: 'https://github.com/Ja1zin4093-dev/Pit',
    demo: '',
    video: '',
    desc: 'Uma plataforma de gestão financeira com controle de despesas e metas. Desenvolvida para um projeto acadêmico.'
  },
  {
  key: 'portfolio',
  name: 'Portifolio',
    tech: ['React', 'tailwindcss','Vite', 'JavaScript','tree.js'],
  img: '',
  icon: FaReact,
    github: 'https://github.com/Ja1zin4093-dev/Portifolio',
    demo: '',
    video: '',
    desc: 'Um portfólio pessoal construído com React e Tailwind CSS.'
  },
  {
   key: 'cartinha',
   name: 'Cartinha',
    tech: ['HTML', 'CSS', 'JavaScript'],
  img: '',
  icon: FiHeart,
    github: 'https://github.com/Ja1zin4093-dev/Presente',
    demo: '',
    video: '',
    desc: 'Uma das minhas primeiras experiências com programação web. Um site simples de cartas de amor.'
  },
  {
  key: 'relogio',
  name: 'Relogio',
    tech:  ['React', 'tailwindcss','Vite', 'JavaScript'],
  img: '',
  icon: AiOutlineClockCircle,
    github: 'https://github.com/Ja1zin4093-dev/Relogio',
    demo: '',
    video: '',
    desc: 'Um relógio digital construído com React e Tailwind CSS.'
  },
  {
  key: 'calcEuclides',
  name: 'Calculadora de euclides',
    tech: ['Python'],
  img: '',
  icon: BiCalculator,
    github: 'https://github.com/Ja1zin4093-dev/Trabalho-de-md',
    demo: '',
    video: '',
    desc: 'Uma calculadora de euclides construída com Python. Com ferramentas de conversor de Bases, Algoritmo de Euclides e Crivo de Eratóstenes. Utilizando a biblioteca Tkinter para a interface gráfica.'
  },
  {
  key: 'autoTransfer',
  name: 'Auto-Transfer',
    tech: ['Python'],
  img: '',
  icon: BiTransfer,
    github: 'https://github.com/Ja1zin4093-dev/Transfer',
    demo: '',
    video: '',
    desc: 'Um projeto pessoal de transferência automática de arquivos construído com Python. Utilizando a biblioteca Tkinter para a interface gráfica e a biblioteca watchdog para monitoramento de diretórios.'
  },
  {
  key: 'triggerBot',
  name: 'Trigger-bot',
    tech: ['Python'],
  img: '',
  icon: RiRobot2Line,
    github: 'https://github.com/Ja1zin4093-dev/Trigger',
    demo: '',
    video: '',
    desc: 'Uma especie de cheat de disparo automario, desenvolvido em Python visando funcionar para o jogo Valorant.'
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

const CardIconMedia = styled.div`
  width: 100%;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid #00eaff44;
  background: linear-gradient(135deg, rgba(0,234,255,0.08), rgba(0,122,255,0.06));
  color: #00eaff;
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

// Modal-related styled components removed (we'll open links directly)

const ProjectsSection = () => {
  const { t } = useTranslation();

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
        const url = active?.getAttribute?.('data-url');
        if (url && url !== '#') {
          window.open(url, '_blank', 'noopener,noreferrer');
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

  const getProjectUrl = (proj) => proj.github || proj.demo || '#';

  return (
    <Section id="projects">
  <h2 style={{ fontFamily: 'Fira Code, monospace', fontWeight: 700, fontSize: '2.1rem', letterSpacing: 1 }}>{t('projects.title')}</h2>
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
                  const url = getProjectUrl(proj);
                  if (url && url !== '#') {
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }
                }}
                style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
                tabIndex={0}
                aria-label={`Open project link for ${proj.name}`}
                data-url={getProjectUrl(proj)}
              >
                {proj.img ? (
                  <CardImg src={proj.img} alt={proj.name + ' preview'} />
                ) : (
                  <CardIconMedia aria-hidden="true">
                    {proj.icon ? React.createElement(proj.icon, { size: 64 }) : <FiSearch size={64} />}
                  </CardIconMedia>
                )}
                <CardContent>
                  <div style={{ fontWeight: 600, fontSize: '1.15rem' }}>
                    {t(`projects.items.${proj.key}.name`)}
                  </div>
                  <div style={{ color: '#b2c7d9', fontSize: '0.98rem', marginTop: 2 }}>
                    {t(`projects.items.${proj.key}.desc`)}
                  </div>
                  <TechList>
                    {proj.tech.map(t => <Tech key={t}>{t}</Tech>)}
                  </TechList>
                </CardContent>
              </Card>
            ))}
          </CarouselTrack>
        </CarouselViewport>
      </CarouselWrapper>
    </Section>
  );
};

export { ProjectsSection };

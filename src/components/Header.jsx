import React, { useState, useEffect } from 'react';
import LanguageToggle from './LanguageToggle';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import GlareHover from './GlareHover';
import GlassSurface from './GlassSurface';
import { FiDownload } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const NAV_LINKS = [
  { label: 'Sobre', to: 'about' },
  { label: 'Skills', to: 'skills' },
  { label: 'Projetos', to: 'projects' },
  { label: 'Contato', to: 'contact' },
];

const HeaderBar = styled.header`
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  background: none;
  box-shadow: 0 2px 16px #00eaff11;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 70px;
  font-family: 'Inter', sans-serif;
  /* Smooth transitions for background / shadow / transform changes */
  transition: background-color 0.35s ease, box-shadow 0.35s ease, transform 0.25s ease, opacity 0.35s ease, backdrop-filter 0.35s ease, -webkit-backdrop-filter 0.35s ease;
  @media (max-width: 768px) {
    padding: 0 8px;
  }
`;

const Logo = styled.div`
  font-family: 'Fira Code', monospace;
  font-size: 1.45rem;
  font-weight: 700;
  color: #00eaff;
  letter-spacing: 1px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${({ active }) => (active ? '#00eaff' : '#eaf6fb')};
  font-family: 'Fira Code', monospace;
  font-size: 1.08rem;
  font-weight: 500;
  margin: 0 8px;
  padding: 6px 12px 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  outline: none;
  transition: color 0.18s;
  box-shadow: ${({ active }) => (active ? '0 2px 12px #00eaff44' : 'none')};
  &:hover, &:focus {
    color: #00eaff;
    background: none;
    transform: scale(1.08);
  }
  &::after {
    content: '';
    display: ${({ active }) => (active ? 'block' : 'none')};
    position: absolute;
    left: 12px; right: 12px; bottom: 2px;
    height: 2px;
    background: none;
    border-radius: 2px;
    transition: opacity 0.2s;
  }
`;

const Hamburger = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: block;
    background: none;
    border: none;
    color: #00eaff;
    font-size: 2rem;
    cursor: pointer;
    z-index: 200;
  }
`;

const MobileMenu = styled(motion.nav)`
  position: fixed;
  top: 0; right: 0;
  width: 72vw;
  max-width: 320px;
  height: 100vh;
  background: black;
  opacity: 0.90;
  box-shadow: -2px 0 24px #00eaff22;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 80px 24px 24px 24px;
  z-index: 150;
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavButton = styled(NavButton)`
  width: 100%;
  margin: 0 0 18px 0;
  font-size: 1.15rem;
  text-align: left;
`;

// Improved IntersectionObserver logic: attaches observers when elements exist,
// and watches DOM mutations to attach for elements that appear later.
function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = React.useState(null);

  React.useEffect(() => {
    if (!sectionIds || sectionIds.length === 0) return undefined;

    const inViewMap = {};
    sectionIds.forEach(id => { inViewMap[id] = false; });

    let ticking = false;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        if (!id) return;
        inViewMap[id] = entry.isIntersecting && entry.intersectionRatio > 0;
      });
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const visible = sectionIds.filter(id => inViewMap[id]);
          const newActive = visible.length ? visible[visible.length - 1] : null;
          setActiveSection(newActive);
          ticking = false;
        });
        ticking = true;
      }
    }, {
      root: null,
      rootMargin: '0px 0px -80% 0px',
      threshold: 0,
    });

    // Track which ids are already observed (element found)
    const observedIds = new Set();

    function tryAttachObservers() {
      sectionIds.forEach(id => {
        if (observedIds.has(id)) return;
        const el = document.getElementById(id);
        if (el) {
          io.observe(el);
          observedIds.add(id);
        }
      });
    }

    // Initial attach attempt
    tryAttachObservers();

    // If not all attached, watch for DOM mutations to attach later
    let mo;
    if (observedIds.size < sectionIds.length && typeof MutationObserver !== 'undefined') {
      mo = new MutationObserver(() => {
        tryAttachObservers();
        // if all attached we can disconnect MO
        if (observedIds.size === sectionIds.length && mo) {
          mo.disconnect();
          mo = null;
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    // As a safety fallback, periodically try to attach for a short time (covers odd race conditions)
    const attachInterval = setInterval(() => {
      tryAttachObservers();
      if (observedIds.size === sectionIds.length) {
        clearInterval(attachInterval);
      }
    }, 300);

    return () => {
      io.disconnect();
      if (mo) mo.disconnect();
      clearInterval(attachInterval);
    };
  }, [sectionIds]);

  return activeSection;
}

// Scroll to section with smooth animation
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


// Custom hook: detect scroll direction (up/down)
function useScrollDirection() {
  const [direction, setDirection] = useState('up');
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    function update() {
      const y = window.scrollY;
      if (y > lastY + 8) setDirection('down');
      else if (y < lastY - 8) setDirection('up');
      lastY = y;
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return direction;
}

export function Header({ onMenuClick }) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [glassEnabled, setGlassEnabled] = useState(false);
  // Use Intersection Observer to track which section is active
  const activeSection = useActiveSection(NAV_LINKS.map(l => l.to));
  const scrollDirection = useScrollDirection();

  // Enable GlassSurface only after the #about section exists and its images (if any) have loaded
  useEffect(() => {
    let mounted = true;

    function sectionReady() {
      const el = document.getElementById('about');
      if (!el) return false;
      const imgs = Array.from(el.querySelectorAll('img'));
      if (imgs.length === 0) return true; // no images -> ready
      return imgs.every(img => img.complete);
    }

    if (sectionReady()) {
      setGlassEnabled(true);
      return undefined;
    }

    // Watch DOM mutations (in case the about section is rendered later)
    const mo = new MutationObserver(() => {
      if (!mounted) return;
      if (sectionReady()) setGlassEnabled(true);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // As a fallback, listen for image load events inside the about section once it appears
    const interval = setInterval(() => {
      if (!mounted) return;
      if (sectionReady()) {
        setGlassEnabled(true);
      }
    }, 400);

    return () => {
      mounted = false;
      mo.disconnect();
      clearInterval(interval);
    };
    // run once
  }, []);

  // Close mobile menu on navigation
  function handleNavClick(id) {
    scrollToSection(id);
    setMenuOpen(false);
    if (onMenuClick) onMenuClick();
  }

  // fallback header background when scrolled (works even before GlassSurface is ready)
  const scrolled = activeSection !== null;
  const headerStyle = {
    backgroundColor: scrolled ? 'rgba(4,10,16,0.48)' : 'transparent',
    // apply a light blur fallback on supporting browsers for smoother effect
    backdropFilter: scrolled ? 'saturate(120%) blur(6px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'saturate(120%) blur(6px)' : 'none',
  };

  return (
    <HeaderBar
      as={motion.header}
      initial={{ y: -80 }}
      animate={{ y: scrollDirection === 'down' && !menuOpen ? -90 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={headerStyle}
    >
      {/* GlassSurface background positioned behind header content (only enabled after #about loads) */}
      <AnimatePresence>
        {glassEnabled && activeSection !== null && (
          <motion.div
            key={`header-glass-${activeSection || 'none'}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <GlassSurface
              width="100%"
              height={70}
              borderRadius={8}
              blur={10}
              displace={0.7}
              backgroundOpacity={0.02}
              className="header-glass"
              style={{ width: 'min(1200px, 100%)', margin: '0 16px' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '12px', width: '100%', justifyContent: 'space-between' }}>
        <LanguageToggle />
        <Nav>
          {NAV_LINKS.map(link => (
            <NavButton
              key={link.to}
              active={activeSection === link.to}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNavClick(link.to)}
              aria-current={activeSection === link.to ? 'page' : undefined}
            >
              {t(`nav.${link.label.toLowerCase()}`)}
            </NavButton>
          ))}
          <GlareHover
            width="auto"
            height="auto"
            glareColor="#00eaff"
            glareOpacity={0.3}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={800}
            playOnce={false}
            className="cursor-pointer"
            style={{ padding: '8px 16px', borderRadius: '6px', marginLeft: '12px' }}
          >
            <NavButton
              as="a"
              href="/path/to/Curriculo.pdf"
              download
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FiDownload size={20} />
              {t('header.resume')}
            </NavButton>
          </GlareHover>
        </Nav>
      </div>
      <Hamburger
        aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setMenuOpen(m => !m)}
      >
        {menuOpen ? '×' : '≡'}
      </Hamburger>
      {menuOpen && (
        <MobileMenu
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {NAV_LINKS.map(link => (
            <MobileNavButton
              key={link.to}
              active={activeSection === link.to}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNavClick(link.to)}
              aria-current={activeSection === link.to ? 'page' : undefined}
            >
              {link.label}
            </MobileNavButton>
          ))}
          <GlareHover
            width="auto"
            height="auto"
            glareColor="#00eaff"
            glareOpacity={0.3}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={800}
            playOnce={false}
            className="cursor-pointer"
            style={{ padding: '8px 16px', borderRadius: '6px', marginTop: '18px' }}
          >
            <MobileNavButton
              as="a"
              href="/path/to/Curriculo.pdf"
              download
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FiDownload size={20} />
              Meu Currículo
            </MobileNavButton>
          </GlareHover>
        </MobileMenu>
      )}
    </HeaderBar>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ContactSection from './ContactSection';
import ContactPopup from './ContactPopup';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// SVG icon placeholders
const GithubIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#23273a"/><text x="12" y="16" textAnchor="middle" fontSize="10" fontFamily="Fira Code, monospace" fill="#F8F8F2">GH</text></svg>
);
const LinkedInIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" fill="#23273a"/><text x="12" y="16" textAnchor="middle" fontSize="10" fontFamily="Fira Code, monospace" fill="#F8F8F2">IN</text></svg>
);
const EmailIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="4" fill="#23273a"/><text x="12" y="16" textAnchor="middle" fontSize="10" fontFamily="Fira Code, monospace" fill="#F8F8F2">@</text></svg>
);

// Ripple animation keyframes
const rippleAnim = keyframes`
  0% { opacity: 0.5; transform: scale(0); }
  80% { opacity: 0.3; transform: scale(2.5); }
  100% { opacity: 0; transform: scale(3); }
`;

const Section = styled.section`
  width: 100%;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  background: none
`;
const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Title = styled.h2`
  font-size: 3rem;
  font-family: 'Fira Code', monospace;
  font-weight: 700;
  color: #F8F8F2;
  margin-bottom: 0.5rem;
  text-align: center;
`;
const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: #C5C6C7;
  margin-bottom: 2.5rem;
  text-align: center;
`;
const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 1.2rem;
  width: 100%;
  justify-content: center;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;
const ButtonWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Ripple = styled.span`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  background: #1F2833;
  opacity: 0.5;
  animation: ${rippleAnim} 0.4s linear;
  z-index: 2;
`;
const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  min-width: 200px;
  height: 60px;
  padding: 0 1.2rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(90deg, #2E4A46 0%, #282A36 100%);
  color: #F8F8F2;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1.15rem;
  cursor: pointer;
  box-shadow: 0 0 0 rgba(46,74,70,0);
  position: relative;
  outline: none;
  transition: box-shadow 0.2s;
  &:hover, &:focus {
    box-shadow: 0 0 15px rgba(46,74,70,0.6);
  }
  &:focus {
    outline: 2px solid #00eaff;
    box-shadow: 0 0 15px #00eaff;
  }
`;
const IconWrap = styled(motion.span)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
`;
const Tooltip = styled(motion.div)`
  position: absolute;
  top: -38px;
  left: 50%;
  transform: translateX(-50%);
  background: #23273a;
  color: #F8F8F2;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.98rem;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 2px 8px #1F283388;
  pointer-events: none;
  z-index: 10;
`;
const PopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const PopupBox = styled(motion.div)`
  background: #181c2b;
  border-radius: 18px;
  padding: 2.5rem 2rem;
  min-width: 340px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0 32px 4px #00eaff99, 0 0 0 2px #00eaff;
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  position: relative;
`;

// Framer Motion variants for entry, tooltip, modal
const buttonVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};
const tooltipVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};


// Modal popup for ContactSection
function ContactModal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  // Trap focus inside modal and close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const focusableEls = modalRef.current?.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableEls?.[0];
    const lastEl = focusableEls?.[focusableEls.length - 1];
    function handleTab(e) {
      if (e.key !== 'Tab') return;
      if (!focusableEls?.length) return;
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
    function handleEsc(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEsc);
    firstEl?.focus();
    return () => {
      document.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Close modal on overlay click
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      console.log('PopupOverlay clicked');
      onClose();
    }
  }

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <PopupOverlay
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={modalVariants}
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <PopupBox
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </PopupBox>
        </PopupOverlay>
      )}
    </AnimatePresence>,
    document.body
  );
}

const Redes = () => {
  const [tooltip, setTooltip] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [ripple, setRipple] = useState({});
  const rippleRefs = { github: useRef(), linkedin: useRef(), email: useRef() };

  // Ripple effect handler
  const handleRipple = (e, key) => {
    const btn = rippleRefs[key].current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    setRipple({ key, x, y, size, ts: Date.now() });
    setTimeout(() => setRipple({}), 400);
  };

  // Tooltip logic
  const showTooltip = key => setTooltip(key);
  const hideTooltip = () => setTooltip(null);

  // Modal logic
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Button actions
  const handleGithub = e => {
    handleRipple(e, 'github');
    showTooltip('github');
    window.open('https://github.com/seunome', '_blank');
    setTimeout(hideTooltip, 1200);
  };
  const handleLinkedin = e => {
    handleRipple(e, 'linkedin');
    showTooltip('linkedin');
    window.open('https://linkedin.com/in/seunome', '_blank');
    setTimeout(hideTooltip, 1200);
  };
  const handleEmail = e => {
    handleRipple(e, 'email');
    openModal();
  };

  // Typing animation for subtitle
  const subtitleText = 'Me encontre nas redes ou envie um e‑mail direto';
  const [typed, setTyped] = useState('');
  React.useEffect(() => {
    let i = 0;
    setTyped('');
    const interval = setInterval(() => {
      setTyped(subtitleText.slice(0, i + 1));
      i++;
      if (i === subtitleText.length) clearInterval(interval);
    }, 38);
    return () => clearInterval(interval);
  }, []);

  // Button data
  const buttons = [
    {
      key: 'github',
      label: 'GitHub',
      icon: GithubIcon,
      onClick: handleGithub,
      aria: 'Abrir meu GitHub',
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: LinkedInIcon,
      onClick: handleLinkedin,
      aria: 'Abrir meu LinkedIn',
    },
    {
      key: 'email',
      label: 'Enviar E‑mail',
      icon: EmailIcon,
      onClick: handleEmail,
      aria: 'Enviar e‑mail direto',
    },
  ];

  return (
    <Section id="redes">
      <Container>
        <Title>Vamos conversar?</Title>
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {typed}
        </Subtitle>
        <ActionsGrid>
          {buttons.map((btn, i) => (
            <ButtonWrap key={btn.key}>
              <ActionButton
                as={motion.button}
                ref={rippleRefs[btn.key]}
                custom={i}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                aria-label={btn.aria}
                tabIndex={0}
                onClick={btn.onClick}
                onMouseEnter={() => btn.key !== 'email' && showTooltip(btn.key)}
                onMouseLeave={hideTooltip}
                onFocus={() => btn.key !== 'email' && showTooltip(btn.key)}
                onBlur={hideTooltip}
              >
                <IconWrap
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  {btn.icon}
                </IconWrap>
                {btn.label}
                {/* Ripple effect */}
                {ripple.key === btn.key && (
                  <Ripple
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: ripple.size,
                      height: ripple.size,
                    }}
                  />
                )}
              </ActionButton>
              {/* Tooltip */}
              <AnimatePresence>
                {tooltip === btn.key && btn.key !== 'email' && (
                  <Tooltip
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={tooltipVariants}
                  >
                    Abrindo em nova aba
                  </Tooltip>
                )}
              </AnimatePresence>
            </ButtonWrap>
          ))}
        </ActionsGrid>
        {/* Contact popup */}
        <ContactPopup isOpen={modalOpen} onClose={closeModal} />
      </Container>
    </Section>
  );
};


export default Redes;
export { Redes };

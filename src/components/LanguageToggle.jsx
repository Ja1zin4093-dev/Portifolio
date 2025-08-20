import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ToggleContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    padding: 8px 14px;
  }
`;

const ToggleButton = styled(motion.button)`
  background: transparent;
  border: none;
  padding: 6px 10px;
  font: inherit;
  color: inherit;
  cursor: pointer;
  border-radius: 8px;
  transition: all 180ms ease;
  position: relative;

  ${props => props.active && `
    box-shadow: 0 0 0 2px rgba(0,234,255,0.12), 0 6px 18px rgba(0,234,255,0.08);
    background: rgba(0,234,255,0.06);
  `}

  &:focus {
    outline: 3px solid rgba(0,234,255,0.14);
    outline-offset: 2px;
  }
`;

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState((i18n.language || 'pt').split('-')[0]);

  useEffect(() => {
    console.log('LanguageToggle mounted, currentLang=', currentLang);
    const onChange = (lng) => {
      console.log('languageChanged event:', lng);
      setCurrentLang((lng || 'pt').split('-')[0]);
    };
    i18n.on('languageChanged', onChange);
    return () => {
      i18n.off('languageChanged', onChange);
    };
  }, [i18n, currentLang]);

  const changeLang = async (lng) => {
    try {
      console.log('changing language to', lng);
      await i18n.changeLanguage(lng);
      localStorage.setItem('i18nextLng', lng);
      console.log('language changed, i18n.language=', i18n.language);
    } catch (err) {
      console.error('changeLanguage error', err);
    }
  };

  return (
    <ToggleContainer role="group" aria-label="Language switcher">
      <ToggleButton
        type="button"
        active={currentLang === 'pt'}
        onClick={() => changeLang('pt')}
        aria-pressed={currentLang === 'pt'}
        aria-label="Mudar idioma para Português"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        PT
      </ToggleButton>

      <ToggleButton
        type="button"
        active={currentLang === 'en'}
        onClick={() => changeLang('en')}
        aria-pressed={currentLang === 'en'}
        aria-label="Switch language to English"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        EN
      </ToggleButton>
    </ToggleContainer>
  );
};

export default LanguageToggle;

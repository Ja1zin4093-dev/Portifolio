import React from 'react';
import styled from 'styled-components';
import SplitText from './Split';
import { useTranslation } from 'react-i18next';

const Title = styled.h1`
  font-family: var(--font-code);
  color: var(--color-heading);
  margin-bottom: 0.5rem;
  text-align: center;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
  letter-spacing: -0.01em;

  /* Default fluid size */
  font-size: clamp(1.7rem, 8.5vw, 3.4rem);

  /* Slightly bigger on small devices */
  @media (max-width: 480px) {
    font-size: clamp(1.9rem, 10vw, 3.2rem);
  }

  @media (max-width: 360px) {
    font-size: clamp(2rem, 10.8vw, 3.1rem);
  }
`;

const HeroTitle = React.memo(() => {
  const { t, i18n } = useTranslation();
  return (
    <Title>
      <SplitText
        key={i18n.language}
        text={t('hero.title')}
        splitType="chars"
        delay={200}
        duration={0.6}
        ease="power3.out"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
  whiteSpace="nowrap"
      />
    </Title>
  );
});

export default HeroTitle;

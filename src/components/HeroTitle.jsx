import React from 'react';
import SplitText from './Split';

const HeroTitle = React.memo(() => {
  return (
    <h1
      style={{
        fontSize: '3rem',
        fontFamily: 'var(--font-code)',
        color: 'var(--color-heading)',
        marginBottom: '0.5rem',
      }}
    >
      <SplitText
        text="Oi, Eu sou o João"
        splitType="chars"
        delay={200}
        duration={0.6}
        ease="power3.out"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
      />
    </h1>
  );
});

export default HeroTitle;

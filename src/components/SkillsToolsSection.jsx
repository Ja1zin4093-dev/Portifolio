import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';

// --- ICONS (one SVG per skill, styled like the example) ---
const BaseRect = (children) => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a" />
    {children}
  </svg>
);

const JavaScriptIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <path d="M16 6L26 26H6L16 6Z" fill="#F7DF1E"/>
    <text x="16" y="22.5" textAnchor="middle" fontSize="10" fontFamily="Fira Code, monospace" fill="#23273a">JS</text>
  </svg>
);

const ReactIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <ellipse cx="16" cy="16" rx="10" ry="6" stroke="#61DAFB" strokeWidth="2" fill="none"/>
    <ellipse cx="16" cy="16" rx="6" ry="10" stroke="#61DAFB" strokeWidth="2" fill="none" transform="rotate(60 16 16)"/>
    <circle cx="16" cy="16" r="2" fill="#61DAFB"/>
  </svg>
);

const NodeIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <polygon points="10,12 22,12 26,16 22,20 10,20 6,16" fill="#8CC84B"/>
    <text x="16" y="21" textAnchor="middle" fontSize="9" fontFamily="Fira Code, monospace" fill="#23273a">Node</text>
  </svg>
);

const TypeScriptIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <rect x="6" y="8" width="20" height="16" rx="3" fill="#2B5EA6"/>
    <text x="16" y="21" textAnchor="middle" fontSize="9" fontFamily="Fira Code, monospace" fill="#fff">TS</text>
  </svg>
);

const CSharpIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <circle cx="12" cy="12" r="3" fill="#9b59b6"/>
    <rect x="14" y="8" width="8" height="10" rx="2" fill="#9b59b6"/>
    <text x="22" y="22" textAnchor="end" fontSize="9" fontFamily="Fira Code, monospace" fill="#fff">#</text>
  </svg>
);

const JavaIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <path d="M10 14c2-2 8-2 10 0-2 2-8 2-10 0z" fill="#f89820" opacity="0.95"/>
    <path d="M11 11c1-1 6-1 7 0" stroke="#f89820" strokeWidth="1.2" fill="none"/>
    <text x="16" y="22" textAnchor="middle" fontSize="9" fontFamily="Fira Code, monospace" fill="#fff">Jv</text>
  </svg>
);

const HTML5Icon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <path d="M8 8h16l-1.5 12L16 24l-6.5-4L8 8z" fill="#E34F26"/>
    <text x="16" y="22" textAnchor="middle" fontSize="9" fontFamily="Fira Code, monospace" fill="#fff">5</text>
  </svg>
);

const CSSIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <path d="M8 8h16l-2 10L16 22l-6  -4L8 8z" fill="#1572B6"/>
    <text x="16" y="22" textAnchor="middle" fontSize="9" fontFamily="Fira Code, monospace" fill="#fff">CSS</text>
  </svg>
);

const PythonIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <path d="M10 9c0-1.5 1.2-3 3-3h6v4H13c-1 0-3 0-3-1z" fill="#306998"/>
    <path d="M22 23c0 1.5-1.2 3-3 3h-6v-4h8c1 0 3 0 3 1z" fill="#FFD43B"/>
  </svg>
);

const PHPIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <ellipse cx="16" cy="16" rx="9" ry="5" fill="#8892BF"/>
    <text x="16" y="19" textAnchor="middle" fontSize="9" fontFamily="Fira Code, monospace" fill="#23273a">PHP</text>
  </svg>
);

const PowerBIIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <rect x="9" y="10" width="2" height="8" fill="#F2C80F"/>
    <rect x="13" y="8" width="2" height="10" fill="#F2C80F"/>
    <rect x="17" y="12" width="2" height="6" fill="#F2C80F"/>
    <rect x="21" y="14" width="2" height="4" fill="#F2C80F"/>
  </svg>
);

const ExcelIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <rect x="7" y="8" width="18" height="16" rx="2" fill="#207245"/>
    <text x="16" y="21" textAnchor="middle" fontSize="9" fontFamily="Fira Code, monospace" fill="#fff">X</text>
  </svg>
);

const GitIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <path d="M10 22l12-12" stroke="#F05032" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="10" cy="22" r="2" fill="#F05032"/>
    <circle cx="22" cy="10" r="2" fill="#F05032"/>
    <circle cx="22" cy="22" r="2" fill="#F05032"/>
  </svg>
);

const MySQLIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <path d="M8 20c3-4 7-6 8-6s5 2 8 6" fill="#00758F"/>
    <text x="16" y="22" textAnchor="middle" fontSize="8.5" fontFamily="Fira Code, monospace" fill="#fff">MySQL</text>
  </svg>
);

const OracleSQLIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <rect x="8" y="10" width="16" height="4" rx="1" fill="#F00"/>
    <text x="16" y="22" textAnchor="middle" fontSize="8.5" fontFamily="Fira Code, monospace" fill="#fff">SQL</text>
  </svg>
);

const AssemblyIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <rect x="7" y="10" width="18" height="12" rx="2" fill="#4B5563"/>
    <text x="16" y="19" textAnchor="middle" fontSize="8.5" fontFamily="Fira Code, monospace" fill="#fff">ASM</text>
  </svg>
);

const DotNetIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <circle cx="16" cy="12" r="4" fill="#512BD4"/>
    <rect x="10" y="18" width="12" height="4" rx="2" fill="#512BD4"/>
    <text x="16" y="23" textAnchor="middle" fontSize="8.5" fontFamily="Fira Code, monospace" fill="#fff">.NET</text>
  </svg>
);

const ASPNetIcon = (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="#23273a"/>
    <rect x="7" y="10" width="18" height="12" rx="2" fill="#6DB33F"/>
    <text x="16" y="19" textAnchor="middle" fontSize="8.5" fontFamily="Fira Code, monospace" fill="#fff">ASP</text>
  </svg>
);

// --- Skills array with correct icons ---
const skills = [
  { icon: JavaScriptIcon, name: 'JavaScript', level: 90 },
  { icon: ReactIcon, name: 'React', level: 85 },
  { icon: NodeIcon, name: 'Node.js', level: 80 },
  { icon: TypeScriptIcon, name: 'TypeScript', level: 75 },
  { icon: CSharpIcon, name: 'C#', level: 87 },
  { icon: JavaIcon, name: 'Java', level: 78 },
  { icon: HTML5Icon, name: 'HTML5', level: 64 },
  { icon: CSSIcon, name: 'CSS', level: 79 },
  { icon: PythonIcon, name: 'Python', level: 98 },
  { icon: PHPIcon, name: 'PHP', level: 71 },
  { icon: PowerBIIcon, name: 'Power BI', level: 54 },
  { icon: ExcelIcon, name: 'Excel', level: 84 },
  { icon: GitIcon, name: 'Git', level: 100 },
  { icon: MySQLIcon, name: 'MySQL', level: 83 },
  { icon: OracleSQLIcon, name: 'Oracle SQL', level: 92 },
  { icon: AssemblyIcon, name: 'Assembly', level: 47 },
  { icon: DotNetIcon, name: '.NET Framework', level: 91 },
  { icon: ASPNetIcon, name: 'ASP.NET', level: 50 },
];

// --- Styled Components (unchanged) ---
const Section = styled.section`
  background: none;
  color: #C5C6C7;
  padding: 36px 0 24px 0;
  font-family: 'Inter', sans-serif;
  max-width: 900px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
  width: 100%;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const SkillItemWrap = styled(motion.div)`
  background: none;
  border-radius: 12px;
  box-shadow: 0 2px 12px #2E4A4622;
  padding: 18px 16px 14px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 180px;
  min-height: 80px;
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.18s, border 0.18s;
  will-change: transform, box-shadow;
  &:hover, &:focus {
    outline: none;
  }
`;

const SkillLabel = styled.div`
  font-family: 'Fira Code', monospace;
  font-size: 1.08rem;
  font-weight: 600;
  color: #C5C6C7;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BarContainer = styled.div`
  width: 100%;
  background: #23273a;
  border-radius: 8px;
  overflow: visible;
  height: 18px;
  margin: 8px 0 0 0;
  position: relative;
  z-index: 2;
  @media (max-width: 400px) {
    min-width: 100px;
  }
`;

const BarFillComponent = ({ level, index }) => (
  <motion.div
    style={{
      height: '100%',
      background: 'linear-gradient(90deg, #2E4A46 0%, #66FCF1 100%)',
      borderRadius: '8px 0 0 8px',
      boxShadow: '0 0 12px #66FCF1aa, 0 0 8px #2E4A4688',
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 2,
    }}
    initial={{ width: '0%' }}
    animate={{ width: `${level}%` }}
    transition={{ delay: index * 0.06, duration: 0.8, ease: 'easeInOut' }}
  />
);

const SkillLevel = styled.span`
  color: #00eaff;
  font-size: 1.01rem;
  margin-left: 8px;
`;

const ShowMoreButton = styled(motion.button)`
  margin: 16px auto;
  padding: 12px 24px;
  border: none;
  border-radius: 24px;
  background: linear-gradient(90deg, #2E4A46 0%, #66FCF1 100%);
  color: #FFFFFF;
  font-family: 'Fira Code', monospace;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: block;
  text-align: center;
  box-shadow: 0 0 12px #66FCF1aa, 0 0 8px #2E4A4688;
  transition: box-shadow 0.3s, transform 0.3s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 16px #66FCF1cc, 0 0 12px #2E4A46bb;
  }
`;

const variants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 20 },
};

const SkillItem = ({ icon, name, level, index }) => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });
  useEffect(() => {
    if (inView) console.log('Entering', name);
    else console.log('Exiting', name);
  }, [inView, name]);
  return (
    <SkillItemWrap
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover={{ scale: 1.05 }}
      tabIndex={0}
      aria-label={`${name}: ${level}% de proficiência`}
      onMouseEnter={() => console.log('Hovering on', name)}
      style={{ zIndex: 2 }}
    >
      <SkillLabel>
        <motion.div
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          {icon}
        </motion.div>
        {name}
        <SkillLevel>{level}%</SkillLevel>
      </SkillLabel>
      <BarContainer aria-label={`${name}: ${level}% de proficiência`}>
        <BarFillComponent level={level} index={index} />
      </BarContainer>
    </SkillItemWrap>
  );
};

// --- Main Section component (default export) ---
export default function SkillsToolsSection({ skills: skillsProp }) {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const skillsList = skillsProp || skills;
  const displayedSkills = showAll ? skillsList : skillsList.slice(0, 6);

  return (
    <Section id="skills">
      <h2 style={{ fontFamily: 'Fira Code, monospace', fontWeight: 700, fontSize: '2.1rem', letterSpacing: 1, marginBottom: 18 }}>{t('skills.title')}</h2>
      <Grid>
        {displayedSkills.map((skill, index) => (
          <SkillItem
            key={skill.name}
            icon={skill.icon}
            name={skill.name}
            level={skill.level}
            index={index}
          />
        ))}
      </Grid>
      {skillsList.length > 6 && (
        <ShowMoreButton
          onClick={() => setShowAll(!showAll)}
          whileHover={{ scale: 1.05 }}
        >
          {showAll ? t('skills.showLess') : t('skills.showMore')}
        </ShowMoreButton>
      )}
    </Section>
  );
}

export { SkillsToolsSection };
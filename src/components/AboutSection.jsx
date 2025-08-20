import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileCard from './ProfileCard';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';



// Timeline data
const milestones = [
  { year: '2021', title: 'Ingressei no colegio Cotemig', desc: 'Onde iniciei minha jornada como desenvolvedor.' },
  { year: '2023', title: 'Me formei no colegio Cotemig e conclui o curso técnico', desc: 'Adquiri conhecimentos sólidos em desenvolvimento, front-end e back-end, especialmente em C#, Python e React.' },
  { year: '2024', title: 'Ingressei na faculdade Cotemig', desc: 'Onde estou me aprofundando em Sistemas de informação.' },
  { year: '2025', title: 'Primeira experiencia profissional', desc: 'Atuei como suporte técnico na RP Informatica' },
  { year: '2025', title: 'Criando diversos projetos pessoais', desc: 'Desenvolvi aplicações web e scripts para automação de tarefas.' },
];

// Neon glow animation
const neonGlow = keyframes`
  0%, 100% { box-shadow: 0 0 8px 2px #00eaff, 0 0 16px 4px #00eaff44; }
  50% { box-shadow: 0 0 16px 4px #00eaff, 0 0 32px 8px #00eaff88; }
`;

// Glitch SVG filter animation
const glitchAnim = keyframes`
  0% { filter: url(#glitch); }
  50% { filter: none; }
  100% { filter: url(#glitch); }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 0 32px 0;
  background: none;
  color: #eaf6fb;
  font-family: 'Inter', sans-serif;
  text-align: center; // Adicionado para centralizar o texto

  @media (max-width: 480px) {
    padding: 32px 16px; // Ajustando o padding para dispositivos móveis
  }
`;

const Timeline = styled.div`
  position: relative;
  margin: 32px 0 0 0;
  padding-left: 32px;
  border-left: 2px dashed #00eaff88;
  max-width: 420px;
  width: 100%;

  @media (max-width: 480px) {
    padding-left: 0;
    max-width: 90vw;
    
  }
`;

const TimelineItem = styled(motion.div)`
  position: relative;
  margin-bottom: 40px;
  padding-left: 24px;
`;

const Dot = styled.div`
  position: absolute;
  left: -13px;
  top: 8px;
  width: 18px;
  height: 18px;
  background: none;
  border: 3px solid #00eaff;
  border-radius: 50%;
  box-shadow: 0 0 8px #00eaff88;
`;

const Year = styled.div`
  font-weight: bold;
  color: #00eaff;
  font-size: 1.1rem;
`;

const Title = styled.div`
  font-size: 1.05rem;
  margin: 2px 0 0 0;
`;

const Desc = styled.div`
  font-size: 0.98rem;
  color: #b2c7d9;
  margin-top: 2px;
`;

const ProfileWrapper = styled.div`
  margin-top: 0;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NeonBorder = styled.div`
  display: inline-block;
  border-radius: 50%;
  padding: 6px;
  animation: ${neonGlow} 1.8s infinite alternate;
`;

const GlitchImg = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  background: none;
  animation: ${glitchAnim} 2.5s infinite;
`;

const Button = styled(motion.button)`
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
  animation: ${neonGlow} 1.8s infinite alternate;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 16px #66FCF1cc, 0 0 12px #2E4A46bb;
  }
`;

// Atualizando o estilo do container para alinhar os elementos lado a lado
const ProfileTimelineContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center; // Adicionado para centralizar os elementos
`;

const AboutSection = () => {
  const { t } = useTranslation();
  const [showFullTimeline, setShowFullTimeline] = useState(false);

  const toggleTimeline = () => {
    setShowFullTimeline((prev) => !prev);
  };

  return (
    <Section id="about">
      <h2 style={{ fontFamily: 'Fira Code, monospace', fontWeight: 700, fontSize: '2.1rem', letterSpacing: 1 }}>
        {t('about.title')}
      </h2>
      <ProfileTimelineContainer>
        <ProfileCard
          name="João R. Rosa"
          title="Software Engineer"
          handle="jg_rocha23"
          status="Online"
          contactText="Contact Me"
          avatarUrl="/Eu.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          onContactClick={() => console.log('Contact clicked')}
        />
        <Timeline>
          {milestones.slice(0, showFullTimeline ? milestones.length : 3).map((item, i) => (
            <TimelineItem
              key={item.year}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <Dot aria-hidden="true" />
              <Year>{item.year}</Year>
              <Title>{t(`about.milestones.${i}.title`)}</Title>
              <Desc>{t(`about.milestones.${i}.desc`)}</Desc>
            </TimelineItem>
          ))}
        </Timeline>
      </ProfileTimelineContainer>
      <Button onClick={toggleTimeline}>
        {showFullTimeline ? t('about.hide') : t('about.showMore')}
      </Button>
    </Section>
  );
};

export { AboutSection };

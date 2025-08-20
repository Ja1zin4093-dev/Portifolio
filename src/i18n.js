import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "header.title": "My Portfolio",
      "header.resume": "My Resume",
      "nav.sobre": "About",
      "nav.skills": "Skills",
      "nav.projetos": "Projects",
      "nav.contato": "Contact",
      "about.title": "About",
      "about.profileAlt": "Profile",
      "about.showMore": "Show More",
      "about.hide": "Hide",
      "about.milestones.0.title": "Started at Cotemig School",
      "about.milestones.0.desc": "Where I began my journey as a developer.",
      "about.milestones.1.title": "Graduated from Cotemig School and completed technical course",
      "about.milestones.1.desc": "Gained solid knowledge in development, front-end and back-end, especially in C#, Python, and React.",
      "about.milestones.2.title": "Started at Cotemig College",
      "about.milestones.2.desc": "Where I am deepening my knowledge in Information Systems.",
      "about.milestones.3.title": "First professional experience",
      "about.milestones.3.desc": "Worked as technical support at RP Informatica.",
      "about.milestones.4.title": "Creating various personal projects",
      "about.milestones.4.desc": "Developed web applications and scripts for task automation.",
      "skills.showMore": "Show More",
      "skills.showLess": "Show Less",
      "skills.title": "Skills & Tools"
    }
  },
  pt: {
    translation: {
      "header.title": "Meu Portifolio",
      "header.resume": "Meu Currículo",
      "nav.sobre": "Sobre",
      "nav.skills": "Skills",
      "nav.projetos": "Projetos",
      "nav.contato": "Contato",
      "about.title": "Sobre",
      "about.profileAlt": "Perfil",
      "about.showMore": "Exibir Mais",
      "about.hide": "Ocultar",
      "about.milestones.0.title": "Ingressei no colegio Cotemig",
      "about.milestones.0.desc": "Onde iniciei minha jornada como desenvolvedor.",
      "about.milestones.1.title": "Me formei no colegio Cotemig e conclui o curso técnico",
      "about.milestones.1.desc": "Adquiri conhecimentos sólidos em desenvolvimento, front-end e back-end, especialmente em C#, Python e React.",
      "about.milestones.2.title": "Ingressei na faculdade Cotemig",
      "about.milestones.2.desc": "Onde estou me aprofundando em Sistemas de informação.",
      "about.milestones.3.title": "Primeira experiencia profissional",
      "about.milestones.3.desc": "Atuei como suporte técnico na RP Informatica.",
      "about.milestones.4.title": "Criando diversos projetos pessoais",
      "about.milestones.4.desc": "Desenvolvi aplicações web e scripts para automação de tarefas.",
      "skills.showMore": "Exibir mais",
      "skills.showLess": "Exibir menos",
      "skills.title": "Habilidades & Ferramentas"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || (navigator.language && navigator.language.split('-')[0]) || 'pt',
    fallbackLng: 'pt',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
console.log('i18n initialized', i18n.language);

export default i18n;

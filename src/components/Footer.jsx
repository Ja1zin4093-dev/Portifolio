import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const FooterContainer = styled.footer` 
  background: #10131A;
  color: #C5C6C7;
  padding: 2rem;
  border-top: 1px solid #2E4A46;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }

  @media (max-width: 380px) {
    flex-direction: column;
    font-size: 0.75rem;
  }
`;

const ContactInfo = styled.div`
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const SocialIcon = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2E4A46;
  color: #C5C6C7;
  transition: background-color 0.3s;

  &:hover {
    background: #00EAFF;
    color: #10131A;
    transform: scale(1.1);
  }
`;

const Copyright = styled.div`
  font-size: 0.875rem;
  margin-top: 1rem;

  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <ContactInfo>
        <p>+55 (31) 9 8278-7372</p>
        <p>ja1zin23@gmail.com</p>
        <p>Belo Horizonte, MG, Brazil</p>
      </ContactInfo>
      <SocialLinks>
        <SocialIcon
          href="https://github.com/ja1zin23"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
        >
          <FaGithub size={24} />
        </SocialIcon>
        <SocialIcon
          href="https://linkedin.com/in/ja1zin23"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
        >
          <FaLinkedin size={24} />
        </SocialIcon>
        <SocialIcon
          href="https://twitter.com/ja1zin23"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
        >
          <FaTwitter size={24} />
        </SocialIcon>
      </SocialLinks>
      <Copyright>
        <p>Made with ❤️ by João Gabriel Rocha Rosa</p>
        <p>© {new Date().getFullYear()} João Gabriel Rocha Rosa</p>
        <p><a href="/privacy-policy" style={{ color: '#00EAFF' }}>Privacy Policy</a></p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;

import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from 'emailjs-com';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_USER_ID
} from '../emailjs.config.example';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.4s ease-in-out;
  z-index: 1000;
`;

const FormContainer = styled(motion.div)`
  width: 480px;
  max-width: 90%;
  background: linear-gradient(135deg, #2E4A46, #181c2b);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 234, 255, 0.5);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-width: 768px) {
    width: 70vw;
    max-height: 80vh;
    overflow-y: auto;
    margin: 0 auto;
    left: 50%;
    transform: translateX(-50%);
  }

  @media (max-width: 360px) {
    width: 90vw;
    max-width: 540px;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-family: 'Fira Code', monospace;
  color: #F8F8F2;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #C5C6C7;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-bottom: 2px solid #C5C6C7;
  background: none;
  color: #F8F8F2;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #00eaff;
  }
`;

const Label = styled.label`
  position: absolute;
  top: 0.75rem;
  left: 0;
  font-size: 1rem;
  color: #C5C6C7;
  pointer-events: none;
  transition: transform 0.3s, color 0.3s;

  ${Input}:focus + &,
  ${Input}:not(:placeholder-shown) + & {
    transform: translateY(-1.5rem);
    color: #00eaff;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 999px;
  background: #00eaff;
  color: #181c2b;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.6);
  transition: transform 0.2s;
  z-index: 9999; /* Garantir que o botão esteja acima de outros elementos */

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 234, 255, 0.8);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    background: rgba(0, 234, 255, 0.5);
    cursor: not-allowed;
  }
`;

const NotificationContainer = styled(motion.div)`
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${(props) => (props.success ? '#00eaff' : '#ff4d4d')};
  color: #181c2b;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  z-index: 1100;
`;

const NotificationText = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #181c2b;
  font-size: 1.5rem;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
`;

const ContactPopup = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;

    if (!name || !email || !message) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setIsSending(true);
    setNotification(null);

    try {
      const templateParams = {
        from_name: name,
        from_email: email,
        message,
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_USER_ID
      );

      setNotification({ success: true, message: '' });
      toast.success('Mensagem enviada com sucesso!', {
        position: 'bottom-right',
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
        theme: 'dark',
        transition: Slide,
      });
    } catch {
      setNotification({ success: false, message: '' });
      toast.error('Falha ao enviar. Tente novamente.', {
        position: 'bottom-right',
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
        theme: 'dark',
        transition: Slide,
      });
    } finally {
      setIsSending(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <FormContainer
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Title>Entre em contato</Title>
              <Subtitle>Envie uma mensagem para nós</Subtitle>
              <InputGroup>
                <Input type="text" placeholder=" " id="name" name="name" required />
                <Label htmlFor="name">Nome</Label>
              </InputGroup>
              <InputGroup>
                <Input type="email" placeholder=" " id="email" name="email" required />
                <Label htmlFor="email">E-mail</Label>
              </InputGroup>
              <InputGroup>
                <Input as="textarea" placeholder=" " id="message" name="message" required />
                <Label htmlFor="message">Mensagem</Label>
              </InputGroup>
              <SubmitButton
                type="submit"
                disabled={isSending}
              >
                {isSending ? 'Enviando…' : 'Enviar agora'}
              </SubmitButton>
            </form>
          </FormContainer>
          <ToastContainer />
          {notification && notification.message}
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ContactPopup;

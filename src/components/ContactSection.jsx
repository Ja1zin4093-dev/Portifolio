import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Use the default import for EmailJS (fixes 'send' of undefined error)
import emailjs from 'emailjs-com';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID } from '../emailjs.config.example';
// Import React-Toastify for animated notifications
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled, { css, keyframes } from 'styled-components';

const Section = styled.section`
  background: none;
  color: #eaf6fb;
  padding: 48px 0 32px 0;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const GlassPanel = styled(motion.div)`
  position: relative;
  width: calc(100% - 2rem);
  max-width: 520px;
  margin: 0 auto;
  background: rgba(24, 28, 43, 0.82);
  border-radius: 18px;
  box-shadow: 0 0 18px #00eaff22, 0 0 0 2px #00eaff33;
  backdrop-filter: blur(10px);
  padding: 2rem;
  z-index: 2;
  overflow: visible;

  @media (max-width: 520px) {
    max-width: 90vw;
    padding: 1.5rem;
  }
`;

const Aura = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 120%;
  transform: translate(-50%, -50%) rotate(0deg);
  border-radius: 32px;
  background: radial-gradient(circle, #00eaff33 0%, #23273a00 80%);
  filter: blur(32px);
  z-index: 1;
  pointer-events: none;
  animation: rotate 30s linear infinite;

  @keyframes rotate {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  margin-top: 18px;
`;

const FieldWrap = styled(motion.div)`
  position: relative;
  width: 100%;
  will-change: transform;
  &:invalid {
    animation: shake 0.6s;
    box-shadow: 0 0 8px #ff4d4f;
  }

  @keyframes shake {
    0% { transform: translateX(0); }
    20% { transform: translateX(-5px); }
    40% { transform: translateX(5px); }
    60% { transform: translateX(-3px); }
    80% { transform: translateX(3px); }
    100% { transform: translateX(0); }
  }
`;

const Label = styled(motion.label)`
  position: absolute;
  left: 0;
  top: 12px;
  color: #C5C6C7;
  font-size: 1rem;
  font-weight: 500;
  pointer-events: none;
  transition: all 0.22s cubic-bezier(.4,0,.2,1);
  ${({ focused }) => focused && css`
    top: -10px;
    font-size: 1rem;
    color: #00eaff;
  `}
`;

const Input = styled.input`
  width: 100%;
  background: none;
  border: none;
  border-bottom: 2px solid #00eaff44;
  color: #eaf6fb;
  font-size: 1.08rem;
  padding: 12px 0 8px 0;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
  &:focus {
    border-bottom: 2px solid #00eaff;
    box-shadow: 0 2px 12px #00eaff44;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  background: none;
  border: none;
  border-bottom: 2px solid #00eaff44;
  color: #eaf6fb;
  font-size: 1.08rem;
  padding: 12px 0 8px 0;
  outline: none;
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.3s, box-shadow 0.3s;
  &:focus {
    border-bottom: 2px solid #00eaff;
    box-shadow: 0 2px 12px #00eaff44;
  }
`;

const Button = styled(motion.button)`
  margin-top: 10px;
  background: linear-gradient(90deg, #069bacff, #00A8CC, #00678A);
  background-size: 400% 100%;
  color: #ffffffff;
  font-family: 'Fira Code', monospace;
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: none;
  border-radius: 32px;
  padding: 0 24px;
  height: 56px;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(0, 230, 255, 0.3);
  transition: box-shadow 0.3s, transform 0.3s, background 0.3s;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(0, 230, 255, 0.5);
    outline: none;
  }

  &:focus {
    outline: 4px solid #00E6FF;
    outline-offset: 4px;
  }

  &:active {
    transform: scale(0.95) rotate(2deg);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 230, 255, 0.3); }
  50% { box-shadow: 0 0 20px rgba(0, 230, 255, 0.5); }
  100% { box-shadow: 0 0 0 0 rgba(0, 230, 255, 0.3); }
`;

const Ripple = styled(motion.span)`
  position: absolute;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(0, 230, 255, 0.5) 0%, rgba(0, 230, 255, 0) 80%);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0.2);
  opacity: 0.7;
  z-index: 2;
  animation: ripple 0.6s ease-out 1;

  @keyframes ripple {
    from { transform: scale(0.2); opacity: 0.7; }
    to { transform: scale(1.2); opacity: 0; }
  }
`;

const Icon = styled(motion.svg)`
  width: 24px;
  height: 24px;
  fill: #FFFFFF;
  transition: transform 0.3s;
  &:hover {
    transform: translateX(4px);
  }
`;

const SuccessCard = styled(motion.div)`
  background: rgba(24, 28, 43, 0.92);
  border-radius: 18px;
  box-shadow: 0 0 18px #00eaff55, 0 0 0 2px #00eaff;
  padding: 2.2rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 320px;
  margin: 0 auto;
  position: relative;
  animation: bounce 0.7s;
  @keyframes bounce {
    0% { transform: scale(0.9); }
    60% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

const Checkmark = styled(motion.svg)`
  width: 48px;
  height: 48px;
  margin-bottom: 1.2rem;
  stroke: #00eaff;
  stroke-width: 3;
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
`;

const SuccessMsg = styled.div`
  color: #00eaff;
  font-size: 1.18rem;
  margin-top: 8px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
`;

const ResetButton = styled(Button)`
  margin-top: 18px;
  background: linear-gradient(90deg, #00EAFF33 0%, #23273a 100%);
  color: #00eaff;
  font-size: 1.05rem;
  box-shadow: 0 0 12px #00eaff88;
`;

const ErrorMessage = styled(motion.div)`
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
  border-left: 4px solid #ff4d4f;
  padding: 4px 8px;
  font-size: 0.9rem;
  border-radius: 4px;
`;

const ContactSection = ({ asModal = false, onClose }) => {
  const [fields, setFields] = useState({ name: '', email: '', message: '' });
  const [focus, setFocus] = useState({ name: false, email: false, message: false });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [rippleActive, setRippleActive] = useState(false);
  const modalRef = useRef(null);

  // Accessibility: trap focus in modal
  useEffect(() => {
    if (!asModal) return;
    if (!modalRef.current) return;
    const focusableEls = modalRef.current.querySelectorAll(
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
      if (e.key === 'Escape' && onClose) onClose();
    }
    document.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEsc);
    firstEl?.focus();
    return () => {
      document.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [asModal, onClose]);

  // Client-side validation for required fields and email format
  const validate = () => {
    const errs = {};
    if (!fields.name.trim()) errs.name = 'Name is required.';
    if (!fields.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email)) errs.email = 'Invalid email.';
    if (!fields.message.trim()) errs.message = 'Message is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = e => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFocus = e => {
    setFocus({ ...focus, [e.target.name]: true });
  };

  const handleBlur = e => {
    setFocus({ ...focus, [e.target.name]: !!fields[e.target.name] });
  };

  // Ripple effect
  const handleButtonClick = () => {
    setRippleActive(true);
    setTimeout(() => setRippleActive(false), 400);
  };

  // Reset form
  const handleReset = () => {
    setFields({ name: '', email: '', message: '' });
    setSent(false);
    setError('');
    setErrors({});
  };

  // Email sending logic using EmailJS
  // You must configure EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID
  // See emailjs.config.example.js and https://www.emailjs.com/docs/
  // Toast content for success (with checkmark SVG and animation)
  const SuccessToast = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <svg width="32" height="32" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
        <motion.path
          d="M4 12l6 6L20 6"
          initial={{ pathLength: 0, scale: 0.7 }}
          animate={{ pathLength: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
          fill="none"
          stroke="#00eaff"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span style={{ color: '#eaf6fb', fontWeight: 600, fontSize: '1.08rem' }}>Mensagem enviada com sucesso!</span>
    </div>
  );

  // Toast content for error (with shake animation)
  const ErrorToast = () => (
    <motion.div
      initial={{ x: 0 }}
      animate={{ x: [0, -10, 10, -8, 8, -4, 4, 0] }}
      transition={{ duration: 0.5 }}
      style={{ color: '#ff4d4f', fontWeight: 600, fontSize: '1.08rem' }}
    >
      Falha ao enviar. Tente novamente.
    </motion.div>
  );

  // Show toast notification on success/failure, with detailed logs and fallback UI
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setSending(true);

    // Log the submission attempt
    console.log("Submitting contact:", fields);
    try {
      // Defensive: check if emailjs.send is a function
      if (!emailjs || typeof emailjs.send !== 'function') {
        throw new Error('EmailJS is not loaded or send is not a function');
      }
      const templateParams = {
        from_name: fields.name,
        from_email: fields.email,
        message: fields.message,
        to_email: 'ja1zin23@gmail.com',
      };
      // Await the send promise and log the response
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_USER_ID
      );
      console.log("Response:", response);
      setSent(true);
      setFields({ name: '', email: '', message: '' });
      toast.success(<SuccessToast />, {
        position: 'bottom-right',
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
        theme: 'dark',
        style: {
          background: 'none',
          border: '2px solid #00eaff',
          boxShadow: '0 0 16px #00eaff55',
          borderRadius: 12,
        },
        transition: Slide,
      });
    } catch (error) {
      // Log the error for debugging
      console.error("Contact send error:", error);
      setError('');
      
      toast.error(<ErrorToast />, {
        position: 'bottom-right',
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
        theme: 'dark',
        style: {
          background: '#181c2a',
          border: '2px solid #ff4d4f',
          boxShadow: '0 0 16px #ff4d4f55',
          borderRadius: 12,
        },
        transition: Slide,
      });
    } finally {
      setSending(false);
    }
  };

  // Modal overlay for popup integration
  const ModalOverlay = styled(motion.div)`
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  // Floating contact button
  const FloatingButton = styled(motion.button)`
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 62px;
    height: 62px;
    border-radius: 50%;
    background: linear-gradient(135deg, #018894ff 60%, #000000ff 100%);
    box-shadow: 0 0 18px #058e9b7e, 0 0 0 2px #00eaff;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: none; 
    cursor: pointer;
    z-index:-1;
    outline: none;
    transition: box-shadow 0.3s;
    &:hover, &:focus {
      box-shadow: 0 0 32px #087680cc, 0 0 0 2px #01737eff;
    }
  `;

  // Email icon for floating button
  const EmailIcon = (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="4" fill="#23273a" />
      <text x="12" y="16" textAnchor="middle" fontSize="14" fontFamily="Fira Code, monospace" fill="#00eaff">@</text>
    </svg>
  );

  // Modal popup logic
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  // Close modal on overlay click
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget && onClose) onClose();
  }

  // Main render
  const formContent = (
    <GlassPanel
      as={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      ref={asModal ? modalRef : undefined}
      role={asModal ? 'dialog' : undefined}
      aria-modal={asModal ? 'true' : undefined}
      tabIndex={-1}
    >
      <Aura
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
      />
      <h2 style={{ fontFamily: 'Fira Code, monospace', fontWeight: 700, fontSize: '2.1rem', letterSpacing: 1, textAlign: 'center', marginBottom: 8 }}>Contact</h2>
      <AnimatePresence>
        {sent ? (
          <SuccessCard
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <Checkmark
              viewBox="0 0 24 24"
              initial={{ strokeDashoffset: 24 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.path
                d="M4 12l6 6L20 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6 }}
                fill="none"
                stroke="#04d7ebff"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </Checkmark>
            <SuccessMsg>Mensagem enviada com sucesso!</SuccessMsg>
            <ResetButton
              type="button"
              onClick={handleReset}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Enviar outra mensagem"
            >Enviar outra mensagem</ResetButton>
          </SuccessCard>
        ) : (
          <Form onSubmit={handleSubmit} aria-label="Contact form" noValidate>
            <FieldWrap
              whileFocus={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            >
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={fields.name}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                aria-label="Your name"
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              <Label
                htmlFor="name"
                focused={focus.name || fields.name}
                initial={{ color: '#b2c7d9' }}
                animate={{ color: (focus.name || fields.name) ? '#03eaffff' : '#b2c7d9' }}
                transition={{ duration: 0.3 }}
              >Name</Label>
              {errors.name && (
                <ErrorMessage
                  key="name"
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {errors.name}
                </ErrorMessage>
              )}
            </FieldWrap>
            <FieldWrap
              whileFocus={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            >
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={fields.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                aria-label="Your email"
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              <Label
                htmlFor="email"
                focused={focus.email || fields.email}
                initial={{ color: '#b2c7d9' }}
                animate={{ color: (focus.email || fields.email) ? '#0893a0ff' : '#b2c7d9' }}
                transition={{ duration: 0.3 }}
              >Email</Label>
              {errors.email && (
                <ErrorMessage
                  key="email"
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {errors.email}
                </ErrorMessage>
              )}
            </FieldWrap>
            <FieldWrap
              whileFocus={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            >
              <Textarea
                id="message"
                name="message"
                value={fields.message}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                aria-label="Your message"
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              <Label
                htmlFor="message"
                focused={focus.message || fields.message}
                initial={{ color: '#b2c7d9' }}
                animate={{ color: (focus.message || fields.message) ? '#00eaff' : '#b2c7d9' }}
                transition={{ duration: 0.3 }}
              >Message</Label>
              {errors.message && (
                <ErrorMessage
                  key="message"
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {errors.message}
                </ErrorMessage>
              )}
            </FieldWrap>
            <Button
              type="submit"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              whileTap={{ scale: 0.95, rotate: 2 }}
              aria-label="Send message"
              disabled={sending}
              style={{ opacity: sending ? 0.6 : 1 }}
              onMouseDown={handleButtonClick}
            >
              <Icon
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                initial={{ x: 0 }}
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 0.6 }}
              >
                <rect x="2" y="4" width="20" height="16" rx="4" fill="#000000ff" />
                <path d="M2 4l10 8 10-8" fill="none" stroke="#ffffff" strokeWidth="2" />
                <path d="M2 4l10 8 10-8" fill="none" stroke="#ffcc00" strokeWidth="1" strokeDasharray="4" />
              </Icon>
              Enviar agora
              <AnimatePresence>
                {rippleActive && (
                  <Ripple
                    initial={{ scale: 0.2, opacity: 0.7 }}
                    animate={{ scale: 1.2, opacity: 0 }}
                    exit={{ scale: 0.2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </AnimatePresence>
            </Button>
            {error && <div style={{ color: '#ff4d4f', marginTop: 10, textAlign: 'center' }}>{error}</div>}
          </Form>
        )}
      </AnimatePresence>
    </GlassPanel>
  );

  // Modal popup integration
  if (asModal) {
    return (
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {formContent}
      </ModalOverlay>
    );
  }

  // Floating contact button
  return (
    <Section id="contact">
      <ToastContainer
        limit={2}
        newestOnTop
        closeOnClick
        draggable
        pauseOnFocusLoss
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
      {formContent}
    
      <AnimatePresence>
        {showModal && (
          <ContactSection asModal onClose={closeModal} />
        )}
      </AnimatePresence>
    </Section>
  );
};

export default ContactSection;
export { ContactSection };

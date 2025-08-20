import React from 'react';
import styled, { keyframes } from 'styled-components';

const marqueeAnim = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  color: #eaf6fb;
  padding: 48px 0 32px 0;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
`;

const MarqueeWrap = styled.div`
  width: 100vw;
  overflow: hidden;
  position: relative;
  margin: 0 auto;
`;

const Marquee = styled.div`
  display: flex;
  width: 200%;
  animation: ${marqueeAnim} 18s linear infinite;
`;

const Testimonial = styled.div`
  min-width: 320px;
  max-width: 340px;
  margin: 0 24px;
  background: none;
  border-radius: 14px;
  box-shadow: 0 2px 12px #00eaff22;
  padding: 22px 18px 18px 18px;
  font-size: 1.04rem;
  color: #eaf6fb;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Client = styled.div`
  font-weight: 600;
  color: #00eaff;
  font-size: 1.01rem;
  margin-top: 8px;
`;

const testimonials = [
  { text: 'Amazing work! The animations and UI are top-notch.', client: 'Jane Doe, Acme Corp' },
  { text: 'Delivered our project on time with beautiful design.', client: 'John Smith, Beta LLC' },
  { text: 'Highly recommend for interactive web experiences.', client: 'Alice Lee, Gamma Inc.' },
  { text: 'Professional, creative, and detail-oriented.', client: 'Carlos M., Delta Studio' },
  { text: 'Our users love the new site. Thank you!', client: 'Sophie R., Omega Group' },
];

const TestimonialsSection = () => (
  <Section id="testimonials">
    <h2 style={{ fontFamily: 'Fira Code, monospace', fontWeight: 700, fontSize: '2.1rem', letterSpacing: 1 }}>Testimonials</h2>
    <MarqueeWrap>
      <Marquee>
        {[...testimonials, ...testimonials].map((t, i) => (
          <Testimonial key={i}>
            <span>"{t.text}"</span>
            <Client>— {t.client}</Client>
          </Testimonial>
        ))}
      </Marquee>
    </MarqueeWrap>
  </Section>
);

export { TestimonialsSection };

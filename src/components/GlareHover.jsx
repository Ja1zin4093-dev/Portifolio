import React from 'react';
import styled from 'styled-components';

const GlareHoverWrapper = styled.div`
  position: relative;
  overflow: hidden;
  display: inline-block;
  &:hover::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(0, 230, 255, 0.3) 0%, rgba(0, 230, 255, 0) 80%);
    opacity: 0.5;
    pointer-events: none;
    transform: scale(1.2);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
`;

const GlareHover = ({ children, ...props }) => {
  return <GlareHoverWrapper {...props}>{children}</GlareHoverWrapper>;
};

export default GlareHover;
import { createGlobalStyle } from 'styled-components';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/fira-code/400.css';

export const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.body};
    transition: background 0.4s, color 0.4s;
    overflow-x: hidden;
  }
  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.heading};
    font-family: ${({ theme }) => theme.fonts.code};
    letter-spacing: 0.01em;
  }
  code, pre {
    font-family: ${({ theme }) => theme.fonts.code};
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.heading};
    border-radius: 4px;
    padding: 0.2em 0.4em;
  }
  a {
    color: ${({ theme }) => theme.colors.neon};
    text-decoration: none;
    transition: color 0.2s;
    &:hover {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.heading};
  }
`;

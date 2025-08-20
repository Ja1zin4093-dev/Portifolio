import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from './theme/theme';
import { GlobalStyle } from './theme/GlobalStyle';
import App from './App.jsx';
import './i18n';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </StrictMode>,
);

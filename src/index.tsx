import React from 'react';
import ReactDOM from 'react-dom/client';
import { GlobalStyle } from './index.styles';
import { ThemeProvider } from 'styled-components'
import App from './App';

const theme = {
  yellow: '#FFF29B',
  dark: '#212529',
  gray: `#f1f1f1`,
  radius: '4px',
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

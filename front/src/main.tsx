import App from './App';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material';

export const hostname = 'k1r2p6';

const theme = createTheme({
  typography: {
    fontFamily: "monospace, sans-serif",
  },
});

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>,
);

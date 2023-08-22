import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material';
import connectRoutes from './routes/connectRoutes';
import App from './App';

const theme = createTheme({
  typography: {
    fontFamily: 'roboto',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Alegreya Sans SC", sans-serif',
          fontWeight: 'bold',
        },
      },
    },
  },

 
});

const RootComponent =
  window.location.pathname.includes('connection') ||
  window.location.pathname.includes('accountconnection') ||
  window.location.pathname.includes('oauthredirection')
    ? connectRoutes
    : App;

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <RootComponent />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>,
);

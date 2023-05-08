import * as React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom'

import './index.css'

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // <Provider store={store}>
    <BrowserRouter basename='/'>
      <App />
    </BrowserRouter>
  // </Provider>
)

import * as React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Login';
import Home from '../pages/Home';
import Chat from '../pages/Chat';
// import Game from '../pages/game';
import ConnectPage from '../components/Login/Connection';
import Profile from '../pages/Profile';

const AppRoutes: React.FC = () => (
  <Routes>
     <Route path='/' element={<Login />} />
     <Route path='/home' element={<Home />} />
     <Route path='/chat' element={<Chat />} />
     {/* <Route path='/game' element={<Game />} /> */}
     <Route path='/connection' element={<ConnectPage />} />
     <Route path='/profile' element={<Profile />} />
  </Routes>
);

export default AppRoutes;
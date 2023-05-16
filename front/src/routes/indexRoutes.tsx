import * as React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Login';
import Home from '../pages/Home';
import Chat from '../pages/Chat';
import Friends from '../pages/Friends';
import Game from '../pages/Game';
import ConnectPage from '../components/Login/Connection';
import Test from '../pages/Test';
import Profile from '../pages/Profile';

const AppRoutes: React.FC = () => (
  <Routes>
     <Route path='/' element={<Login />} />
     <Route path='/home' element={<Home />} />
     <Route path='/chat' element={<Chat />} />
     <Route path='/friends' element={<Friends />} />
     <Route path='/game' element={<Game />} />
     <Route path='/connection' element={<ConnectPage />} />
     <Route path='/test' element={<Test />} />
     <Route path='/profile' element={<Profile />} />
  </Routes>
);

export default AppRoutes;
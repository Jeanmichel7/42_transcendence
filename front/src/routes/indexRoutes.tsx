import * as React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from '../scenes/Login';
import Home from '../scenes/Home';
import Chat from '../components/Chat/chat';
import Friends from '../scenes/Friends';
import Game from '../scenes/Game';
import ConnectPage from '../components/Login/Connection';
import Test from '../components/Chat/test';
import Profile from '../scenes/Profile';

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
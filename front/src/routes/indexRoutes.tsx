import * as React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Login';
import Home from '../pages/Home';
import Chat from '../pages/Chat';
import Account from '../pages/Account'
// import Game from '../pages/game';
import ConnectPage from '../pages/Connection';
import Profile from '../pages/Profile';
import Error404 from '../pages/Error404';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path='/' element={<Login />} />
    <Route path='/home' element={<Home />} />
    <Route path='/chat' element={<Chat />} />
    <Route path='/connection' element={<ConnectPage />} />
    <Route path='/profile/:pseudo' element={<Profile />} />
    <Route path='/account' element={<Account />} />
    <Route path='*' element={<Error404 />} />
  </Routes>
);

export default AppRoutes;
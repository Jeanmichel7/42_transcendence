import * as React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Login';
import Home from '../pages/Home';
import Chat from '../pages/Chat';
import Account from '../pages/Account';
import Pong from '../pages/Pong';
import ConnectPage from '../pages/Connection';
import FakeConnection from '../pages/ConnectionFakeUser';
import Profile from '../pages/Profile';
import Error404 from '../pages/Error404';
import FriendsPage from '../pages/Friends';


const AppRoutes: React.FC = () => (
  <Routes>
    <Route path='/' element={<Login />} />
    <Route path='/game' element={<Pong />} />
    <Route path='/home' element={<Home />} />
    <Route path='/chat' element={<Chat />} />
    <Route path='/friends' element={<FriendsPage />} />
    <Route path='/connection' element={<ConnectPage />} />
    <Route path='/fakeconnection' element={<FakeConnection />} />
    <Route path='/profile/:pseudo' element={<Profile />} />
    <Route path='/account' element={<Account />} />
    <Route path='*' element={<Error404 />} />
  </Routes>
);

export default AppRoutes;
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
import CreateGroupInterface from '../components/Chat/ConversationList/ChannelCreateInterface';
import ChannelSearch from '../components/Chat/ConversationList/ChannelSearchInterface';
import FriendsSearch from '../components/Chat/ConversationList/FriendsSearchInterface';
import ConversationWrapper from '../components/Chat/ConversationWrapper';
import InvitationWrapper from '../components/Chat/Channel/InvitationWrapper';
import LeaderBoard from '../pages/LeaderBoard';

const HomeChat = () => {
  return (
    <div className="w-full h-full flex justify-center items-center text-2xl text-gray-500">
      Select a user or a room to start a conversation
    </div>
  );
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path='/' element={<Login />} />
    <Route path='/game' element={<Pong />} />
    <Route path='/home' element={<Home />} />
    <Route path='/chat' element={<Chat />} >
      <Route index element={<HomeChat />} />
      <Route path='conv/:convId/:id/:login' element={<ConversationWrapper />} />
      <Route path='channel/:convId/:id/:name' element={<ConversationWrapper />} />
      <Route path='channel/invitation/:channelId/:channelName' element={<InvitationWrapper />} />
      <Route path='addFriends' element={<FriendsSearch />} />
      <Route path='createChannel' element={<CreateGroupInterface />} />
      <Route path='addChannels' element={<ChannelSearch />} />
      <Route path='*' element={<HomeChat />} />
    </Route>
    <Route path='/leaderboard' element={<LeaderBoard />} />
    <Route path='/friends' element={<FriendsPage />} />
    <Route path='/connection' element={<ConnectPage />} />
    <Route path='/fakeconnection' element={<FakeConnection />} />
    <Route path='/profile/:pseudo' element={<Profile />} />
    <Route path='/account' element={<Account />} />
    <Route path='*' element={<Error404 />} />
  </Routes>
);

export default AppRoutes;
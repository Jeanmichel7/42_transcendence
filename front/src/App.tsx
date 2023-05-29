import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Chat from './components/Chat/chat';
import Firstpage from './pages/loginPage';
import Friends from './pages/friends';
import PongPage from './pages/gamePage';
import Home from './pages/home';
import ConnectPage from './components/connectPage';
import Test from './components/test';

function App() {
  return (
    <div>
      <Routes>
        {/* hiiiiiiiii	 */}
        <Route path="/" element={<Firstpage />}>
          {' '}
        </Route>
        <Route path="/home" element={<Home />}>
          {' '}
        </Route>
        <Route path="/chat" element={<Chat />}>
          {' '}
        </Route>
        <Route path="/friends" element={<Friends />}>
          {' '}
        </Route>
        <Route path="/GamePage" element={<PongPage />}>
          {' '}
        </Route>
        <Route path="/connection" element={<ConnectPage />}>
          {' '}
        </Route>
        <Route path="/test" element={<Test />}>
          {' '}
        </Route>
      </Routes>
    </div>
  );
}
export default App;

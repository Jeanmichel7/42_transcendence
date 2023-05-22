import React from 'react';
import Navbar from '../components/navbar';
import Game from '../components/game';

function GamePage() {
  return (
    <div>
      <Navbar />
      <Game />
      <h1 className="text-center m-10">Here is the game room</h1>
    </div>
  );
}

export default GamePage;

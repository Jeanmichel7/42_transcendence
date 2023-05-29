import React from 'react';
import Navbar from '../components/navbar';
import Pong from '../components/pong';

function PongPage() {
  return (
    <div>
      <Navbar />
      <Pong />
      <h1 className="text-center m-10">Here is the game room</h1>
    </div>
  );
}

export default PongPage;

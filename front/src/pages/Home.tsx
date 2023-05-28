
import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className=" h-full w-full" style={{ backgroundColor: '#1B262C' }}>
      <span className=" w-3/4 h-2/3 items-center justify-center flex">
        <div>
          <img src='/pong.png' width='500px' />
        </div>
        <div>
          <Link to="/Game" className="play-button" style={{ color: '#FDFFFC', backgroundColor: '#FF6B00', padding: '10px', borderRadius: '5px' }}>CLICK TO PLAY!</Link>
        </div>
      </span>
    </div>
  )
}

export default Home;


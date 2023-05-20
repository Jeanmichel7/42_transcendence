import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className=" h-full w-full bg-[#1e1e4e]">
      <span className=" w-3/4 h-2/3 items-center justify-center flex">
        <div className="  " >
          <img src='/pong.png' width='500px' />
        </div>
        <div className="" >
          <Link to="/Game" className="play-button">CLICK TO PLAY !</Link>
        </div>
      </span>
    </div>
  )
}
export default Home
import React from 'react'
import Navbar from './navbar'
import {Link} from 'react-router-dom'
import SideBar from './sidebar'

function Home() {
  return (

    <div className=" h-screen w-screen bg-[#1e1e4e]">
      <Navbar />
      <SideBar />  

        <span className=" w-3/4 h-2/3 items-center justify-center flex">
          <div className="  " >
            <img src='/pong.png' width='500px'/>
          </div>
          <div className="" >
            <Link to="/Game" className="play-button">CLICK TO PLAY !</Link>
          </div>
        </span>

    </div>

  )
}
export default Home
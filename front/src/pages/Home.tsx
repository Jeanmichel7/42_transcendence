import React, { useEffect, useState } from 'react'
import Navbar from '../components/Header/Header'
import { Link } from 'react-router-dom'
import SideBar from '../components/SideBar'
import axios from 'axios';

function Home() {
  const [userProfile, setUserProfile] = useState<any>(null);

  return (
    <div className="items-center justify-center flex">
      <img src='/pong.png' width='500px'/>
      <Link to="/Game" className="play-button">CLICK TO PLAY !</Link>
    </div>
  )
}
export default Home
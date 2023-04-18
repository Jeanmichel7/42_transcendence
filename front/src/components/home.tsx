import React, { useEffect, useState } from 'react'
import Navbar from './navbar'
import { Link } from 'react-router-dom'
import SideBar from './sidebar'
import axios from 'axios';

function Home() {

  async function fetchUserProfile() {
    const userId = 1
    const response = await axios.get(`http://localhost:3000/users/${userId}/profileById`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });

    if (response) {
      return response.data
    }
  }


  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    async function fetchAndSetUserProfile() {
      try {
        const userProfileData = await fetchUserProfile();
        setUserProfile(userProfileData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }

    fetchAndSetUserProfile();
  }, []);

  const token = document.cookie.split(";").map(e=> [e.split('=')[0], e.split('=')[1]]).filter(e=> e[0] === ' jwt')[0][1]
  console.log("token : ", token)

  return (

    <div className=" h-screen w-screen bg-[#1e1e4e]">
      <Navbar />
      <SideBar />

      <span className=" w-3/4 h-2/3 items-center justify-center flex">
        <div className="  " >
          <p> user data : 
            {userProfile? 
            <ul>
              <li> { userProfile.login }  </li> 
              <li> { userProfile.email } </li> 
              <li> { userProfile.firstName } </li> 
            </ul>
            : "aie probleme"}
          </p>
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
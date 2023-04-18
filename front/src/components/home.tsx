import React, { useEffect, useState } from 'react'
import Navbar from './navbar'
import { Link, useLoaderData } from 'react-router-dom'
import SideBar from './sidebar'
import axios from 'axios';

type user ={
  login:string
  email:string
  firstName:string
}

function Home() {
  const [userProfile, setUserProfile] = useState<user | null>(null);

  async function getUserProfile() {
    const userId = 1;
    const response = await axios.get(`http://localhost:3000/users/${userId}/profileById`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    return response.data;
  }
  
  async function fetchData() {
    let userProfileData = await getUserProfile();
    setUserProfile(userProfileData);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className=" h-screen w-screen bg-[#1e1e4e]">
      <Navbar />
      <SideBar />

      <span className=" w-3/4 h-2/3 items-center justify-center flex">
        <div className="  " >
          <p> user data : 
            {userProfile ?
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
  );
}
export default Home
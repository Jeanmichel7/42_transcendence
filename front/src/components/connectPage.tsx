import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import SideBar from './sidebar';
import { Link } from 'react-router-dom';

function ConnectPage() {

  // async function fetchUserProfile() {
  //   const response = await fetch('http://localhost:3000/users/1/profile', {
  //     credentials: 'include', // S'assurer que les cookies sont inclus dans la requête
  //   });
  
  //   if (response.ok) {
  //     const data = await response.json();
  //     return data;
  //   } else {
  //     throw new Error('Failed to fetch user profile');
  //   }
  // }

  
  // const [userProfile, setUserProfile] = useState(null);

  // useEffect(() => {
  //   async function fetchAndSetUserProfile() {
  //     try {
  //       const userProfileData = await fetchUserProfile();
  //       setUserProfile(userProfileData);
  //     } catch (error) {
  //       console.error('Error fetching user profile:', error);
  //     }
  //   }

  //   fetchAndSetUserProfile();
  // }, []);

  let is2FAactiv = false;
  const token = document.cookie.split(";").map(e=> [e.split('=')[0], e.split('=')[1]]).filter(e=> e[0] === 'jwt' || e[0] === ' jwt')[0][1]
  if (token === "need2FA" ) { 
    is2FAactiv = true;   } 
  else {
    localStorage.setItem("accessToken", token) // c'est lui qui sauvegarde le token
    window.location.href = "/home";           // et ca redirige
  }
  console.log("token : ", token)



  async function send2FA() {
    const code2FA:any = document.getElementById('2fapassword').value;
    console.log("code2FA : ", code2FA)
    const response = await axios.post('http://localhost:3000/auth/login2fa', {
      code: code2FA,
      userId: 1
    });
    if (response.status == 200) {
      localStorage.setItem("accessToken", response.data.accessToken)
      window.location.href = "/home";                               
    }
    else {
      console.log(response.data)
    }
  }


  return (

    <div className=" h-screen w-screen bg-[#1e1e4e]">
      <Navbar />
      <SideBar />

      <div className=" w-3/4 h-2/3 items-center justify-center flex">
        {is2FAactiv? (
          <section>
            <p>2FA authentification</p>
            <input type="text" id="2fapassword" name="2fapassword" placeholder="Code"/>
            <button onClick={send2FA}>Send</button>
          </section>
        ) : (
          <section>
            <p> Felicitiation tu es connectes !</p>
          </section>
        )}
      </div>

    </div>

  );
}

export default ConnectPage;
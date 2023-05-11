
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import SideBar from './sidebar';
import { Link } from 'react-router-dom';

function ConnectPage() {

  const [is2FAactiv, setIs2FAactiv] = useState(false);
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    async function fetchAndSetIs2FAactiv() {
      try {
        const res = await check2FACookie();
        if(res.is2FAactived) {
          console.log("is2FAactived")
          setIs2FAactiv(res.is2FAactived);
          setUserId(res.userId);
        }
        else {
          console.log("is2FAactived not activated")
          window.location.href = "/home";
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }

    fetchAndSetIs2FAactiv();
  }, []);

  async function check2FACookie() {
    console.log("check2FACookie")
    const res = await axios.get('http://localhost:3000/auth/check-2FA', {
      withCredentials: true,
    });
    console.log("response : ", res)
    if (res.status == 200) {
      return res.data;
    } else {
      throw new Error('Failed to fetch user profile');
    }
  }

  async function send2FA() {
    const code2FAElement = document.getElementById('2faCode') as HTMLInputElement | null;
    if(!code2FAElement)
      return;
    const body = {
      code: code2FAElement.value,
      userId: userId
    }
    console.log("body : ", body)
    const response = await axios.post('http://localhost:3000/auth/login2fa', body, {
      withCredentials: true
    });

    console.log("response : ", response)
    if (response.status === 200) {
      window.location.href = "/home";
    }
    else {
      // wrong code
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
            <input type="text" id="2faCode" name="2faCode" placeholder="Code"/>
            <button onClick={send2FA}>Send</button>
          </section>
        ) : ""}
      </div>

    </div>

  );
}

export default ConnectPage;



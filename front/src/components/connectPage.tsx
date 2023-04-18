
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function ConnectPage() {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('accessToken');
    if (token) {
      setAccessToken(token);
      console.log("token : ", token)
      localStorage.setItem("accessToken", token);
      //redirection ailleur
    }
  }, []);

  async function getUser() {
    const userLogin = 'jrasser843';
    const response = await axios.get(`http://localhost:3000/users/${userLogin}/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        
      }
    }
    )
    if (response.status == 200) {
      console.log(response.data)
    }
  }

  return (
    <div className=" h-screen w-auto flex items-center justify-center bg-[#1e1e4e]">

      <span className="hello">
        <div className="m-6 text-center font-bold ">
          <p className="text-[#f84aab] font-Dance text-6xl drop-shadow-2xl " >Welcome to</p>
          <p className="text-[#09d9f0] font-Bungee text-8xl">PONG</p>
        </div>

        <div className="m-6 text-center text-white font-mono border-double border-4 rounded-xl border-[#f4fa22]" >
          <button onClick={getUser}>Test get user</button>
        </div>

        {accessToken ? (
          <p>Token d'accès: {accessToken}</p>
        ) : (
          <p>Utilisateur non authentifié</p>
        )}

      </span>

    </div>

  );
}

export default ConnectPage;
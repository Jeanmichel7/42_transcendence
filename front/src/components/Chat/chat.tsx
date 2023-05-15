import React from 'react'
import Navbar from '../navbar'
import SideBar from '../sidebar'
import {useState, useEffect} from 'react'
import ButtonNewChannel from './ButtonNewChannel'
import ButtonUser from './ButtonUser'
import ChatRoom from './ChatRoom'
import axios from 'axios'

function Chat() {

  let [userData, setUserData] = useState<any>();
  let [MpData, setMpData] = useState<any>();
  /* Ajouter variable pour les rooms(mp) */

  async function getData () {
    const response = await axios.get('http://localhost:3000/users/all', {
      withCredentials: true,
    });
    return response.data;
  }
 async function fetchData() {
    let userProfileData = await getData();
   /* console.log(userProfileData) */
    setUserData(userProfileData);
  }
 useEffect(() => {
    fetchData();
  }, []);

  async function getMpData () {
    const response = await axios.get('http://localhost:3000/messages/', {
      withCredentials: true,
    });
    return response.data;
  }
 async function fetchMpData() {
    let MpData = await getMpData();
/*    console.log(MpData) */
    setMpData(MpData);
  }
 useEffect(() => {
    fetchMpData();
  }, []);

/* Faire les deux fonction au dessus pour requete messages */
 
  if (!userData || userData.length === 0) {
    return <div className=' h-screen flex items-center justify-center'>Loading...</div>;
  }

  return (
     <div className=" h-screen w-screen bg-[#1e1e4e] ">
        <Navbar />
        <SideBar />

        <div className=" h-5/6 w-11/12 items-center justify-center flex" >
            <div className='relative h-5/6 w-11/12  border rounded-xl shadow-lg bg-white items-center '>
              <ButtonNewChannel userData={userData}/>
              <ButtonUser userData={userData} />
              <ChatRoom MpData={MpData} />
            </div> 

        </div>
    </div>
  )
}
export default Chat
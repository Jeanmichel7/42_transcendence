import React from 'react'
import Navbar from '../navbar'
import SideBar from '../sidebar'
import {useState, useEffect} from 'react'
import ButtonNewChannel from './ButtonNewGroup'
import ButtonUser from './ButtonAddFriends'
import ChatFriends from './ChatFriends'
import axios from 'axios'
import ButtonNewGroup from './ButtonNewGroup'
import ChatGroup from './ChatGroup'
import ButtonAddFriends from './ButtonAddFriends'

function Chat() {

  let [userData, setUserData] = useState<any>();
  let [MpData, setMpData] = useState<any>();

/* requete pour avoir userData */
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

/* Requete pour avoir MpData */
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

  /* Check si userData n'est pas vide */
  if (!userData || userData.length === 0) {
    return <div className=' h-screen flex items-center justify-center'>Loading...</div>;
  }

  console.log('Coucou', userData)

  return (
     <div className=" h-screen w-screen bg-[#1e1e4e] ">
        <Navbar />
        <SideBar />

        <div className=" h-5/6 w-11/12 items-center justify-center flex" >
            <div className='relative h-5/6 w-11/12  border rounded-xl shadow-lg bg-white items-center '>
              <ButtonNewGroup userData={userData}/>
              <ChatGroup />
              <ButtonAddFriends userData={userData} />
              <ChatFriends MpData={MpData} />
            </div> 

        </div>
    </div>
  )
}
export default Chat
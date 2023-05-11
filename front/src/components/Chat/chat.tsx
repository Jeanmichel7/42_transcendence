import React from 'react'
import Navbar from '../navbar'
import SideBar from '../sidebar'
import {useState, useEffect} from 'react'
import ButtonNewChannel from './ButtonNewChannel'
import ButtonUser from './ButtonUser'
import ChatRoom from './ChatRoom'
import axios from 'axios'

function Chat() {

// il faudrait certainement ajouter une map ici avec tous les differents chatroom pour ensuite les envoyer a 'ChatRoom' pour les afficher.

  let [userData, setUserData] = useState<any>();

  async function getData () {
    const response = await axios.get('http://localhost:3000/users/all', {
      withCredentials: true,
    });
    return response.data;
  }

 async function fetchData() {
    let userProfileData = await getData();
    setUserData(userProfileData);
  }

  useEffect(() => {
    fetchData();
  }, []);

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
              <ChatRoom />
            </div> 

        </div>
    </div>
  )
}
export default Chat
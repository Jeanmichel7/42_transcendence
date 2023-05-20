import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import { Link } from 'react-router-dom';
import SideBar from './sidebar';
import axios from 'axios';
import io from 'socket.io-client';


function Test() {
  const [userProfile, setUserProfile] = useState<any>(null);

  async function fetchUserProfile() {
    const userId = 4;
    const response = await axios.get(`http://localhost:3000/users/${userId}/profileById`, {
      withCredentials: true,
    });
    if (response.status === 200) return response.data;
    else throw new Error('Failed to fetch user profile');
  }

  useEffect(() => {
    async function fetchAndSetUserProfile() {
      try {
        const userProfileData = await fetchUserProfile();
        setUserProfile(userProfileData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    // fetchAndSetUserProfile();
  }, []);

  const PrivateChat = () => {
    const [socketEvent1, setSocketEvent1] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput1, setMessageInput1] = useState('');

    const token = 'YOUR_TOKEN_HERE';
    const userIdDest = '1';

    const joinRoom1 = (userIdDest) => {
      const socketEvent1 = io(`http://localhost:3000/messagerie`, {
        reconnectionDelayMax: 10000,
        // auth: {
        //   token: token,
        // },
        // cors: {
        //   origin: 'http://localhost:3000',
        //   methods: ['GET', 'POST'],
        //   credentials: true,
        // },
      });

      //connect to room
      socketEvent1.emit('joinPrivateRoom', { user1Id: 1, user2Id: userIdDest });

      socketEvent1.on('message', (message, id) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          `${message.text} by ${message.ownerUser.login}`,
        ]);
      });
    };

    const sendMessage1 = (userIdDest) => {
      axios.post(
        'http://localhost:3000/messages/users/' + userIdDest + '/send',
        {
          text: messageInput1,
        },
        {
          withCredentials: true,
        }
      );
    };

    return (
      <div>
        <h3>Messagerie user id 2 - jrasser</h3>
        <button className=' bg-white rounded-xl boder-2  p-2' onClick={() => joinRoom1(userIdDest)}>Join private room</button>
        <br />
        <br />
        <div id="Form1">
          <input
            type="text"
            value={messageInput1}
            // set input value into messageinput1
            onChange={(e) => setMessageInput1(e.target.value)}
          />
          <button onClick={() => sendMessage1(userIdDest)}>Send</button>
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen bg-[#1e1e4e]">
      <Navbar />
      <SideBar />

      <span className="w-3/4 h-2/3 items-center justify-center flex">
        <PrivateChat />
      </span>
    </div>
  );
}

export default Test;
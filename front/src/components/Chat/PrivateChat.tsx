import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

export default function PrivateChat() {
  const [socketEvent1, setSocketEvent1] = useState(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput1, setMessageInput1] = useState('');

  const userIdDest = 2;

  const joinRoom1 = (userIdDest: Number) => {
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

  const sendMessage1 = (userIdDest: Number) => {
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
      <button onClick={() => joinRoom1(userIdDest)}>Join private room</button>
      <br />
      <br />
      <div id="Form1">
        <input
          type="text"
          value={messageInput1}
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
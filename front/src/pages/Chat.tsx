import { useState } from 'react'
import ButtonNewGroup from '../components/Chat/ButtonNewGroup'
// import ChatRoom from '../components/Chat/ChatRoom'
import Friends from '../components/Friends/Friends'
import Chats from '../components/Chat/DisplayChat'
import Conversation from '../components/Chat/Conversation'
import ButtonAddFriends from '../components/Friends/ButtonAddFriends'
import { AddFriends } from '../components/Friends/ButtonAddFriends'
import { ButtonNewGroup2 } from '../components/Chat/ButtonNewGroup'


function Chat() {
  const [currentChatUser, setCurrentChatUser] = useState({ id: -1 });
  const [serviceToCall, setServiceToCall] = useState('chat');

  return (
    <div className="
      h-[calc(100vh-320px)]
      flex justify-center items-stretch
      border rounded-xl shadow-lg bg-[#F2F2FF] 
      text-indigo-900 p-5"
    >
      <div className="w-1/4 flex flex-col h-full">
        <ButtonAddFriends 
          setServiceToCall={ setServiceToCall }
        />
        <ButtonNewGroup 
          setServiceToCall={ setServiceToCall }
        />
        <Friends
          setServiceToCall={ setServiceToCall }
          currentChatUser={currentChatUser}
          setCurrentChatUser={setCurrentChatUser}
        />
        <Chats
         setServiceToCall={ setServiceToCall }
         currentChatUser={currentChatUser}
         setCurrentChatUser={setCurrentChatUser} 
        />
      </div>

      <div className="w-3/4 h-full">
      {
        serviceToCall === 'chat' &&
        <Conversation user={currentChatUser} />
      }
      {
        serviceToCall === 'addFriends' &&
        <AddFriends />
      }

      { serviceToCall === "ButtonNewGroup2" && 
        <ButtonNewGroup2 /> 
      }

      </div>

    </div>
  )
}
export default Chat
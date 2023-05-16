import { useState } from 'react'
import ButtonNewChannel from '../components/Chat/ButtonNewChannel'
import ButtonUser from '../components/Chat/ButtonUser'
import ChatRoom from '../components/Chat/ChatRoom'
import Friends from '../components/Chat/Friends'
import Conversation from '../components/Chat/Conversation'


function Chat() {
  const [currentChatUser, setCurrentChatUser] = useState({ id: -1 });

  return (
    <div className="
      h-[calc(100vh-320px)] flex justify-center items-stretch
      border rounded-xl shadow-lg bg-[#F2F2FF] 
      text-indigo-900 p-5"
    >
      <div className="w-1/4 flex flex-col h-full">
        <Friends
          currentChatUser={currentChatUser}
          setCurrentChatUser={setCurrentChatUser}
        />
        <ButtonNewChannel />
        <ButtonUser />
        <ChatRoom />
      </div>

      <div className="w-3/4 h-full">
        <Conversation user={currentChatUser} />
      </div>

    </div>
  )
}
export default Chat
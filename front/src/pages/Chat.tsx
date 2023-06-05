import { useState } from 'react';
import ButtonNewGroup from '../components/Chat/ButtonNewGroup';
// import ChatRoom from '../components/Chat/ChatRoom';
import Friends from '../components/Friends/Friends';
import Conversation from '../components/Chat/Conversation';
import ButtonAddFriends, { AddFriends } from '../components/Friends/ButtonAddFriends';
import { UserInterface } from '../types';

function Chat() {
  const [serviceToCall, setServiceToCall] = useState<string>('chat');
  const [currentChatUser, setCurrentChatUser] = useState<UserInterface>({
    id: -1,
    login: '',
    email: '',
    firstName: '',
    lastName: '',
    status: 'offline',
    avatar: '',
    description: '',
    is2FAEnabled: false,
    friends: [],
    userBlocked: [],
  });

  return (
    <div className="
      h-[calc(100vh-320px)]
      flex justify-center items-stretch
      border rounded-xl shadow-lg bg-[#F2F2FF] 
      text-indigo-900 p-5"
    >
      <div className="w-1/4 flex flex-col h-full">
        <ButtonNewGroup  />
        <ButtonAddFriends 
          setServiceToCall={ setServiceToCall }
        />
        <Friends
          setServiceToCall={ setServiceToCall }
          currentChatUser={currentChatUser}
          setCurrentChatUser={setCurrentChatUser}
        />
        {/* <ChatRoom /> */}
      </div>

      <div className="w-3/4 h-full">
      { serviceToCall === 'chat' &&
        <Conversation {...currentChatUser} />
      }
      { serviceToCall === 'addFriends' &&
        <AddFriends />
      }
      </div>
    </div>
  );
}
export default Chat;
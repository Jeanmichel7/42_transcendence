import { useEffect, useState } from 'react';
import ButtonNewGroup from '../components/Chat/ButtonNewGroup';
// import ChatRoom from '../components/Chat/ChatRoom';
import Friends from '../components/Chat/Friends/FriendsRaw';
import Conversation from '../components/Chat/Conversation';
import ButtonInterfaceAddFriends from '../components/Chat/Friends/FriendsSearchButton';
import FriendsSearch from '../components/Chat/Friends/FriendsSearch';

import { useLocation } from 'react-router-dom';

function Chat() {
  const location = useLocation();
  const [serviceToCall, setServiceToCall] = useState<string>('chat');
  const [currentChatUserId, setCurrentChatUserId] = useState<number>(-1);

  //check query params
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const serviceParam = query.get('service');
    const userIdParam = query.get('userId');
    
    if (serviceParam === 'chat' && userIdParam) {
      console.log('params : ', serviceParam, userIdParam);
      setCurrentChatUserId(parseInt(userIdParam));
    }
  }, [location.search]);

  return (
    <div className={
      //  serviceToCall !== 'chat' ? 'h-[calc(100vh-320px)]' : '' +
      `h-[calc(100vh-320px)] flex justify-center items-stretch
      border rounded-xl shadow-lg bg-[#F2F2FF] 
      text-indigo-900 p-2`}
    >
      <div className="w-1/4 flex flex-col h-full">
        <ButtonNewGroup  />
        <ButtonInterfaceAddFriends 
          setServiceToCall={ setServiceToCall }
        />
        <Friends
          setServiceToCall={ setServiceToCall }
          currentChatUserId={currentChatUserId}
          setCurrentChatUserId={setCurrentChatUserId}
        />
        {/* <ChatRoom /> */}
      </div>

      <div className="w-3/4 h-full">
      { serviceToCall === 'chat' &&
        <Conversation 
          key={ currentChatUserId }
          id={ currentChatUserId }
         />
      }
      { serviceToCall === 'addFriends' &&
        <FriendsSearch />
      }
      </div>
    </div>
  );
}
export default Chat;
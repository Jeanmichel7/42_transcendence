import { useEffect, useState } from 'react';
import ConversationList from '../components/Chat/ConversationList/ConversationList';
import PrivateConversation from '../components/Chat/Conversation/PrivateConversation';
import ButtonInterfaceAddFriends from '../components/Chat/Friends/FriendsSearchButton';
import FriendsSearch from '../components/Chat/Friends/FriendsSearchInterface';

import { useLocation } from 'react-router-dom';
import { ButtonCreateGroup, ButtonInterfaceAddGroups } from '../components/Chat/Channel/ChannelButtons';
import CreateGroupInterface from '../components/Chat/Channel/ChannelCreateInterface';
import { Divider } from '@mui/material';
import ChannelSearch from '../components/Chat/Channel/ChannelSearchInterface';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

function Chat() {
  const location = useLocation();
  const [ serviceToCall, setServiceToCall ] = useState<string>('none');
  const [ convSelectedId, setConvSelectedId ] = useState<number>(-1);
  const { conversationsList } = useSelector((state: RootState) => state.chat);


  //check query params
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const serviceParam = query.get('service');
    const userIdParam = query.get('userId');
    
    if (serviceParam === 'privateConversation' && userIdParam) {
      console.log('params : ', serviceParam, userIdParam);

      // check type room ou user
      // setConvSelected( ???
      //    parseInt(userIdParam),
      // );
    }
  }, [location.search]);

  // useEffect(() => {
  //   console.log('serviceToCall : ', serviceToCall);
  //   console.log('convSelectedId : ', convSelectedId);
  //   console.log('conversationsList : ', conversationsList);
  //   console.log('conversationsList[convSelectedId] : ', conversationsList[convSelectedId]);
  // }, [ convSelectedId]);


  return (
    <div className='h-full flex justify-center bg-[#F2F2FF]'>
      <div className="flex flex-col h-full bg-[#e5e5f2]">
          <ButtonCreateGroup 
            setServiceToCall={ setServiceToCall }
          />
        <div className="flex justify-center items-center">
          <ButtonInterfaceAddGroups 
            setServiceToCall={ setServiceToCall }
          />
          <ButtonInterfaceAddFriends 
            setServiceToCall={ setServiceToCall }
          />
        </div>
        <ConversationList
          setServiceToCall={ setServiceToCall }
          // currentChatUserId={currentChatUserId}
          setConvSelectedId={setConvSelectedId}
        />
      </div>

      <Divider orientation="vertical" flexItem />

      <div className="flex-grow h-full">
        { serviceToCall === 'privateConversation' && convSelectedId !== -1 &&
          <PrivateConversation
            key={ conversationsList[convSelectedId].id }
            id={ conversationsList.find(conv => conv.id === convSelectedId)?.user.id || -1 }
          />
        }
        { serviceToCall === 'channelConversation' &&
          <p>Channel Conversation</p>
          // <ChannelConversation />
        }
        { serviceToCall === 'addFriends' &&
          <FriendsSearch />
        }
        { serviceToCall === 'createChannel' &&
          <CreateGroupInterface />
        }
        { serviceToCall === 'addChannels' &&
          <ChannelSearch />
        }
        {/* { serviceToCall === 'none' &&
          <p>Home</p>
        } */}
      </div>
    </div>
  );
}
export default Chat;
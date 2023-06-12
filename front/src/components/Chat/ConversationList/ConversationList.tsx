// import {  useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { RootState } from '../../../store';
import ConversationListUserItem from './ConversationListItemUser';
import { ConversationInterface } from '../../../types';
// import { useEffect } from 'react';
import { isRoomInterface, isUserInterface } from '../../../utils/utils';
import ConversationListRoomItem from './ConversationListItemRoom';

interface ConvProps {
  setServiceToCall: React.Dispatch<React.SetStateAction<string>>;
  setConvSelectedId: React.Dispatch<React.SetStateAction<number>>;
}

const ConversationList: React.FC<ConvProps> = ({ 
  setServiceToCall,
  setConvSelectedId,
}) => {
  const { conversationsList } = useSelector((state: RootState) => state.chat);

  // useEffect(() => {
  //   console.log('convs : ', conversationsList);
  // }, [conversationsList]);

  if (!conversationsList) {
    return <CircularProgress />;
  }

  return (
    <>
      <div className='w-full text-center transition-all overflow-auto  max-h-[calc(100vh-180px)]'>
        {conversationsList.length === 0 ?
          <p className="text-center">No friends yet</p>
          :
          conversationsList.map((conv: ConversationInterface) => {
            if ( isUserInterface(conv.user)) {
              return (
                <ConversationListUserItem
                  key={conv.id}
                  conv={conv}
                  setConvSelectedId={setConvSelectedId}
                  setServiceToCall={setServiceToCall}
                />
              );
            } else if ( isRoomInterface(conv.room)) {
              return (
                <ConversationListRoomItem 
                  key={conv.id}
                  conv={conv}
                  setConvSelectedId={setConvSelectedId}
                  setServiceToCall={setServiceToCall}
                />
              );
            } else {
              return (<p> WTF ?!</p>);
            }
          })}
      </div>
    </>
  );
};

export default ConversationList;
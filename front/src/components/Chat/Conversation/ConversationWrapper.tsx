import { useParams, useLocation } from 'react-router-dom';
import PrivateConversation from './PrivateConversation';
import ChannelConversation from './ChannelConversation';
import { useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useConnectionSocketChat } from './useSocketChat';
import { CircularProgress } from '@mui/material';

const ConversationWrapper = () => {
  const { convId, login, name } = useParams();
  const { userData } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (login || userData.id == -1) return;
    // console.log('socketRef.current : ', socketRef.current)
    if (!socketRef.current || !socketRef.current.connected) {
      console.log('connect socket channel : ');
      const socket: Socket = io('http://localhost:3000/chat', {
        reconnectionDelayMax: 10000,
        withCredentials: true,
      });
      socketRef.current = socket;
    }
    return () => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.id]);

  useConnectionSocketChat(
    socketRef?.current,
    userData.id,
    parseInt(convId as string),
  );

  useEffect(() => {
    console.log('location state : ', location.state);
  }, [location.state]);

  
  return (
    <>
      { login && <PrivateConversation key={convId} /> }
      { name && socketRef && socketRef.current && socketRef.current.connected ?
        <ChannelConversation
          key={convId}
          conv={location.state}
          socketRef={socketRef as React.MutableRefObject<Socket>}
        />
        :
        <div className='relative w-full h-full'>
          <CircularProgress sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
          }}/>
        </div>
      }
    </>
  );
};

export default ConversationWrapper;

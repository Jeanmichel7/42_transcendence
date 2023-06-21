import { useParams, useLocation } from 'react-router-dom';
import PrivateConversation from './PrivateConversation';
import ChannelConversation from './ChannelConversation';
import { useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';
import { reduxRemoveConversationToList } from '../../../store/convListSlice';
import { setWarningSnackbar } from '../../../store/snackbarSlice';
import { connectionSocketChannel } from './utils';

const ConversationWrapper = () => {
  const { convId, login, name } = useParams();
  const location = useLocation();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (login) return;
    // console.log('socketRef.current : ', socketRef.current)
    if (!socketRef.current || !socketRef.current.connected) {
      console.log('connect socket channel : ');
      const socket: Socket = io('http://localhost:3000/chat', {
        reconnectionDelayMax: 10000,
        withCredentials: true,
      });
      socket.on('connect', () => {
        console.log('socket connected');
        socketRef.current = socket;
      });
    }
    return () => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [login]);

  useEffect(() => {
    console.log('location state : ', location.state);
    // if (!location.state) return;
    // const { convId, login, name } = location.state as { convId: number, login: string, name: string };
    // if (convId === -1 || !login || !name) return;
    // if (login && name) {
    //   dispatch(reduxSetCurrentConversationList(convId));
    // }
  }, [location.state]);

  
  return (
    <>
      { login && <PrivateConversation key={convId} /> }
      { name && socketRef.current?.connected && <ChannelConversation key={convId} conv={location.state} socketRef={socketRef}/> }
    </>
  );
};

export default ConversationWrapper;

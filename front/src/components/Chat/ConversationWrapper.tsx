import { useParams, useLocation } from 'react-router-dom';
import PrivateConversation from './PriveConv/PrivateConversation';
import ChannelConversation from './Channel/ChannelConversation';
import { useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useConnectionSocketChat } from './useSocketChat';
import Loaderperosnalized from '../../utils/LoaderPerosnalized ';

const ConversationWrapper = () => {
  const { convId, login, name } = useParams();
  const { userData } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (login || userData.id == -1) return;
    if (!socketRef.current || !socketRef.current.connected) {
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
  }, [userData.id, login]);

  useConnectionSocketChat(
    socketRef?.current,
    userData.id,
    parseInt(convId as string),
  );

  // useEffect(() => {
  //   console.log('location state : ', location.state);
  //   console.log('name : ', name);
  // }, [location.state, name]);

  
  return (
    <>
      { login && !name && <PrivateConversation key={convId} /> }
      { !login && name && 
        <>
          { socketRef && socketRef.current && socketRef.current.connected && location.state ?
            <ChannelConversation
              key={convId}
              conv={location.state}
              socketRef={socketRef as React.MutableRefObject<Socket>}
            /> : <Loaderperosnalized top={50} left={50}/>
          }
        </>
      }
    </>
  );
};

export default ConversationWrapper;

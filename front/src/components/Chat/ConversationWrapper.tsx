import { useParams, useLocation } from 'react-router-dom';
import PrivateConversation from './PriveConv/PrivateConversation';
import ChannelConversation from './Channel/ChannelConversation';
import { useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useConnectionSocketChat } from './useSocketChat';
import Loaderperosnalized from '../../utils/LoaderPerosnalized';

const ConversationWrapper = () => {
  const { convId, login, name } = useParams();
  const { userData } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (login || userData.id == -1) return;
    if (!socketRef.current || !socketRef.current.connected) {
      const socket = io('http://' + macHostName + ':3000/game', {
      withCredentials: true,
      transports: ['websocket'],
      corse: {
        origin: 'http://' + macHostName + ':3006',
      }
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

  return (
    <>
      {login && !name && <PrivateConversation key={convId} />}
      {!login && name && (
        <>
          {socketRef &&
          socketRef.current &&
          socketRef.current.connected &&
          location.state ? (
            <ChannelConversation
              key={convId}
              conv={location.state}
              socketRef={socketRef as React.MutableRefObject<Socket>}
            />
          ) : (
            <Loaderperosnalized />
          )}
        </>
      )}
    </>
  );
};

export default ConversationWrapper;

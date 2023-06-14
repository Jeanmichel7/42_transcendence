import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PrivateConversation from './PrivateConversation';
import ChannelConversation from './ChannelConversation';

const ConversationWrapper = () => {
  const { convId, id, login, name } = useParams();
  const location = useLocation();

  useEffect(() => {
    // console.log('convId', convId);
    // console.log('id', id);
    // console.log('login', login);
    // console.log('name', name);
  }, [convId, id, login, name]);

  return (
    <>
      { login && <PrivateConversation key={convId} /> }
      { name  && <ChannelConversation key={convId} conv={location.state}/> }
    </>
  );
};

export default ConversationWrapper;

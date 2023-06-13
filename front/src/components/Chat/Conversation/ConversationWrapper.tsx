import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PrivateConversation from './PrivateConversation';
import ChannelConversation from './ChannelConversation';

const ConversationWrapper = () => {
  const { convId, id, login, name } = useParams();
  
  useEffect(() => {
    console.log('convId', convId);
    console.log('id', id);
    console.log('login', login);
    console.log('name', name);
  }, [convId, id, login, name]);

  return (
    <>
      { login && <PrivateConversation key={convId} /> }
      { name  && <ChannelConversation key={convId} /> }
    </>
  );
};

export default ConversationWrapper;

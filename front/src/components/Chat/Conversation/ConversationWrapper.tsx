import { useParams, useLocation } from 'react-router-dom';
import PrivateConversation from './PrivateConversation';
import ChannelConversation from './ChannelConversation';

const ConversationWrapper = () => {
  const { convId, login, name } = useParams();
  const location = useLocation();

  return (
    <>
      { login && <PrivateConversation key={convId} /> }
      { name  && <ChannelConversation key={convId} conv={location.state}/> }
    </>
  );
};

export default ConversationWrapper;

import { useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { RootState } from '../../../store';
import ConversationListUserItem from './ConversationListItemUser';
import { ConversationInterface } from '../../../types';
import { isRoomInterface, isUserInterface } from '../../../utils/utils';
import ConversationListRoomItem from './ConversationListItemRoom';

const ConversationList: React.FC = () => {
  const { conversationsList } = useSelector((state: RootState) => state.chat);

  if (!conversationsList) {
    return <CircularProgress />;
  }
  return (
    <>
      <div className="max-h-[calc(100vh-212px)] text-center transition-all overflow-auto">
        {conversationsList.length === 0 ? (
          <p className="text-center">No friends yet</p>
        ) : (
          conversationsList.map((conv: ConversationInterface) => {
            if (isUserInterface(conv.user)) {
              return <ConversationListUserItem key={conv.id} conv={conv} />;
            } else if (isRoomInterface(conv.room)) {
              return <ConversationListRoomItem key={conv.id} conv={conv} />;
            }
          })
        )}
      </div>
    </>
  );
};

export default ConversationList;

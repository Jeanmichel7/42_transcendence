import { useSelector } from 'react-redux';
import { Button, CircularProgress } from '@mui/material';
import { RootState } from '../../../store';
import ConversationListUserItem from './ConversationListItemUser';
import { ConversationInterface } from '../../../types';
import { isRoomInterface, isUserInterface } from '../../../utils/utils';
import ConversationListRoomItem from './ConversationListItemRoom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Link } from 'react-router-dom';

const ConversationList: React.FC = () => {
  const { conversationsList } = useSelector((state: RootState) => state.chat);

  if (!conversationsList) {
    return <CircularProgress />;
  }
  return (
    <>
      <div className="max-h-[calc(100vh-212px)] text-center transition-all overflow-auto">
        {conversationsList.length === 0 ? (
          <div className="mt-3">
            <Link to="/chat/addFriends">
              <p className="text-center">Add friend</p>
              <Button>
                <PersonAddIcon color="success" />
              </Button>
            </Link>
            <p className="text-center italic my-3 text-gray-500">or</p>
            <Link to="/chat/addChannels">
              <p className="text-center">Join channel</p>
              <Button>
                <GroupAddIcon color="success" />
              </Button>
            </Link>
          </div>
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

import { useState } from 'react';
import { useDispatch } from 'react-redux';

// import { ImBlocked } from 'react-icons/im';
import { ConversationInterface } from '../../../types';
import { reduxRemoveConversationToList } from '../../../store/chatSlicer';

import { Badge, IconButton, Tooltip, Typography, Zoom } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
// import { RootState } from '../../../store';

interface ConvProps {
  conv: ConversationInterface,
  setConvSelectedId: React.Dispatch<React.SetStateAction<number>>,
  setServiceToCall: React.Dispatch<React.SetStateAction<string>>
}

const ConversationListUserItem: React.FC<ConvProps> = ({
  conv,
  setConvSelectedId,
  setServiceToCall,
}) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  // const { conversationsList } = useSelector((state: RootState) => state.chat);

  async function handleCloseConv(
    e: React.MouseEvent<HTMLButtonElement>,
  ) {
    e.stopPropagation();
    dispatch(reduxRemoveConversationToList(conv));
    setConvSelectedId(-1);
  }

  // useEffect(() => {
  //   console.log('conv: ', conv);
  // }, [conv]);

  const handleClickRaw = () => {
    setServiceToCall('privateConversation');
    setConvSelectedId(conv.id);
  };


  return (
    <div>
      <div className="border hover:bg-gray-100 transition-all 
        cursor-pointer flex flex-row items-center text-left"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClickRaw}
      >
        <div className="flex flex-grow text-black m-2 items-center "
          // onClick={() => {
          //   setCurrentChatUserId(userFriend.id);
          //   // setOpen(false);
          //   setServiceToCall('privateConversation');
          // }}
        >
          <Badge
            color={ 
              conv.user.status === 'online' ? 'success' :
                conv.user.status === 'absent' ? 'warning' :
                  'error' 
            }
            overlap="circular"
            badgeContent=" "
            variant="dot"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            sx={{ '.MuiBadge-badge': { transform: 'scale(1.2) translate(-25%, 25%)' } }}
          >
            <img
              className="w-10 h-10 rounded-full object-cover mr-2 "
              src={'http://localhost:3000/avatars/' + conv.user.avatar}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
              }}
              alt="avatar"
            />
          </Badge>
          <Typography component="span"
            sx={{ 
              overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', whiteSpace: 'nowrap',
              color: conv.user.status === 'online' ? 'success' : 'error',
            }}
            title={conv.user.login}
          >
            {conv.user.login.length > 15 ? conv.user.login.slice(0, 12) + '...' : conv.user.login}
          </Typography>
        </div>

        <Tooltip
          title="Close conversation" arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton 
            onClick={(e) => handleCloseConv(e)} color='error'
            sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
          >
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>

      </div>
    </div>
  );
};

export default ConversationListUserItem;

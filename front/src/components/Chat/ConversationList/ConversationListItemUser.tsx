import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import { ImBlocked } from 'react-icons/im';
import { ConversationInterface } from '../../../types';
import { reduxRemoveConversationToList, reduxResetNotReadMP } from '../../../store/convListSlice';

import { Badge, IconButton, Tooltip, Typography, Zoom } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../../store';

interface ConvProps {
  conv: ConversationInterface,
}

const ConversationListUserItem: React.FC<ConvProps> = ({
  conv,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { userData } = useSelector((state: RootState) => state.user);
  const { convId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { conversationsList } = useSelector((state: RootState) => state.chat);
  async function handleCloseConv(
    e: React.MouseEvent<HTMLButtonElement>,
  ) {
    if (conv.id === parseInt(convId as string)) navigate('/chat');
    e.stopPropagation();
    dispatch(reduxRemoveConversationToList({ convId: conv.id, userId: userData.id }));
  }

  const handleClickConv = () => {
    dispatch(reduxResetNotReadMP({ userIdFrom: conv.user.id, userId: userData.id }));
  };

  return (
    <div>
      <div className="border hover:bg-gray-100 transition-all 
        cursor-pointer flex flex-row items-center text-left"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        // onClick={handleClickRaw}
      >
        <Link to={'conv/' + conv.id + '/' + conv.user.id + '/' + conv.user.login} 
          className="flex flex-grow text-black p-1 pl-2 items-center "
          onClick={handleClickConv}
        >
          <Badge
            color={ 
              conv.user.status === 'online' ? 'success' :
                conv.user.status === 'absent' ? 'warning' :
                  conv.user.status === 'inactive' ? 'secondary' :
                    conv.user.status === 'in game' ? 'info' :
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
              className="w-10 h-10 rounded-full object-cover mr-2 border border-[#5f616f]"
              src={conv.user.avatar}
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
            }}
            title={conv.user.login}
          >
            {conv.user.login.length > 15 ? conv.user.login.slice(0, 12) + '...' : conv.user.login}
            {conv.msgNotRead > 0 ? ' (' + conv.msgNotRead + ')' : ''}
          </Typography>
        </Link>

        <Tooltip
          title="Close conversation" arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton 
            onClick={(e) => handleCloseConv(e)} color='warning'
            sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>

      </div>
    </div>
  );
};

export default ConversationListUserItem;

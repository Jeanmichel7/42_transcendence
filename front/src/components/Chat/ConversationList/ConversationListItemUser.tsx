import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ConversationInterface } from '../../../types';
import { reduxRemoveConversationToList } from '../../../store/convListSlice';
import { RootState } from '../../../store';
import {
  Badge,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

const API_URL = import.meta.env.VITE_API_URL;

interface ConvProps {
  conv: ConversationInterface;
}

const ConversationListUserItem: React.FC<ConvProps> = ({ conv }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { userData } = useSelector((state: RootState) => state.user);
  const { convId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleCloseConv(e: React.MouseEvent<HTMLButtonElement>) {
    if (conv.id === parseInt(convId as string)) navigate('/chat');
    e.stopPropagation();
    dispatch(
      reduxRemoveConversationToList({ convId: conv.id, userId: userData.id }),
    );
  }

  return (
    <div>
      <div
        className="border hover:bg-gray-100 transition-all 
        cursor-pointer flex flex-row items-center text-left"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          to={'conv/' + conv.id + '/' + conv.user.id + '/' + conv.user.login}
          className="flex flex-grow text-black p-1 pl-2 items-center "
        >
          <Badge
            color={
              conv.user.status === 'online'
                ? 'success'
                : conv.user.status === 'absent'
                ? 'warning'
                : conv.user.status === 'inactive'
                ? 'secondary'
                : conv.user.status === 'in game'
                ? 'info'
                : 'error'
            }
            overlap="circular"
            badgeContent=" "
            variant="dot"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            sx={{
              '.MuiBadge-badge': {
                transform: 'scale(1.2) translate(-25%, 25%)',
              },
            }}
          >
            <Badge
              overlap="circular"
              variant="dot"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              sx={{
                '.MuiBadge-badge': {
                  transform: 'scale(1.6) translate(-5%, 32%)',
                  backgroundColor: 'white',
                },
              }}
            >
              <img
                className="w-10 h-10 rounded-full object-cover mr-2 border border-[#5f616f]"
                src={conv.user.avatar}
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = API_URL + '/avatars/defaultAvatar.png';
                }}
                alt="avatar"
              />
            </Badge>
          </Badge>
          <Typography
            component="span"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
              whiteSpace: 'nowrap',
            }}
            title={conv.user.login}
          >
            {conv.user.login.length > 15
              ? conv.user.login.slice(0, 12) + '...'
              : conv.user.login}
          </Typography>
        </Link>

        {isHovered ? (
          <Tooltip
            title="Close conversation"
            arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
          >
            <IconButton
              onClick={e => handleCloseConv(e)}
              color="warning"
              sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Chip
            label={conv.msgNotRead > 0 ? conv.msgNotRead : ''}
            size="small"
            sx={{
              visibility: conv.msgNotRead > 0 ? 'visible' : 'hidden',
              marginRight: 2,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ConversationListUserItem;

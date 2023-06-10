import { Badge, Button, Typography } from '@mui/material';
import { UserInterface } from '../../types';
import { useNavigate } from 'react-router-dom';

interface FriendItemProps {
  user: UserInterface;
  actions: {
    name: string;
    callback: (user: UserInterface) => void;
  }[];
}

const FriendItem: React.FC<FriendItemProps> = ({ user, actions }) => {
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="border hover:bg-gray-100 transition-all 
      cursor-pointer flex flex-row items-center">
        <div className="flex flex-grow text-black m-2 items-center"
          onClick={() => {navigate(`/profile/${user.login}`);}}
        >
          <Badge
            color={
              user.status === 'online' ? 'success' :
                user.status === 'absent' ? 'warning' :
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
          { user.avatar && 
            <img
            className="w-10 h-10 rounded-full object-cover mr-2 "
            src={'http://localhost:3000/avatars/' + user.avatar}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
            }}
            alt="avatar"
            />
          }
          </Badge>
          <Typography component="span"
            sx={{
              overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', whiteSpace: 'nowrap',
              color: user.status === 'online' ? 'success' : 'error',
            }}
            title={user.login}
          >
            {user.login.length > 15 ? user.login.slice(0, 12) + '...' : user.login}
          </Typography>
        </div>
        <div>
          {actions.map((action, index) => (
            // <Tooltip
            //   key={index}
            //   title={action.name} arrow
            //   TransitionComponent={Zoom}
            //   TransitionProps={{ timeout: 600 }}
            // >
              <Button 
                key={index}
                variant='outlined'
                onClick={() => action.callback(user)}
                color={
                  action.name === 'Delete' ||
                  action.name === 'Cancel' ||
                  action.name === 'Decline' ? 'error' 
                    : action.name === 'Block' ? 'warning' 
                      : 'primary' }
                sx={{ marginRight: '10px' }}
              >
                {action.name}
              </Button>
            // </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FriendItem;
import { Badge, Button, Typography } from '@mui/material';
import { UserInterface } from '../../types';
import { useNavigate } from 'react-router-dom';

interface FriendItemProps {
  user: UserInterface;
  actions: {
    name: string;
    callback: (user: UserInterface) => void;
  }[];
  isLoading: boolean;
}

const FriendItem: React.FC<FriendItemProps> = ({
  user,
  actions,
  isLoading,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <div
        className="border hover:bg-gray-100 transition-all 
      cursor-pointer flex flex-row items-center"
      >
        <div
          className="flex flex-grow text-black m-2 items-center"
          onClick={() => {
            navigate(`/profile/${user.login}`);
          }}
        >
          <Badge
            color={
              user.status === 'online'
                ? 'success'
                : user.status === 'absent'
                ? 'warning'
                : user.status === 'inactive'
                ? 'secondary'
                : user.status === 'in game'
                ? 'info'
                : 'error'
            }
            overlap="circular"
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
              {user.avatar && (
                <img
                  className="w-10 h-10 rounded-full object-cover mr-2 "
                  src={user.avatar}
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src =
                      'http://localhost:3000/avatars/defaultAvatar.png';
                  }}
                  alt="avatar"
                />
              )}
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
            title={user.login}
          >
            {user.login.length > 15
              ? user.login.slice(0, 12) + '...'
              : user.login}
          </Typography>
        </div>
        <div>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outlined"
              onClick={() => action.callback(user)}
              disabled={isLoading}
              color={
                isLoading
                  ? 'secondary'
                  : action.name === 'Delete' ||
                    action.name === 'Cancel' ||
                    action.name === 'Decline'
                  ? 'error'
                  : action.name === 'Block'
                  ? 'warning'
                  : action.name === 'Defi'
                  ? 'success'
                  : 'primary'
              }
              sx={{ marginRight: '10px' }}
            >
              {action.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FriendItem;

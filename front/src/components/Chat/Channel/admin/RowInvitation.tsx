import { Badge } from '@mui/material';
import { UserInterface } from '../../../../types';

const RowOfFriendToInvit = ({ user }: { user: UserInterface }) => {
  return (
    <div className="flex justify-center content-center">
      <div className="self-center pr-2">{user.login}</div>
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
        badgeContent=" "
        variant="dot"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        sx={{
          '.MuiBadge-badge': { transform: 'scale(1.2) translate(-25%, 25%)' },
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
            className="w-10 h-10 rounded-full object-cover mr-2 "
            src={user.avatar}
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
            }}
            alt="avatar"
          />
        </Badge>
      </Badge>
    </div>
  );
};

export default RowOfFriendToInvit;

import { Badge } from '@mui/material';
import { UserInterface } from '../../../../types';
import DisplayImg from '../../../../utils/displayImage';

const RowOfFriendToInvit = ({ user }: { user: UserInterface }) => {
  return (
    <div className="flex items-center py-1">
      <div className=" pr-2">{user.login}</div>
      <div className="self-end ml-auto">
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
            <DisplayImg
              src={user.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover mr-2 "
            />
          </Badge>
        </Badge>
      </div>
    </div>
  );
};

export default RowOfFriendToInvit;

import { Badge, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { RoomInterface, UserInterface } from '../../../types';
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const MembersCard = ({ user }: { user: UserInterface }) => {
  return (
    <>
      {!user ? null : (
        <Link
          key={user.id}
          to={'/profile/' + user.login}
          className="flex flex-grow text-black p-1 pl-2 items-center "
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
                className="w-10 h-10 rounded-full object-cover mr-2 "
                src={user.avatar}
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
            title={user.login}
          >
            {user.login.length > 15
              ? user.login.slice(0, 12) + '...'
              : user.login}
          </Typography>
        </Link>
      )}
    </>
  );
};

interface ChatMembersProps {
  room: RoomInterface;
}

const ChatMembers = ({ room }: ChatMembersProps) => {
  const [userWithoutAdmins, setUserWithoutAdmins] = useState<
    UserInterface[] | null
  >(null);
  const [acceptedusersWithoudBot, setAcceptedUsersWithoutBot] = useState<
    UserInterface[] | null
  >(null);

  useEffect(() => {
    if (!room.admins || !room.users) return;
    setUserWithoutAdmins(
      room.users?.filter(u => !room.admins?.some(a => a.id === u.id)),
    );
  }, [room.admins, room.users]);

  useEffect(() => {
    if (!room.acceptedUsers) return;
    setAcceptedUsersWithoutBot(room.acceptedUsers.filter(u => u.id != 0));
  }, [room.acceptedUsers]);

  return (
    <div className="hidden md:block mx-2">
      {room.admins && (
        <>
          <h3> ADMINS - {room.admins.length} </h3>
          {room.admins.map(user => (
            <MembersCard key={user.id} user={user} />
          ))}
        </>
      )}

      {userWithoutAdmins && (
        <>
          <h3> MEMBRES - {userWithoutAdmins.length} </h3>
          {userWithoutAdmins.map(user => (
            <MembersCard key={user.id} user={user} />
          ))}
        </>
      )}

      {acceptedusersWithoudBot && acceptedusersWithoudBot.length > 0 && (
        <>
          <h3> WAITING - {acceptedusersWithoudBot.length} </h3>
          {acceptedusersWithoudBot.map(user => {
            if (user.id === 0) return null;
            return <MembersCard key={user.id} user={user} />;
          })}
        </>
      )}
    </div>
  );
};

export default ChatMembers;

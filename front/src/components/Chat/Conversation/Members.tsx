import { Badge, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { UserInterface } from '../../../types';
import { useEffect, useState } from 'react';

const MembersCard = ({ user }: { user: UserInterface }) => {

  useEffect(() => {
    console.log('user in MemberCard : ', user);
  }, [user]);

  return (
    <>
      {!user ? null :
        <Link
          key={user.id}
          to={'/profile/' + user.login}
          className="flex flex-grow text-black p-1 pl-2 items-center "
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
            <img
              className="w-10 h-10 rounded-full object-cover mr-2 "
              src={user.avatar}
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
              color: user.status === 'online' ? 'success' : 'error',
            }}
            title={user.login}
          >
            
            { user.login.length > 15 ? user.login.slice(0, 12) + '...' : user.login}
          </Typography>
        </Link>
      }
    </>
  );
};




interface ChatMembersProps {
  admins: UserInterface[];
  users: UserInterface[];
  acceptedUsers: UserInterface[] | null;
}

const ChatMembers = ({
  admins,
  users,
  acceptedUsers,
}: ChatMembersProps) => {

  const [userWithoutAdmins, setUserWithoutAdmins] = useState<UserInterface[] | null>(null);
  const [acceptedusersWithoudBot, setAcceptedUsersWithoutBot] = useState<UserInterface[] | null>(null);

  useEffect(() => {
    console.log('USERS : ', users);
    if (!admins || !users) return;
    setUserWithoutAdmins(
      users?.filter((u) => !admins?.some((a) => a.id === u.id)),
    );
  }, [admins, users]);

  useEffect(() => {
    if (!acceptedUsers) return;
    setAcceptedUsersWithoutBot(
      acceptedUsers.filter((u) => u.id != 0),
    );
  }, [acceptedUsers]);


  useEffect(() => {
    console.log('admins : ', admins);
    console.log('user : ', users);
    console.log('acceptedUsers : ', acceptedUsers);
  }, [acceptedUsers, admins, users]);

  return (
    <>
      {admins &&
        <>
          <h3> ADMINS - {admins.length} </h3>
          {admins.map((user) => (
            console.log('user de admins : ', user),
            <MembersCard key={user.id} user={user} />
          ))}
        </>
      }

      {userWithoutAdmins &&
        <>
          <h3> MEMBRES - {userWithoutAdmins.length} </h3>
          {userWithoutAdmins.map((user) => (
            // check if user is admin
            console.log('user de userWithoutAdmins : ', user),
            admins.some((admin) => admin.id !== user.id) &&
            <MembersCard key={user.id} user={user} />
          ))}
        </>
      }

      {acceptedusersWithoudBot && acceptedusersWithoudBot.length > 0 &&
        <>
          <h3> WAITING - {acceptedusersWithoudBot.length} </h3>
          {acceptedusersWithoudBot.map((user) => (
            user.id != 0 &&
            <MembersCard key={user.id} user={user} />
          ))}
        </>
      }
    </>
  );
};

export default ChatMembers;
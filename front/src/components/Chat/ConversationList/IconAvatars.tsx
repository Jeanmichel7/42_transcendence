import { useCallback, useEffect, useState } from 'react';
import { RoomInterface, UserInterface } from '../../../types';
import { Typography } from '@mui/material';


interface ConversationListRoomItemIconsProps {
  room: RoomInterface;
}

const ConversationListRoomItemIcons = ({ room }: ConversationListRoomItemIconsProps) => {

  // useEffect(() => {
  //   console.log('room : ', room);
  // }, [room]);

  const [usersToDisplay, setUsersToDisplay] = useState<UserInterface[] | null>(null);

  const getRandAdmin = useCallback(() => {
    if (!room || !room.ownerUser || (room.admins == undefined)) return;
    const admins: UserInterface[] = room.admins.filter((u) => u.id !== room.ownerUser?.id);
    const rand: number = (Math.floor(Math.random() * 100)) % admins.length;
    return admins[rand];
  }, [room]);

  const getRandUser = useCallback((exceptedUser: UserInterface | null) => {
    if (!room || !room.ownerUser || (room.admins == undefined) || (room.users == undefined)) return;
    let users: UserInterface[] = room.users
      .filter((u) => u.id !== room.ownerUser?.id && !room.admins?.some((a) => a.id === u.id));
    if (exceptedUser)
      users = users.filter((u) => u.id !== exceptedUser.id);
    const rand: number = (Math.floor(Math.random() * 100)) % users.length;
    return users[rand];
  }, [room]);

  useEffect(() => {
    if (room && room.ownerUser && (usersToDisplay == null || usersToDisplay.length < 2)) {
      const adminSelected: UserInterface | undefined = getRandAdmin();
      if (adminSelected) {
        setUsersToDisplay([adminSelected]);
        const userSelected: UserInterface | undefined = getRandUser(adminSelected);
        if (userSelected)
          setUsersToDisplay((prev) => prev ? [...prev, userSelected] : [userSelected]);
      } else {
        const userSelected: UserInterface | undefined = getRandUser(null);
        if (userSelected) {
          setUsersToDisplay([userSelected]);
          const userSelected2: UserInterface | undefined = getRandUser(userSelected);
          if (userSelected2)
            setUsersToDisplay((prev) => prev ? [...prev, userSelected2] : [userSelected2]);
        }
      }
    }
  }, [room, room.ownerUser, room.admins, room.users, getRandAdmin, getRandUser]);

  return (
    <>
      <div className="flex relative">
        {room.ownerUser &&
          <img
            className="w-10 h-10 rounded-full object-cover mr-2 z-0 border border-[#5f616f]"
            src={room.ownerUser.avatar}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
            }}
            alt="avatar"
          />
        }
        {usersToDisplay && usersToDisplay.map((user, index) => (
          <div className={`absolute -right-${index * 2}`} key={user.id}>
            <img
              className={`w-10 h-10 rounded-full object-cover z-${(index) * 10} border border-[#5f616f] `}
              src={user.avatar}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
              }}
              alt="avatar"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-grow text-black p-1 pl-2 items-center ">
        <Typography
          component="span"
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', whiteSpace: 'nowrap',
            marginLeft: usersToDisplay?.length ? usersToDisplay.length - 1 + 'rem' : '0rem',
          }}
          title={room.name}
        >
          <div className='flex flex-col'>
            <p> {room.name.length > 10 ? room.name.slice(0, 7) + '...' : room.name} </p>
            <span className='m-0 p-0 text-xs text-gray-400'>{
              room.users?.length ? room.users.length != 1 ? room.users.length + ' Members' : '1 Member' : 'No Member'
            } </span>
          </div>
        </Typography>
      </div>
    </>

  );
};

export default ConversationListRoomItemIcons;
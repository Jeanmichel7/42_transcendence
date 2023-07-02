import { useCallback, useEffect, useState } from 'react';
import { ConversationInterface, UserInterface } from '../../../types';
import { Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';


interface ConversationListRoomItemIconsProps {
  conv: ConversationInterface;
}

const ConversationListRoomItemIcons = ({ conv }: ConversationListRoomItemIconsProps) => {
  const [usersToDisplay, setUsersToDisplay] = useState<UserInterface[] | null>(null);
  const { room } = useSelector((state: RootState) => state.chat.conversationsList.find((c) => c.id === conv.id) || {} as ConversationInterface);

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

  // useEffect(() => {
  // console.log('usersToDisplay : ', usersToDisplay);
  // }, [usersToDisplay]);

  // useEffect(() => {
  //   console.log('        room : ', room);
  // }, [room]);

  useEffect(() => {
    if (room && room.ownerUser && (usersToDisplay == null || usersToDisplay.length < 2)) {
      const adminSelected: UserInterface | undefined = getRandAdmin();
      if (adminSelected) {
        // console.log('adminSelected : ', adminSelected);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, room.ownerUser, room.admins, room.users]);

  return (
    <>
      <div className="flex">
        { room.ownerUser &&
          <img
            className="w-10 h-10 rounded-full object-cover z-0 border border-[#5f616f]"
            src={room.ownerUser.avatar}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
            }}
            alt="avatar"
          />
        }
        { usersToDisplay && usersToDisplay.map((user, index) => (
          <div className='relative' key={user.id}>
            <div style={{ left: `${-32 + (8 * index)}px` }} className='absolute w-10 h-10'>
              <img
                className={`w-10 h-10 rounded-full object-cover z-${(index)} border border-[#5f616f] `}
                src={user.avatar}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
                }}
                alt="avatar"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-grow text-black p-1 pl-2 items-center ">
        <Typography
          component="span"
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', whiteSpace: 'nowrap',
            marginLeft: usersToDisplay?.length ?  '1rem' : '0rem',
          }}
          title={room.name}
        >
          <div className='flex flex-col'>
            <p> 
              {room.type === 'private' ? <LockIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> : ''}
              {room.name.length > 10 ? room.name.slice(0, 7) + '...' : room.name} 
            </p>
            <span className='m-0 p-0 text-xs text-gray-400'>
              {room.users?.length ? room.users.length != 1 ? room.users.length + ' Members' : '1 Member' : 'No Member'} </span>
          </div>
        </Typography>
      </div>
    </>
  );
};

export default ConversationListRoomItemIcons;

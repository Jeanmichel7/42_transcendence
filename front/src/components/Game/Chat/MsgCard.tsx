import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { UserInterface } from '../../../types';
import { useEffect, useState } from 'react';

export interface MessageInterfaceTmp {
  message: string;
  username: string;
  avatar: string;
}

const MessageCardChatGame = ({ data }: { data: MessageInterfaceTmp }) => {
  const userData: UserInterface = useSelector(
    (state: RootState) => state.user.userData,
  );
  const { userBlocked } = useSelector((state: RootState) => state.user);
  const [isUserBlocked, setIsUserBlocked] = useState(true);
  const isMyMsg = userData.login == data.username;

  useEffect(() => {
    if (!userBlocked) return;
    const isBlocked = userBlocked.some(u => u.login == data.username);
    setIsUserBlocked(isBlocked);
  }, [userBlocked, data]);

  return (
    <>
      {!isUserBlocked && (
        <div
          className={`flex items-center ${
            isMyMsg ? 'justify-end' : 'justify-start'
          } `}
        >
          <p className={isMyMsg ? 'mr-2' : 'hidden'}>{data.message}</p>
          <img
            className="w-6 h-6 rounded-full object-cover mr-2 "
            src={data.avatar}
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
            }}
            alt="avatar"
          />
          <p className={isMyMsg ? 'hidden' : ''}>{data.message}</p>
        </div>
      )}
    </>
  );
};

export default MessageCardChatGame;

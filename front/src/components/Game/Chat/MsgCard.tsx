import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { UserInterface } from '../../../types';
import { useEffect, useState } from 'react';
import DisplayImg from '../../../utils/displayImage';

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
    const isBlocked = userBlocked.some(
      (u: UserInterface) => u.login == data.username,
    );
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
          <DisplayImg
            src={data.avatar}
            alt="avatar"
            className="w-6 h-6 rounded-full object-cover mr-2 "
          />
          <p className={isMyMsg ? 'hidden' : ''}>{data.message}</p>
        </div>
      )}
    </>
  );
};

export default MessageCardChatGame;

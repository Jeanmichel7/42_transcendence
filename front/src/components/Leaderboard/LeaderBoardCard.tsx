import { Tooltip } from '@mui/material';
import { UserInterface } from '../../types';
import { ranksImages } from '../../utils/rankImages';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ExperienceBar from '../Profile/ExperienceBar';

interface LeaderBoardProps {
  user: UserInterface;
  indexUser: number;
  classement: number;
}

const LeaderboardCard = ({ user, indexUser, classement }: LeaderBoardProps) => {
  const { userData } = useSelector((state: RootState) => state.user);
  const isUserCard = userData?.id === user.id;

  return (
    <div
      className={`w-full flex justify-between items-center border-b-2 border-blue-500
      ${indexUser % 2 === 0 ? 'bg-blue-50' : 'bg-blue-100'}
      ${isUserCard ? 'bg-violet-300' : ''}
      `}
    >
      <p className="w-[24px]">#{classement}</p>
      <div className="flex items-center w-3/12">
        <img
          className="w-14 h-14 object-cover mr-2 "
          src={user.avatar}
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
          }}
          alt="avatar"
        />
        <Link to={`/profile/${user.login}`}>
          <p>{user.login}</p>
        </Link>
      </div>

      <p className="text-center w-1/12">{user.score}</p>

      <div className="w-2/12 justify-center flex items-center">
        <Tooltip
          arrow
          title={user.rank}
          placement="top"
          className="flex justify-center items-center"
        >
          <img src={ranksImages[user.rank]} alt={user.rank} className="h-8" />
        </Tooltip>
      </div>

      <p className="text-center w-1/12">{user.level}</p>

      <div className="w-2/12 flex justify-center">
        <ExperienceBar
          currentExp={user.experience}
          currentLevel={user.level}
          displayGraduation={false}
        />
      </div>

      <p className="text-center w-2/12">123</p>
    </div>
  );
};

export default LeaderboardCard;

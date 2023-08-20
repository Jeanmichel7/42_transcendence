import { Tooltip } from '@mui/material';
import { UserInterface } from '../../types';
import { ranksImages } from '../../utils/rankImages';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ExperienceBar from '../Profile/ExperienceBar';
import StatsPlayerChart from './StatsPlayer';

const API_URL = import.meta.env.VITE_API_URL;

interface LeaderBoardProps {
  user: UserInterface;
  indexUser: number;
  classement: number;
}

const LeaderboardCard = ({ user, indexUser, classement }: LeaderBoardProps) => {
  const { userData } = useSelector((state: RootState) => state.user);
  const isUserCard = userData?.id === user.id;

  return (
    <Link to={`/profile/${user.login}`}>
      <div
        className={`w-full flex justify-between items-center border-b-[1px] border-blue-500
      ${indexUser % 2 === 0 ? 'bg-blue-50' : 'bg-blue-100'}
      ${isUserCard ? 'bg-violet-300' : ''}
      hover:bg-blue-200
      `}
      >
        <p className="w-[24px] font-bold text-gray-500 text-center ml-1">#{classement}</p>

        <div className="flex items-center w-4/12">
          <div className="flex items-center">
            <img
              className="w-14 h-14 object-cover mr-2 "
              src={user.avatar}
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = API_URL + '/avatars/defaultAvatar.png';
              }}
              alt="avatar"
            />
            <p className="ml-1 overflow-hidden ">{user.login}</p>
          </div>
        </div>

        <p className="text-center w-1/12">{user.score}</p>

        <div className="w-1/12 justify-center flex items-center">
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

        <div className="w-[100px] md:w-[150px] flex justify-center">
          <ExperienceBar
            currentExp={user.experience}
            currentLevel={user.level}
            displayGraduation={false}
          />
        </div>

        <div className="w-2/12 flex justify-center max-h-[60px]">
          <StatsPlayerChart user={user} />
        </div>
      </div>
    </Link>
  );
};

export default LeaderboardCard;

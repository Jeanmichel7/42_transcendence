import { useEffect, useRef, useState } from 'react';
import { getLeaderboard } from '../api/leaderBoard';
import { UserInterface } from '../types';
import { Sticker } from '../utils/StyledTitle';
import { getAllUsersCount } from '../api/user';
import { setErrorSnackbar } from '../store/snackbarSlice';
import { useDispatch } from 'react-redux';
import {
  Stack,
  Pagination,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import LeaderboardCard from '../components/Leaderboard/LeaderBoardCard';

const LeaderBoard = () => {
  const topRef = useRef<HTMLDivElement>(null);

  const [leaderBoard, setLeaderBoard] = useState<UserInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userPerPage, setUserPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      const [userCountRes, leaderBoardRes] = await Promise.all([
        getAllUsersCount(),
        getLeaderboard(currentPage, userPerPage),
      ]);

      if (typeof userCountRes !== 'number' && 'error' in userCountRes) {
        dispatch(setErrorSnackbar(userCountRes));
      } else {
        setTotalPages(Math.ceil(userCountRes / userPerPage));
      }

      if ('error' in leaderBoardRes) {
        console.warn(leaderBoardRes.error);
      } else {
        setLeaderBoard(leaderBoardRes);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
      }

      setIsLoading(false);
    }

    fetchData();
  }, [dispatch, currentPage, userPerPage]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown> | null,
    value: number,
  ) => {
    setCurrentPage(value);
  };

  const handleChangeUserPerPage = (event: any) => {
    setUserPerPage(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-5 bg-inherit">
      <div className="flex flex-col w-full">
        <div ref={topRef} />

        <p className="mb-3">
          <Sticker dataText={'LeaderBoard'} />
        </p>
        {isLoading && (
          <CircularProgress
            size={100}
            color="primary"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
            }}
          />
        )}
        <div
          className="w-full flex justify-between items-center
          border-b-[1px] border-blue-500
          font-bold py-2"
        >
          <div className="text-center  w-[24px] font-bold text-xl text-gray-500">Rank</div>
          <div className="text-center overflow-hidden w-4/12 font-bold text-xl text-gray-500">Player</div>
          <div className="text-center overflow-hidden w-1/12 font-bold text-xl text-gray-500">Elo score</div>
          <div className="text-center overflow-hidden w-1/12 font-bold text-xl text-gray-500">Grade</div>
          <div className="text-center overflow-hidden w-1/12 font-bold text-xl text-gray-500">Level</div>
          <div className="text-center overflow-hidden w-[100px] md:w-[150px] font-bold text-xl text-gray-500">
            Experience
          </div>
          <div className="text-center overflow-hidden w-2/12 font-bold text-xl text-gray-500">Progress</div>
        </div>

        <div>
          {leaderBoard.map((user: UserInterface, index: number) => (
            <LeaderboardCard
              key={user.id}
              user={user}
              indexUser={index}
              classement={index + 1 + (currentPage - 1) * userPerPage}
            />
          ))}
        </div>

        <div className="flex-grow"></div>

        {/* Pagination  */}
        <div className="flex relative justify-center pt-5">
          <Stack spacing={2}>
            <Pagination count={totalPages} onChange={handleChangePage} />
          </Stack>
          <div className="absolute right-2">
            <Select
              value={userPerPage}
              onChange={handleChangeUserPerPage}
              label="Cards per page"
              sx={{ height: '35px' }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;

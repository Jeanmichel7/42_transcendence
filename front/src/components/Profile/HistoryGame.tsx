import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ApiErrorResponse, UserInterface } from '../../types';
import { GameInterface } from '../../types/GameTypes';
import { Sticker } from '../../utils/StyledTitle';
import GameCard from './HistoryGameCard';
import { getAllGamesCount, getHistoryGames } from '../../api/game';
import { setErrorSnackbar } from '../../store/snackbarSlice';
import {
  CircularProgress,
  Stack,
  Pagination,
  Select,
  MenuItem,
} from '@mui/material';
import { Nothing } from '../Friends/Nothing';

interface PropsGames {
  user: UserInterface;
}

export default function HistoryGame({ user }: PropsGames) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const [games, setGames] = useState<GameInterface[]>([]);
  const [needRef, setNeedRef] = useState(false); // to scroll to top when change page
  const [currentPage, setCurrentPage] = useState(1);
  const [gamePerPage, setUserPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchTotalGames() {
      const res: number | ApiErrorResponse = await getAllGamesCount(user.id);
      if (typeof res != 'number' && 'error' in res)
        dispatch(setErrorSnackbar(res));
      else setTotalPages(Math.ceil(res / gamePerPage));
    }

    const fetchGames = async () => {
      setIsLoading(true);
      const resFetchGames: GameInterface[] | ApiErrorResponse =
        await getHistoryGames(user.id, currentPage, gamePerPage);
      setIsLoading(false);

      if ('error' in resFetchGames) return console.warn(resFetchGames.error);
      setGames(resFetchGames);
    };

    fetchTotalGames();
    fetchGames();
  }, [dispatch, currentPage, gamePerPage, user]);

  useEffect(() => {
    if (games && games.length > 0 && needRef)
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [games]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setCurrentPage(value);
    setNeedRef(true);
  };

  const handleChangeUserPerPage = (event: any) => {
    setUserPerPage(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-5 bg-inherit">
      <div className="flex flex-col w-full">
        <p className="mt-6">
          <Sticker dataText={'Games'} />
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

        <div>
          {games && games.length === 0 && (
                  <Nothing text="No games" />)}
      
          
          {games &&
            games.length > 0 &&
            games.map(game => (
              <GameCard game={game} user={user} key={game.id} />
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
              value={gamePerPage}
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
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setErrorSnackbar } from '../store/snackbarSlice';

import ProfileFriends from '../components/Profile/ProfileFriends';
import HistoryGame from '../components/Profile/HistoryGame';

import { getProfileByPseudo } from '../api/user';
import { ApiErrorResponse, GameInterface, UserInterface } from '../types';

import Box from '@mui/material/Box';
// import ErrorBoundary from '../utils/errorBoundaries';
import ProfileInfo from '../components/Profile/ProfileInfo';
import ProfileTrophies from '../components/Profile/ProfileTrophies';
import StatsGame from '../components/Profile/StatsGame';
import { getHistoryGames } from '../api/game';
import CircularProgress from '@mui/material/CircularProgress';

function Profile() {
  const { pseudo } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserInterface>();
  const [games, setGames] = useState<GameInterface[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState<boolean>(false);
  const [isLoadingGames, setIsLoadingGames] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchAndSetFriendsProfile() {
      if (!userProfile?.id) return;

      setIsLoadingFriends(true);
      const gamesFetched = await getHistoryGames(userProfile.id);

      if ('error' in gamesFetched) dispatch(setErrorSnackbar(gamesFetched));
      else setGames(gamesFetched);
      setIsLoadingFriends(false);
    }

    fetchAndSetFriendsProfile();
  }, [dispatch, userProfile]);

  useEffect(() => {
    async function fetchAndSetUserProfile() {
      if (typeof pseudo === 'undefined') return;

      setIsLoadingGames(true);
      const profilesFetched: UserInterface | ApiErrorResponse =
        await getProfileByPseudo(pseudo);

      if ('error' in profilesFetched) {
        if (profilesFetched.statusCode === 404) return navigate('/404');
        dispatch(setErrorSnackbar(profilesFetched));
      } else setUserProfile(profilesFetched);

      setIsLoadingGames(false);
    }
    fetchAndSetUserProfile();
  }, [pseudo, dispatch, navigate]);

  const loader = (
    <div className="flex justify-center items-center h-full">
      <CircularProgress />
    </div>
  );

  if (!userProfile) return loader;
  return (
    <div className="bg-[var(--background-color)] relative z-10 ">
      <Box className="w-full ">
        <ProfileInfo user={userProfile} />
        <ProfileFriends user={userProfile} />
        {isLoadingFriends ? loader : <ProfileTrophies user={userProfile} />}
        {isLoadingGames ? (
          loader
        ) : (
          <StatsGame user={userProfile} games={games} />
        )}
        {isLoadingGames ? (
          loader
        ) : (
          <HistoryGame user={userProfile} games={games} />
        )}
      </Box>
    </div>
  );
}
export default Profile;

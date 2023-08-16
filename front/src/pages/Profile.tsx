import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setErrorSnackbar } from '../store/snackbarSlice';

import ProfileFriends from '../components/Profile/ProfileFriends';
import HistoryGame from '../components/Profile/HistoryGame';

import { getProfileByPseudo } from '../api/user';
import { ApiErrorResponse, UserInterface } from '../types';

import Box from '@mui/material/Box';
// import ErrorBoundary from '../utils/errorBoundaries';
import ProfileInfo from '../components/Profile/ProfileInfo';
import ProfileTrophies from '../components/Profile/ProfileTrophies';
import StatsGame from '../components/Profile/StatsGame';
import CircularProgress from '@mui/material/CircularProgress';

function Profile() {
  const { pseudo } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserInterface>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchAndSetUserProfile() {
      if (typeof pseudo === 'undefined') return;

      setIsLoading(true);
      const profilesFetched: UserInterface | ApiErrorResponse =
        await getProfileByPseudo(pseudo);

      if ('error' in profilesFetched) {
        if (profilesFetched.statusCode === 404) return navigate('/404');
        dispatch(setErrorSnackbar(profilesFetched));
      } else setUserProfile(profilesFetched);

      setIsLoading(false);
    }
    fetchAndSetUserProfile();
  }, [pseudo, dispatch, navigate]);

  return (
    <>
      {isLoading || !userProfile ? (
        <div className="flex justify-center items-center h-full">
          <CircularProgress />
        </div>
      ) : (
        <div className="bg-[var(--background-color)] relative z-10 ">
          <Box className="w-full">
            <ProfileInfo user={userProfile} />
            <ProfileFriends user={userProfile} />
            <ProfileTrophies user={userProfile} />
            <StatsGame user={userProfile} />
            <HistoryGame user={userProfile} />
          </Box>
        </div>
      )}
    </>
  );
}
export default Profile;

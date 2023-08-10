import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setErrorSnackbar } from '../store/snackbarSlice';

import ProfileFriends from '../components/Profile/ProfileFriends';
import HistoryGame from '../components/Profile/HistoryGame';

import { getProfileByPseudo } from '../api/user';
import { ApiErrorResponse, UserInterface } from '../types';

import Box from '@mui/material/Box';
import ErrorBoundary from '../utils/errorBoundaries';
import ProfileInfo from '../components/Profile/ProfileInfo';
import ProfileTrophies from '../components/Profile/ProfileTrophies';

function Profile() {
  const { pseudo } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserInterface | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchAndSetUserProfile() {
      if (typeof pseudo === 'undefined') return;
      const profilesFetched: UserInterface | ApiErrorResponse =
        await getProfileByPseudo(pseudo);
      if ('error' in profilesFetched) {
        if (profilesFetched.statusCode === 404) return navigate('/404');
        dispatch(setErrorSnackbar(profilesFetched));
      } else setUserProfile(profilesFetched);
    }
    fetchAndSetUserProfile();
  }, [pseudo, dispatch]);

  if (!userProfile) return <div>loading...</div>;
  return (
    <div className="bg-[var(--background-color)] relative z-10 ">
      <ProfileInfo user={userProfile} />
      <ProfileTrophies user={userProfile} />
      <Box className="w-full ">
        <ProfileFriends user={userProfile} />
      </Box>
      <Box className="w-full">
        <ErrorBoundary>
          <HistoryGame user={userProfile} />
        </ErrorBoundary>
      </Box>
    </div>
  );
}
export default Profile;

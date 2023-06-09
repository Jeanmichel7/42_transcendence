import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setErrorSnackbar } from '../store/snackbarSlice';

import ProfileFriends from '../components/Profile/ProfileFriends';
import HistoryGame from '../components/Profile/HistoryGame';

import { getProfileByPseudo } from '../api/user';

import { ApiErrorResponse, UserInterface } from '../types';


import Box from '@mui/material/Box';
import ErrorBoundary from '../utils/errorBoundaries';
import ProfileInfo from '../components/Profile/ProfileInfo';

function Profile() {
  const { pseudo } = useParams();
  const [userProfile, setUserProfile] = useState<UserInterface>({
    id: -1,
    login: '',
    email: '',
    firstName: '',
    lastName: '',
    description: '',
    is2FAEnabled: false,
    avatar: '',
    score: 1500,
    status: 'offline',
  });
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchAndSetUserProfile() {
      if (typeof pseudo === 'undefined')
        return;
      const profilesFetched: UserInterface | ApiErrorResponse = await getProfileByPseudo(pseudo);
      if ('error' in profilesFetched)
        dispatch(setErrorSnackbar(profilesFetched.error + profilesFetched.message ? ': ' + profilesFetched.message : ''));
      else
        setUserProfile(profilesFetched);
    }
    fetchAndSetUserProfile();
  }, [pseudo, dispatch]);

  return (
    <>
      <ProfileInfo user={userProfile} />

      <Box className="w-full">
        <ProfileFriends user={userProfile} />
      </Box>

      <Box className="w-full">
        <ErrorBoundary>
          <HistoryGame user={userProfile} />
        </ErrorBoundary>
      </Box>
    </>

  );
}
export default Profile;

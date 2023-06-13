import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
// import SideBar from './components/Sidebar/Sidebar';

import AppRoutes from './routes/indexRoutes';
import { isAuthenticated } from './api/auth';
import { getUserData } from './api/user';
import { getBlockedUsers, getFriendRequests, getFriendRequestsSent, getFriends } from './api/relation';
import {
  reduxSetFriends,
  reduxSetUserBlocked,
  reduxSetWaitingFriends,
  reduxSetWaitingFriendsSent,
  setLogged,
  setUser,
} from './store/userSlice';
import { ApiErrorResponse, UserInterface } from './types';
import { useNavigate } from 'react-router-dom';
import { ReduxActionInterface } from './types/utilsTypes';
import { Alert, Snackbar } from '@mui/material';
import { closeSnackbar, setErrorSnackbar } from './store/snackbarSlice';
import { RootState } from './store';



function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { snackbar } = useSelector((state: RootState) => state.snackbar);

  const handleClose = () => {
    dispatch(closeSnackbar());
  };

  const fetchData = useCallback(async function <T extends UserInterface | UserInterface[]>(
    apiFunction: () => Promise<T | ApiErrorResponse>,
    action: ((payload: T) => ReduxActionInterface),
  ): Promise<void> {
    const result: T | ApiErrorResponse = await apiFunction();
    if ('error' in result) {
      dispatch(setErrorSnackbar(result.error + result.message ? ': ' + result.message : ''));
    } else {
      dispatch(action(result));
    }
  }, [dispatch]);

  const checkAuth = useCallback(async () => {
    const isAuth: boolean | ApiErrorResponse = await isAuthenticated();
    if (typeof isAuth === 'boolean' && isAuth === true) {
      dispatch(setLogged(true));

      await fetchData(getUserData, setUser);
      await fetchData(getFriends, reduxSetFriends);
      await fetchData(getBlockedUsers, reduxSetUserBlocked);
      await fetchData(getFriendRequests, reduxSetWaitingFriends);
      await fetchData(getFriendRequestsSent, reduxSetWaitingFriendsSent);

    } else {
      dispatch(setLogged(false));
      // navigate('/');
    }
  }, [dispatch, fetchData]);


  useEffect(() => {
    checkAuth();
  }, [dispatch, navigate, fetchData, checkAuth]);
  
  return (
    <>
      <div className="flex flex-col h-screen min-h-md ">
        <Header />
        <div className="flex-grow bg-[#eaeaff] w-full">
          <div className="h-full">
            <AppRoutes />
          </div>
          {/* <div className="absolute right-0 top-0">
            <SideBar />
          </div> */}
        </div>
        <Footer />
      </div>

      <Snackbar
        anchorOrigin={{ 
          vertical: snackbar.vertical,
          horizontal: snackbar.horizontal,
        }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert 
          onClose={handleClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
export default App;

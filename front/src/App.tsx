import { useCallback, useEffect, useState } from 'react';
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
import { ApiErrorResponse, ConversationInterface, UserInterface } from './types';
import { useLocation, useNavigate } from 'react-router-dom';
import { NotificationInterface, UserActionInterface, UserStatusInterface } from './types/utilsTypes';
import { Alert, Snackbar } from '@mui/material';
import { closeSnackbar, setErrorSnackbar } from './store/snackbarSlice';
import { RootState } from './store';
import { reduxAddManyNotifications, reduxSetNotifications } from './store/notificationSlice';
import { reduxSetConversationList, reduxUpdateStatusUserConvList } from './store/convListSlice';
import { getNotifsNotRead } from './api/notification';


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState(-1);
  const { snackbar } = useSelector((state: RootState) => state.snackbar);

  const handleClose = () => {
    dispatch(closeSnackbar());
  };

  const fetchData = useCallback(async function <T extends UserInterface | UserInterface[] | NotificationInterface[]>(
    apiFunction: () => Promise<T | ApiErrorResponse>,
    action: ((payload: T) => UserActionInterface),
  ): Promise<void> {
    const result: T | ApiErrorResponse = await apiFunction();
    
    if ('error' in result) {
      dispatch(setErrorSnackbar(result.error + result.message ? ': ' + result.message : ''));
    } else {
      if ( !Array.isArray(result) && apiFunction === getUserData) setUserId(result.id);
      dispatch(action(result));
      if ( Array.isArray(result) && apiFunction === getFriends) {
        const userFriendsStatusInterface: UserStatusInterface[]
        = (result as UserInterface[]).map((user: UserInterface) => ({
          id: user.id,
          status: user.status,
        }));
        dispatch(reduxUpdateStatusUserConvList({ item: userFriendsStatusInterface, userId: userId }));
      }
    }
  }, [dispatch, userId]);

  const checkAuth = useCallback(async () => {
    const isAuth: boolean | ApiErrorResponse = await isAuthenticated();
    if (typeof isAuth === 'boolean' && isAuth === true) {
      dispatch(setLogged(true));

      /* GET NOTIF IN LOCALSTORAGE AND ADD NOTIF NOT READ */
      const notifInLocalStorage: NotificationInterface[]
        = JSON.parse(localStorage.getItem('notifications' + userId) as string) || [] as NotificationInterface[];
      dispatch(reduxSetNotifications(notifInLocalStorage));

      const notifsNotRead = await getNotifsNotRead();
      if (!('error' in notifsNotRead)) {
        const notifsNotReadFiltered = notifsNotRead.filter((n: NotificationInterface) =>
          !notifInLocalStorage?.find((n2: NotificationInterface) => n2.id === n.id),
        );
        if (notifsNotReadFiltered.length > 0)
          dispatch(reduxAddManyNotifications(notifsNotReadFiltered));
      }

      /* GET CONVERSATION LIST IN LOCALSTORAGE AND UPDATE STATUS FRIENDS*/
      const convListInLocalStorage: ConversationInterface[]
        = JSON.parse(localStorage.getItem('conversationsList' + userId) as string) || [] as ConversationInterface[];
      dispatch(reduxSetConversationList(convListInLocalStorage));

      await fetchData(getUserData, setUser);
      await fetchData(getFriends, reduxSetFriends);
      await fetchData(getBlockedUsers, reduxSetUserBlocked);
      await fetchData(getFriendRequests, reduxSetWaitingFriends);
      await fetchData(getFriendRequestsSent, reduxSetWaitingFriendsSent);

    } else {
      dispatch(setLogged(false));
      //disconnect user
      if (userId !== -1)
        navigate('/');
      setUserId(-1);
    }
  }, [dispatch, fetchData, navigate, userId]);


  useEffect(() => {
    checkAuth();
  }, [dispatch, navigate, fetchData, checkAuth]);
  
  return (
    <>
      <div className="flex flex-col h-screen min-h-md ">
        {location?.pathname !== '/' && <Header />}
        <div className="flex-grow w-full">
          <div className="h-full">
            <AppRoutes />
          </div>
        </div>
        {location?.pathname !== '/' && <Footer />}
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

import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';

import AppRoutes from './routes/indexRoutes';
import { isAuthenticated } from './api/auth';
import { getUserData } from './api/user';
import {
  getBlockedUsers,
  getFriendRequests,
  getFriendRequestsSent,
  getFriends,
} from './api/relation';
import {
  reduxSetFriends,
  reduxSetUserBlocked,
  reduxSetWaitingFriends,
  reduxSetWaitingFriendsSent,
  setLogged,
  setUser,
} from './store/userSlice';
import {
  ApiErrorResponse,
  ConversationInterface,
  UserInterface,
} from './types';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  NotificationInterface,
  UserActionInterface,
  UserStatusInterface,
} from './types/utilsTypes';
import { setErrorSnackbar } from './store/snackbarSlice';
import {
  reduxAddManyNotifications,
  reduxSetNotifications,
} from './store/notificationSlice';
import {
  reduxSetConversationList,
  reduxUpdateStatusUserConvList,
} from './store/convListSlice';
import { getNotifsNotRead } from './api/notification';
import { CircleBackground } from './utils/CircleBackground';
import SnackBarApp from './components/SnackBarApp';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState(-1);

  const fetchData = useCallback(
    async function <
      T extends UserInterface | UserInterface[] | NotificationInterface[],
    >(
      apiFunction: () => Promise<T | ApiErrorResponse>,
      action: (payload: T) => UserActionInterface,
    ): Promise<void> {
      const result: T | ApiErrorResponse = await apiFunction();

      if ('error' in result) {
        dispatch(setErrorSnackbar(result));
      } else {
        if (!Array.isArray(result) && apiFunction === getUserData)
          setUserId(result.id);
        dispatch(action(result));
        if (Array.isArray(result) && apiFunction === getFriends) {
          const userFriendsStatusInterface: UserStatusInterface[] = (
            result as UserInterface[]
          ).map((user: UserInterface) => ({
            id: user.id,
            status: user.status,
          }));
          dispatch(
            reduxUpdateStatusUserConvList({
              item: userFriendsStatusInterface,
              userId: userId,
            }),
          );
        }
      }
    },
    [dispatch, userId],
  );

  const checkAuth = useCallback(async () => {
    const isAuth: boolean | ApiErrorResponse = await isAuthenticated();
    if (typeof isAuth === 'boolean' && isAuth === true) {
      dispatch(setLogged(true));

      /* GET NOTIF IN LOCALSTORAGE AND ADD NOTIF NOT READ */
      const notifInLocalStorage: NotificationInterface[] =
        JSON.parse(localStorage.getItem('notifications' + userId) as string) ||
        ([] as NotificationInterface[]);
      dispatch(reduxSetNotifications(notifInLocalStorage));

      const notifsNotRead = await getNotifsNotRead();
      if (!('error' in notifsNotRead)) {
        const notifsNotReadFiltered = notifsNotRead.filter(
          (n: NotificationInterface) =>
            !notifInLocalStorage?.find(
              (n2: NotificationInterface) => n2.id === n.id,
            ),
        );
        if (notifsNotReadFiltered.length > 0)
          dispatch(reduxAddManyNotifications(notifsNotReadFiltered));
      }

      /* GET CONVERSATION LIST IN LOCALSTORAGE AND UPDATE STATUS FRIENDS*/
      const convListInLocalStorage: ConversationInterface[] =
        JSON.parse(
          localStorage.getItem('conversationsList' + userId) as string,
        ) || ([] as ConversationInterface[]);
      dispatch(reduxSetConversationList(convListInLocalStorage));

      await fetchData(getUserData, setUser);
      await fetchData(getFriends, reduxSetFriends);
      await fetchData(getBlockedUsers, reduxSetUserBlocked);
      await fetchData(getFriendRequests, reduxSetWaitingFriends);
      await fetchData(getFriendRequestsSent, reduxSetWaitingFriendsSent);
    } else {
      dispatch(setLogged(false));
      //disconnect user
      if (
        location &&
        location.pathname != '/' &&
        location.pathname != '/login' &&
        location.pathname != '/connection' &&
        location.pathname != '/fakeconnection'
      )
        navigate('/');
      setUserId(-1);
    }
  }, [dispatch, fetchData, location, navigate, userId]);

  useEffect(() => {
    if (
      location &&
      location.pathname != '/' &&
      location.pathname != '/login' &&
      location.pathname != '/connection' &&
      location.pathname != '/fakeconnection'
    ) {
      checkAuth();
    }
  }, [dispatch, navigate, fetchData, checkAuth, location]);

  return (
    <div className="flex flex-col h-screen min-h-md relative bg-[var(--background-color)] z-10 ">
      {location &&
        location.pathname !== '/' &&
        location.pathname != '/connection' &&
        location.pathname != '/fakeconnection' && <Header />}
      {(location.pathname == '/' || location?.pathname == '/game') && (
        <CircleBackground />
      )}

      <AppRoutes />

      {location &&
        location.pathname !== '/' &&
        location.pathname != '/connection' &&
        location.pathname != '/fakeconnection' && <Footer />}

      <SnackBarApp />
    </div>
  );
}
export default App;

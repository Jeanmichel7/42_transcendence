import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import SideBar from './components/Sidebar/Sidebar';

import AppRoutes from './routes/indexRoutes';
import { isAuthenticated } from './api/auth';
import { getUserData } from './api/user';
import { getBlockedUsers, getFriends } from './api/relation';
import {
  reduxSetFriends,
  reduxSetUserBlocked,
  setLogged,
  setUser,
} from './store/userSlice';
import { ApiErrorResponse, UserInterface } from './types';
import { useNavigate } from 'react-router-dom';
import { ReduxActionInterface } from './types/utilsTypes';



function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchData = useCallback( async function<T extends UserInterface | UserInterface[] >(
    apiFunction : () => Promise< T | ApiErrorResponse >,
    action: ((payload: T ) => ReduxActionInterface),
  ): Promise<void> {
    const result = await apiFunction();
    if ('error' in result) {
      console.log('error: ', result);
    } else {
      dispatch(action(result));
    }
  }, [dispatch]);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth: boolean | ApiErrorResponse = await isAuthenticated();
      if (typeof isAuth === 'boolean' && isAuth === true) {
        dispatch(setLogged(true));

        await fetchData(getUserData, setUser);
        await fetchData(getFriends, reduxSetFriends);
        await fetchData(getBlockedUsers, reduxSetUserBlocked);

      } else {
        dispatch(setLogged(false));
        navigate('/');
      }
    };
    checkAuth();
  }, [dispatch, navigate, fetchData]);

  return (
    <div className="flex flex-col h-screen min-h-md ">
      <Header />
      <div className="relative flex-grow bg-[#eaeaff] w-full">
        <div className="mr-12 p-6 h-full">
          <AppRoutes />
        </div>
        <div className="absolute right-0 top-0">
          <SideBar />
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default App;

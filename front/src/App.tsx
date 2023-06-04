import { useEffect } from 'react';
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

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth: boolean | ApiErrorResponse = await isAuthenticated();
      if (isAuth === true) {
        dispatch(setLogged(true));

        const data: UserInterface | ApiErrorResponse = await getUserData();
        if ('error' in data)
          console.log('data : ', data);
        else
          dispatch(setUser(data));
        
        const friends: UserInterface[] | ApiErrorResponse = await getFriends();
        if ('error' in friends)
          console.log('friends : ', friends);
        else
          dispatch(reduxSetFriends(friends));
        
        const userBlocked: UserInterface[] | ApiErrorResponse = await getBlockedUsers();
        if ('error' in userBlocked)
          console.log('userBlocked : ', userBlocked);
        else
          dispatch(reduxSetUserBlocked(userBlocked));

      } else {
        dispatch(setLogged(false));
      }
    };
    checkAuth();
  }, [dispatch]);

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

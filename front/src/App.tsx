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
  reduxSetFriends, reduxSetUserBlocked, setLogged, setUser,
} from './store/userSlice';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      if (isAuth === true) {
        const data = await getUserData();
        const friends = await getFriends();
        const userBlocked = await getBlockedUsers();
        dispatch(setLogged(true));
        dispatch(setUser(data));
        dispatch(reduxSetFriends(friends));
        dispatch(reduxSetUserBlocked(userBlocked));
      } else {
        dispatch(setLogged(false));
      }
    };
    checkAuth();
  }, []);

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

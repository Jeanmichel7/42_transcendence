import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import SideBar from './components/Sidebar/Sidebar';

import AppRoutes from './routes/indexRoutes';
import { useEffect } from 'react';
import { getUserData, isAuthenticated } from './api/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setLogged, setUser } from './store/userSlice';

function App() {
  const userData: any = useSelector((state: any) => state.user.userData);

  const dispatch = useDispatch()
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      if(isAuth === true) {
        dispatch(setLogged(true))
        const data = await getUserData();
        dispatch(setUser(data));
      }
      else {
        dispatch(setLogged(false))
      }
    };
    checkAuth();
  }, []);


  return (
    <div className='flex flex-col h-screen min-h-md '>
      <Header />
      <div className='relative flex-grow bg-[#eaeaff] w-full'>
        <div className='mr-12 p-6 h-full'>
          <AppRoutes />
        </div>
        <div className="absolute right-0 top-0">
          <SideBar />
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default App;

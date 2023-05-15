import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import SideBar from './components/SideBar';

import AppRoutes from './routes/indexRoutes';

function App() {
  return (
    <div className='h-screen bg-[#262652] h-full w-full '>
      <Header />
      <div className='flex flex-row min-h-fit'>
        <div className='w-11/12 p-5'>
          <AppRoutes />
        </div>
        <div className='w-1/12'>
          <SideBar />
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default App;

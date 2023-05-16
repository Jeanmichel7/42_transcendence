import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import SideBar from './components/SideBar';

import AppRoutes from './routes/indexRoutes';

function App() {
  return (
    <div className='flex flex-col h-screen min-h-md '>
      <Header />
      <div className='relative flex-grow bg-[#262652] w-full'>
        <div className='mr-12 p-6 h-full text-white'>
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

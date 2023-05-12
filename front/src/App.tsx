import Header from './components/Header/Header';
import SideBar from './components/SideBar';

import AppRoutes from './routes/indexRoutes';

function App() {
  return (
    <div className='app'>
      <Header />
      <SideBar />
      <AppRoutes />
      {/* <Footer /> */}
    </div>
  )
}
export default App;

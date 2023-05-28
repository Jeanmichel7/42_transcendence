
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../api/auth';
import { setLogout } from '../../store/userSlice';

function Header() {
  const userData = useSelector((state) => state.user.userData);
  const userIsLogged = useSelector((state) => state.user.isLogged);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  async function handleLogout() {
    try {
      const res = await logout();
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    dispatch(setLogout());
    navigate('/');
  }

  return (
    <div className="bg-gradient-to-r from-black via-purple-800 via-yellow-300 via-orange-700 to-black text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 rounded-lg h-[50px] flex items-center justify-center">
            <Link to="/home" className="flex items-center">
              <img src='/pong-nav.png' className="w-8 h-8 mr-2" alt="pong" />
              <span className="font-bold text-2xl transition-all duration-300 hover:text-red-500 hover:scale-110">Pong</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center">
          <div className="p-2 rounded-lg h-[50px] flex items-center justify-center">
            <NavLink to="/game" activeClassName="text-red-500" className="text-center mr-4 font-bold text-2xl transition-all duration-300 hover:text-red-500 hover:scale-110">Play</NavLink>
          </div>
          <div className="p-2 rounded-lg h-[50px] flex items-center justify-center">
            <NavLink to="/chat" activeClassName="text-red-500" className="text-center mr-4 font-bold text-2xl transition-all duration-300 hover:text-red-500 hover:scale-110">Chat</NavLink>
          </div>
          <div className="p-2 rounded-lg h-[50px] flex items-center justify-center">
            <NavLink to="/test" activeClassName="text-red-500" className="text-center mr-4 font-bold text-2xl transition-all duration-300 hover:text-red-500 hover:scale-110">Test</NavLink>
          </div>
          <div className="p-2 rounded-lg h-[50px] flex items-center justify-center">
            <NavLink to="/friends" activeClassName="text-red-500" className="text-center font-bold text-2xl transition-all duration-300 hover:text-red-500 hover:scale-110">Friends</NavLink>
          </div>
        </div>

        <div className="flex items-center">
          {userIsLogged && userData &&
            <div className="p-2 rounded-lg h-[50px]">
              <NavLink to="/profile" activeClassName="text-red-500" className="font-bold text-xl transition-all duration-300 hover:text-red-500 hover:scale-110">Profile</NavLink>
              <NavLink to="/profile">
                {userData.avatar &&
                  <img
                    src={`http://localhost:3000/avatars/` + userData.avatar}
                    className="w-8 h-8"
                    alt="user avatar"
                  />}
              </NavLink>
              <button onClick={handleLogout}>Logout</button>
      </div>
      }
      {!userIsLogged &&
        <div className="p-2 rounded-lg h-[50px]">
          <p>
            <Link to="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOAuth&response_type=code"
              style={{ color: 'white' }} className="font-bold text-2xl transition-all duration-300 hover:text-red-500 hover:scale-110"
            >
              Login
            </Link>
          </p>
        </div>
      }
    </div>
  </div>
</div>
);
}
export default Header;


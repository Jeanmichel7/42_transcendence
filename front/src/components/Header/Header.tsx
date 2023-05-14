import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'

import { logout } from '../../api/auth'
import { setLogout } from '../../store/userSlice'

function Header() {

  /* redux */
  const userData: any = useSelector(state => state.user.userData);
  const userIsLogged: any = useSelector(state => state.user.isLogged);
  const dispatch = useDispatch()
  let navigate = useNavigate();

  async function handleLogout() {
    try {
      const res = await logout();
      // console.log("res : ", res)
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    dispatch(setLogout());
    navigate('/');
  }


  return (
    <div className="top-0 bg-[#1e1e4e] text-white" >
      <div className="flex justify-between items-center" >
        <div className="flex items-center" >
          <img src='/pong-nav.png' width='128px' className="text-center p-2 rounded-full" />
          <p className="text-4xl font-bold font-Dance" >Pong</p>
        </div>

        <div className="flex justify-between items-center space-x-8" >
          <Link to="/home" className="text-3xl font-bold font-Dance" >Play</Link>
          <Link to="/chat" className="text-3xl font-bold font-Dance" >Chat</Link>
          <Link to="/friends" className="text-3xl font-bold font-Dance" >Friends</Link>
          <Link to="/test" className="text-3xl font-bold font-Dance" >Test</Link>
        </div>

        <div className="flex justify-between items-center space-x-8" >
          {userIsLogged &&
          <>
            <button onClick={handleLogout} className="text-3xl font-bold font-Dance">
              Logout
            </button>
            <Link to="/profile" className="text-3xl font-bold font-Dance" >
              {userData?.login}
            </Link>
            {userData.avatar && <img src={`http://localhost:3000/avatars/` + userData?.avatar}
              width='120px' className="text-center p-2 rounded-full " />}
          </>
          }
          {!userIsLogged &&
            <p className="text-3xl font-bold font-Dance" >
              <Link to="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOAuth&response_type=code">
                Login
              </Link>
            </p>
          }
        </div>
      </div>
    </div>
  )
}

export default Header

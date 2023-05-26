import { Link, NavLink, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'

import { logout } from '../../api/auth'
import { setLogout } from '../../store/userSlice'

function Header() {

  /* redux */
  const userData: any = useSelector((state: any) => state.user.userData);
  const userIsLogged: any = useSelector((state: any) => state.user.isLogged);
  const dispatch = useDispatch();
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
    <div className=" bg-[#1e1e4e] text-white" >
      <div className="flex justify-between items-center" >
        <Link to="/home" className="flex items-center">
          <img src='/pong-nav.png'className="text-center p-2 rounded-full w-full h-24" />
          <span className="text-4xl font-bold font-Dance ml-4">Pong</span>
        </Link>

        <div className="flex justify-between items-center" >
          <NavLink to="/game" className={({isActive}) => isActive? "header__link--activ" : "header__link"} >Play</NavLink>
          <NavLink to="/chat" className={({isActive}) => isActive? "header__link--activ" : "header__link"} >Chat</NavLink>
          <NavLink to="/test" className={({isActive}) => isActive? "header__link--activ" : "header__link"} >Test</NavLink>
          <NavLink to="/friends" className={({isActive}) => isActive? "header__link--activ" : "header__link"} >Friends</NavLink>
        </div>

        <div className="flex justify-between items-center" >
          {userIsLogged && userData &&
          <>
            <button onClick={handleLogout} className="header__link">
              Logout
            </button>
            <NavLink to="/profile" className={({isActive}) => isActive? "header__link--activ" : "header__link"} > 
              Profil
            </NavLink>
            <NavLink to="/profile" className="header__link-avatar" > 
              {userData.avatar && 
              <img 
                src={`http://localhost:3000/avatars/` + userData.avatar}
                className="text-center p-2 w-full h-24"
                alt="avatar"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src="http://localhost:3000/avatars/defaultAvatar.png"
                }}
              />}
            </NavLink>
          </>
          }
          {!userIsLogged &&
            <p className="header__link" >
              <Link to="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOAuth&response_type=code">
                Login
              </Link>
            </p>
          }
        </div>
      </div>
      <div className="h-1 bg-indigo-700 w-full shadow-lg shadow-cyan-500/50" > </div>
    </div>
  )
}

export default Header

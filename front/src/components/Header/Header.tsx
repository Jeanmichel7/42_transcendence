import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLogged, setLogout } from '../../store/userSlice';
import {
  ApiErrorResponse,
  NotificationInterface,
  UserInterface,
} from '../../types';
import { RootState } from '../../store';
import { AuthLogout } from '../../types/AuthTypes';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';

import NotificationItem from './NotificationItem';
import { logout } from '../../api/auth';

import { Badge, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import useConnection from './useConnection';

import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import InfoIcon from '@mui/icons-material/Info';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const API_URL = import.meta.env.VITE_API_URL;

function Header() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [activePath, setActivePath] = useState('');
  const [notifNotRead, setNotifNotRead] = useState<number>(0);
  const [notifOpen, setNotifOpen] = useState<boolean>(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const userData: UserInterface = useSelector(
    (state: RootState) => state.user.userData,
  );
  const userIsLogged: boolean = useSelector(
    (state: RootState) => state.user.isLogged,
  );
  const { notifications } = useSelector(
    (state: RootState) => state.notification,
  );

  useConnection();

  useEffect(() => {
    if (notifNotRead > 0) setNotifOpen(true);
  }, [notifNotRead]);

  useEffect(() => {
    if (location.pathname) setActivePath(location.pathname.split('/')[1]);
  }, [location]);

  useEffect(() => {
    const nbMotifNotRead = notifications.filter(
      (n: NotificationInterface) => !n.read,
    ).length;
    setNotifNotRead(nbMotifNotRead);

    if (
      userData.id === undefined ||
      userData.id == -1 ||
      !notifications ||
      notifications.length == 0
    )
      return;
    localStorage.setItem(
      'notifications' + userData.id,
      JSON.stringify(notifications),
    );
  }, [notifications, userData.id]);

  //handler nav menu
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  //handlers user menu
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // handler notifications
  const handleOpenNotif = () => {
    setNotifOpen(true);
  };
  const handleCloseNotif = () => {
    setNotifOpen(false);
  };

  async function handleLogout() {
    const res: AuthLogout | ApiErrorResponse = await logout();
    if ('error' in res) dispatch(setErrorSnackbar(res));
    else {
      dispatch(setLogout());
      dispatch(setLogged(false));
      dispatch(setMsgSnackbar('Logout success'));
      navigate('/');
    }
  }

  const notificationMenu = (
    <div
      ref={notificationsRef}
      className="fixed top-[20px] right-[100px] z-index-1000
     border-2 border-gray-400 rounded-sm text-gray-700"
    >
      {notifications.map(
        (notification: NotificationInterface, index: number) => (
          <NotificationItem
            key={index}
            notification={notification}
            setNotifOpen={setNotifOpen}
          />
        ),
      )}
    </div>
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        handleCloseNotif();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsRef, setNotifOpen]);

  return (
    <Box className="bg-blue-700 text-white flex justify-between items-center fixed w-full h-[56px] z-50">
      {/**
       * Display Menu pages on small screen
       */}
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-page"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
          sx={{ marginRight: 8 }}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-page"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: 'block', md: 'none' },
            marginTop: '5px',
            marginLeft: '-15px',
          }}
        >
          <NavLink to="/game">
            <MenuItem onClick={handleCloseNavMenu}>
              <SportsEsportsIcon className="m-2" />
              Game
            </MenuItem>
          </NavLink>
          <Divider />

          <NavLink to="/chat">
            <MenuItem onClick={handleCloseNavMenu}>
              <ChatIcon className="m-2" />
              Chat
            </MenuItem>
          </NavLink>
          <Divider />

          <NavLink to="/friends">
            <MenuItem onClick={handleCloseNavMenu}>
              <GroupIcon className="m-2" />
              Friends
            </MenuItem>
          </NavLink>
          <Divider />

          <NavLink to={'/profile/' + userData.login}>
            <MenuItem onClick={handleCloseNavMenu}>
              <PersonSearchIcon className="m-2" />
              Profile
            </MenuItem>
          </NavLink>
          <Divider />

          <NavLink to="/leaderboard">
            <MenuItem onClick={handleCloseNavMenu}>
              <LeaderboardIcon className="m-2" />
              Leaderboard
            </MenuItem>
          </NavLink>
        </Menu>
      </Box>

      <Box sx={{ display: { xs: 'flex', md: 'none' }, padding: 0 }}>
        <NavLink to="/game" className="">
          <Typography
            variant="h5"
            noWrap
            sx={{
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            PONG
          </Typography>
        </NavLink>
      </Box>

      {/**
       * Display pages on large screen
       */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, padding: 0 }}>
        <NavLink to="/game" className="flex justify-center items-center">
          <IconButton sx={{ padding: 0 }}>
            <img
              src="/pong-nav.png"
              className="text-center h-[56px] w-[56px] mr-3"
            />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            PONG
          </Typography>
        </NavLink>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: { xs: 'none', md: userIsLogged ? 'flex' : 'none' },
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <NavLink
          to="/game"
          className={`h-full flex justify-center items-center px-3
          ${activePath === 'game' ? 'bg-blue-600' : 'initial'} `}
        >
          <Button
            sx={{
              color: 'white',
              paddingX: 1,
              paddingY: 1,
              ':hover': { backgroundColor: 'rgb(59 130 246)' },
            }}
          >
            <SportsEsportsIcon className="mr-2" />
            <p className="mt-0.5">Game</p>
          </Button>
        </NavLink>

        <NavLink
          to="/chat"
          className={`h-full flex justify-center items-center px-3
         ${activePath === 'chat' ? 'bg-blue-600' : 'initial'} `}
        >
          <Button
            sx={{
              color: 'white',
              paddingX: 1,
              paddingY: 1,
              ':hover': { backgroundColor: 'rgb(59 130 246)' },
            }}
          >
            <ChatIcon className="mr-2" />
            <p className="mt-0.5">Chat</p>
          </Button>
        </NavLink>

        <NavLink
          to="/friends"
          className={`h-full flex justify-center items-center px-3
          ${activePath === 'friends' ? 'bg-blue-600' : 'initial'} `}
        >
          <Button
            sx={{
              color: 'white',
              paddingX: 1,
              paddingY: 1,
              ':hover': { backgroundColor: 'rgb(59 130 246)' },
            }}
          >
            <GroupIcon className="mr-2" />
            <p className="mt-0.5">Friends</p>
          </Button>
        </NavLink>

        <NavLink
          to={'/profile/' + userData.login}
          className={`h-full flex justify-center items-center px-3
          ${activePath === 'profile' ? 'bg-blue-600' : 'initial'} `}
        >
          <Button
            sx={{
              color: 'white',
              paddingX: 1,
              paddingY: 1,
              ':hover': { backgroundColor: 'rgb(59 130 246)' },
            }}
          >
            <PersonSearchIcon className="mr-2" />
            <p className="mt-0.5">Profile</p>
          </Button>
        </NavLink>

        <NavLink
          to="/leaderboard"
          className={`h-full flex justify-center items-center px-3
          ${activePath === 'leaderboard' ? 'bg-blue-600' : 'initial'} `}
        >
          <Button
            sx={{
              color: 'white',
              paddingX: 1,
              paddingY: 1,
              ':hover': { backgroundColor: 'rgb(59 130 246)' },
            }}
          >
            <LeaderboardIcon className="mr-2" />
            <p className="mt-0.5">Leaderboard</p>
          </Button>
        </NavLink>
      </Box>

      {/**
       * Always display
       */}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // height: "100%",
        }}
      >
        <Box>
          <Tooltip title={`${notifications.length} notifications`} arrow>
            <IconButton
              size="large"
              aria-label="show new notifications"
              color="inherit"
              onClick={handleOpenNotif}
            >
              <Badge
                badgeContent={
                  notifications.filter((n: NotificationInterface) => !n.read)
                    .length
                }
                color="error"
              >
                {notifications.filter((n: NotificationInterface) => !n.read)
                  .length ? (
                  <NotificationsActiveIcon />
                ) : notifications.length ? (
                  <NotificationsIcon />
                ) : (
                  <NotificationsNoneIcon />
                )}
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>

        <Tooltip title="Open settings" arrow>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleOpenUserMenu}
            color="inherit"
          >
            {userData.avatar && (
              <Avatar
                alt="avatar"
                src={userData.avatar}
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = API_URL + '/avatars/defaultAvatar.png';
                }}
                sx={{ width: 32, height: 32 }}
              />
            )}
          </IconButton>
        </Tooltip>

        <Menu
          id="menu-appbar"
          anchorEl={anchorElUser}
          sx={{
            mt: '2px',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <NavLink to="/about">
            <MenuItem onClick={handleCloseUserMenu}>
              <InfoIcon className="mr-2" />
              About
            </MenuItem>
          </NavLink>

          <NavLink to="/account">
            <MenuItem onClick={handleCloseUserMenu}>
              <SettingsIcon className="mr-2" />
              Account
            </MenuItem>
          </NavLink>

          <NavLink to={`/achievement/${userData.login}`}>
            <MenuItem onClick={handleCloseUserMenu}>
              <EmojiEventsIcon className="mr-2" />
              Achievement
            </MenuItem>
          </NavLink>

          <Divider />

          <div>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon className="mr-2" />
              Logout
            </MenuItem>
          </div>
        </Menu>
        {notifOpen && notificationMenu}
      </Box>
    </Box>
  );
}

export default Header;

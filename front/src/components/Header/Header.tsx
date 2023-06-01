import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../../store/userSlice';

import { logout } from '../../api/auth';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';


function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  /* redux */
  const userData: any = useSelector((state: any) => state.user.userData);
  const userIsLogged: any = useSelector((state: any) => state.user.isLogged);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  async function handleLogout() {
    const res = await logout();
    if (res.error) {
      // console.log(res);
    } else {
      dispatch(setLogout());
      navigate('/');
    }
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/**
           * Display Icon and Title on large screen
           */}
          <IconButton sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} >
            <img src='/pong-nav.png' className="text-center p-2 rounded-full w-full h-12" />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/game"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Pong
          </Typography>


          {/**
           * Display Menu pages on small screen
           */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
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
              }}
            >
              <NavLink to="/game">
                <MenuItem onClick={handleCloseNavMenu}>
                  Play
                </MenuItem>
              </NavLink>
              <NavLink to="/chat">
                <MenuItem onClick={handleCloseNavMenu}>
                  Chat
                </MenuItem>
              </NavLink>
              <NavLink to="/friends">
                <MenuItem onClick={handleCloseNavMenu}>
                  Friends
                </MenuItem>
              </NavLink>
              <NavLink to={'/profile/' + userData.login}>
                <MenuItem onClick={handleCloseNavMenu}>
                  Profile
                </MenuItem>
              </NavLink>

            </Menu>
          </Box>


          {/**
           * Display Icon and Title on small screen
           */}
          <IconButton sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} >
            <img src='/pong-nav.png' className="text-center p-2 rounded-full w-full h-12" />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/game"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Pong
          </Typography>


          {/**
           * Display pages on large screen
           */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: userIsLogged ? 'flex' : 'none' } }}>
            <NavLink to="/game">
              <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }} >
                Play
              </Button>
            </NavLink>

            <NavLink to="/chat">
              <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }} >
                Chat
              </Button>
            </NavLink>

            <NavLink to="/friends">
              <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }} >
                Friends
              </Button>
            </NavLink>

            <NavLink to={'/profile/' + userData.login}>
              <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }} >
                Profile
              </Button>
            </NavLink>
          </Box>



          {/**
           * Display Menu icon user
           */}
          <Box sx={{ flexGrow: 0 }}>
            {!userIsLogged ?
              <NavLink to="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOAuth&response_type=code">
                <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }} >
                  Login
                </Button>
              </NavLink>
              :
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="avatar" src={'http://localhost:3000/avatars/' + userData.avatar}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
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
                  <NavLink to='/account'>
                    <MenuItem onClick={handleCloseUserMenu}>
                      Account
                    </MenuItem>
                  </NavLink>

                  <NavLink to='/' onClick={handleLogout}>
                    <MenuItem onClick={handleCloseUserMenu}>
                      Logout
                    </MenuItem>
                  </NavLink>
                </Menu>
              </>
            }
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;

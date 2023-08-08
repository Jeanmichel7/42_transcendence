import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLogged, setLogout } from "../../store/userSlice";
import {
  ApiErrorResponse,
  NotificationInterface,
  UserInterface,
} from "../../types";
import { RootState } from "../../store";
import { AuthLogout } from "../../types/AuthTypes";
import { setErrorSnackbar, setMsgSnackbar } from "../../store/snackbarSlice";

import NotificationItem from "./NotificationItem";
import { logout } from "../../api/auth";

import { Badge } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import useConnection from "./useConnection";
import styled, { keyframes } from "styled-components";

const animationAppBar = keyframes` 
  0%{
    transform: translateY(-100%);
  }
  100%{
    transform: translateY(0%);
  }
`;

const StyledAppBar = styled(AppBar)`
  animation: ${animationAppBar} 1.5s ease-in-out;
`;

function Header() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotification, setAnchorElNotification] =
    useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activePath, setActivePath] = useState("/game");
  const handleNavigation = (path: string) => {
    setActivePath(path);
  };

  const userData: UserInterface = useSelector(
    (state: RootState) => state.user.userData
  );
  const userIsLogged: boolean = useSelector(
    (state: RootState) => state.user.isLogged
  );
  const { notifications } = useSelector(
    (state: RootState) => state.notification
  );

  useConnection();

  useEffect(() => {
    if (
      userData.id === undefined ||
      userData.id == -1 ||
      !notifications ||
      notifications.length == 0
    )
      return;
    localStorage.setItem(
      "notifications" + userData.id,
      JSON.stringify(notifications)
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
  const handleOpenNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    console.log('activ')
    setAnchorElNotification(event.currentTarget);
  };
  const handleCloseNotificationMenu = () => {
    setAnchorElNotification(null);
  };

  async function handleLogout() {
    const res: AuthLogout | ApiErrorResponse = await logout();
    if ("error" in res) {
      dispatch(
        setErrorSnackbar(res.error + res.message ? ": " + res.message : "")
      );
    } else {
      dispatch(setLogout());
      dispatch(setLogged(false));
      dispatch(setMsgSnackbar("Logout success"));
      navigate("/");
    }
  }

  const renderMobileNotification = (
    <Box sx={{ display: { xs: "flex flex-raw", md: "none" } }}>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show new notifications"
          color="inherit"
          onClick={handleOpenNotificationMenu}
        >
          <Badge
            badgeContent={
              notifications.filter((n: NotificationInterface) => !n.read).length
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
        <p>Notifications</p>
      </MenuItem>
    </Box>
  );

  const renderStandardNotification = (
    <Box>
      <IconButton
        size="large"
        aria-label="show new notifications"
        color="inherit"
        onClick={handleOpenNotificationMenu}
      >
        <Badge
          badgeContent={
            notifications.filter((n: NotificationInterface) => !n.read).length
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
    </Box>
  );

  const notificationMenu = (
    <Menu
      sx={{ mt: "55px" }}
      id="menu-appbar"
      anchorEl={anchorElNotification}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      // keepMounted
      transformOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={Boolean(anchorElNotification) && notifications.length > 0}
      onClose={handleCloseNotificationMenu}
    >
      {notifications.map(
        (notification: NotificationInterface, index: number) => (
          <NotificationItem
            key={index}
            notification={notification}
            setAnchorElNotification={setAnchorElNotification}
          />
        )
      )}
    </Menu>
  );

  if (!userData.id) return null;
  return (
    <StyledAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/**
           * Display Icon and Title on large screen
           */}
          <IconButton sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
            <img
              src="/pong-nav.png"
              className="text-center p-2 rounded-full w-full h-12"
            />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/game"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Pong
          </Typography>

          {/**
           * Display Menu pages on small screen
           */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <NavLink to="/game">
                <MenuItem onClick={handleCloseNavMenu}>Play</MenuItem>
              </NavLink>

              <NavLink to="/leaderboard">
                <MenuItem onClick={handleCloseNavMenu}>Leaderboard</MenuItem>
              </NavLink>

              <NavLink to="/chat">
                <MenuItem onClick={handleCloseNavMenu}>Chat</MenuItem>
              </NavLink>

              <NavLink to="/friends">
                <MenuItem onClick={handleCloseNavMenu}>Friends</MenuItem>
              </NavLink>

              <NavLink to={"/profile/" + userData.login}>
                <MenuItem onClick={handleCloseNavMenu}>Profile</MenuItem>
              </NavLink>
            </Menu>
          </Box>

          {/**
           * Display Icon and Title on small screen
           */}
          <IconButton sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
            <img
              src="/pong-nav.png"
              className="text-center p-2 rounded-full w-full h-12"
            />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/game"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Pong
          </Typography>

          {/**
           * Display pages on large screen
           */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: userIsLogged ? "flex" : "none" },
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <NavLink to="/game">
              <Button
                onClick={() => handleNavigation("/game")}
                sx={{
                  color: "white",
                  display: "block",
                  backgroundColor:
                    activePath === "/game" ? "#669bda" : "initial",
                  "&:hover": {
                    backgroundColor:
                      activePath === "/game" ? "#669bda" : "initial",
                  },
                }}
              >
                Play
              </Button>
            </NavLink>

            <NavLink to="/leaderboard">
              <Button
                onClick={() => handleNavigation("/leaderboard")}
                sx={{
                  color: "white",
                  display: "block",
                  backgroundColor:
                    activePath === "/leaderboard" ? "#669bda" : "initial",
                  "&:hover": {
                    backgroundColor:
                      activePath === "/leaderboard" ? "#669bda" : "initial",
                  },
                }}
              >
                Leaderboard
              </Button>
            </NavLink>

            <NavLink to="/chat">
              <Button
                onClick={() => handleNavigation("/chat")}
                sx={{
                  color: "white",
                  display: "block",
                  backgroundColor:
                    activePath === "/chat" ? "#669bda" : "initial",
                  "&:hover": {
                    backgroundColor:
                      activePath === "/chat" ? "#669bda" : "initial",
                  },
                }}
              >
                Chat
              </Button>
            </NavLink>

            <NavLink to="/friends">
              <Button
                onClick={() => handleNavigation("/friends")}
                sx={{
                  color: "white",
                  display: "block",
                  backgroundColor:
                    activePath === "/friends" ? "#669bda" : "initial",
                  "&:hover": {
                    backgroundColor:
                      activePath === "/friends" ? "#669bda" : "initial",
                  },
                }}
              >
                Friends
              </Button>
            </NavLink>

            <NavLink to={"/profile/" + userData.login}>
              <Button
                onClick={() => handleNavigation("/profile/")}
                sx={{
                  color: "white",
                  display: "block",
                  backgroundColor:
                    activePath === "/profile/" ? "#669bda" : "initial",
                  "&:hover": {
                    backgroundColor:
                      activePath === "/profile/" ? "#669bda" : "initial",
                  },
                }}
              >
                Profile
              </Button>
            </NavLink>
          </Box>

          {/**
           * Display Menu icon user
           */}
          <Box sx={{ flexGrow: 1 }} />
          {userIsLogged == false && (
            <div className="flex">
              <NavLink to="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOAuth&response_type=code">
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Login Intra
                </Button>
              </NavLink>
              <NavLink to="/fakeconnection">
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Login Fake
                </Button>
              </NavLink>
            </div>
          )}
          {userIsLogged && (
            <>
              {renderStandardNotification}
              {/**
               *       always display
               */}
              <Tooltip title="Open settings">
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleOpenUserMenu}
                  color="inherit"
                >
                  {userData.avatar && (
                    <Avatar
                      alt="avatar"
                      src={userData.avatar}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src =
                          "http://localhost:3000/avatars/defaultAvatar.png";
                      }}
                    />
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >

                <NavLink to="/account">
                  <MenuItem onClick={handleCloseUserMenu}>Account</MenuItem>
                </NavLink>

                <NavLink to="/" onClick={handleLogout}>
                  <MenuItem onClick={handleCloseUserMenu}>Logout</MenuItem>
                </NavLink>
              </Menu>
              {/* {renderMobileNotification} */}

              {/** Menu notifications */}
              {notificationMenu}
            </>
          )}
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}
export default Header;

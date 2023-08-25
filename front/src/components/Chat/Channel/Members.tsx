import {
  Badge,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  ApiErrorResponse,
  GameInterface,
  RoomInterface,
  UserInterface,
  UserRelation,
} from '../../../types';
import { useEffect, useState } from 'react';
import DisplayImg from '../../../utils/displayImage';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { requestAddFriend } from '../../../api/relation';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';
import { reduxAddWaitingFriendsSent } from '../../../store/userSlice';
import { useDispatch } from 'react-redux';
import { inviteGameUser } from '../../../api/game';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const MembersCard = ({ user }: { user: UserInterface }) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isLoadingDefi, setIsLoadingDefi] = useState<boolean>(false);
  const [isLoadingFriendRequest, setIsLoadingFriendRequest] =
    useState<boolean>(false);
  const dispatch = useDispatch();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleRequestAddFriend = async () => {
    if (!user) return;
    setIsLoadingFriendRequest(true);
    const res: UserRelation | ApiErrorResponse = await requestAddFriend(
      user.id,
    );
    if ('error' in res) dispatch(setErrorSnackbar(res));
    else {
      dispatch(reduxAddWaitingFriendsSent(user));
      dispatch(setMsgSnackbar('Request sent'));
    }
    handleCloseUserMenu();
    setTimeout(() => {
      setIsLoadingFriendRequest(false);
    }, 3 * 1000);
  };

  const handleDefi = async () => {
    setIsLoadingDefi(true);
    const resInvitGameUser: GameInterface | ApiErrorResponse =
      await inviteGameUser(user.id);
    if ('error' in resInvitGameUser)
      return dispatch(setErrorSnackbar(resInvitGameUser));
    dispatch(setMsgSnackbar('Invitation sent'));
    handleCloseUserMenu();
    setTimeout(() => {
      setIsLoadingDefi(false);
    }, 3 * 1000);
  };

  return (
    <>
      {!user ? null : (
        <div className="flex flex-grow text-black p-1 items-center font-bold hover:bg-gray-200 rounded-md">
          <Link
            key={user.id}
            to={'/profile/' + user.login}
            className="flex items-center font-bold hover:bg-gray-200 rounded-md "
          >
            <Badge
              color={
                user.status === 'online'
                  ? 'success'
                  : user.status === 'absent'
                  ? 'warning'
                  : user.status === 'inactive'
                  ? 'secondary'
                  : user.status === 'in game'
                  ? 'info'
                  : 'error'
              }
              overlap="circular"
              badgeContent=" "
              variant="dot"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              sx={{
                '.MuiBadge-badge': {
                  transform: 'scale(1.2) translate(-25%, 25%)',
                },
              }}
            >
              <Badge
                overlap="circular"
                variant="dot"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                sx={{
                  '.MuiBadge-badge': {
                    transform: 'scale(1.6) translate(-5%, 32%)',
                    backgroundColor: 'white',
                  },
                }}
              >
                <DisplayImg
                  src={user.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover mr-2"
                />
              </Badge>
            </Badge>
            <Typography
              component="span"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                fontFamily: '"Alegreya Sans SC", sans-serif',
                fontWeight: 'bold',
              }}
              title={user.login}
            >
              {user.login.length > 15
                ? user.login.slice(0, 12) + '...'
                : user.login}
            </Typography>
          </Link>

          <Tooltip
            title="More actions"
            placement="top"
            arrow
            enterDelay={500}
            leaveDelay={200}
            PopperProps={{ disablePortal: true }}
          >
            <IconButton
              aria-label="more"
              size="small"
              sx={{ ml: 'auto' }}
              className="hover:bg-gray-200"
              onClick={handleOpenUserMenu}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="room-list-member-actions"
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
            sx={{
              '& .MuiDivider-root': {
                margin: 0,
                padding: 0,
              },
              '& .MuiMenu-list': {
                padding: 0,
                margin: 0,
              },
            }}
          >
            <MenuItem
              onClick={handleRequestAddFriend}
              sx={{ padding: 0, margin: 0 }}
            >
              <p className="pl-3">Add </p>
              <IconButton color="success" disabled={isLoadingFriendRequest}>
                <PersonAddOutlinedIcon />
              </IconButton>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleDefi} sx={{ padding: 0, margin: 0 }}>
              <p className="pl-3">Defi</p>
              <IconButton color="info" disabled={isLoadingDefi}>
                <SportsEsportsIcon />
              </IconButton>
            </MenuItem>
          </Menu>
        </div>
      )}
    </>
  );
};

interface ChatMembersProps {
  room: RoomInterface;
}

const ChatMembers = ({ room }: ChatMembersProps) => {
  const [userWithoutAdmins, setUserWithoutAdmins] = useState<
    UserInterface[] | null
  >(null);
  const [acceptedusersWithoudBot, setAcceptedUsersWithoutBot] = useState<
    UserInterface[] | null
  >(null);

  useEffect(() => {
    if (!room.admins || !room.users) return;
    setUserWithoutAdmins(
      room.users.filter(u => !room.admins?.some(a => a.id === u.id)),
    );
  }, [room.admins, room.users]);

  useEffect(() => {
    if (!room.acceptedUsers) return;
    setAcceptedUsersWithoutBot(room.acceptedUsers.filter(u => u.id != 0));
  }, [room.acceptedUsers]);

  return (
    <div
      className="hidden md:block bg-gray-200 border-l-2 border-gray-300
      overflow-auto"
    >
      {room.admins && (
        <>
          <h3 className="font-bold text-blue-600 p-1 mb-1 bg-gray-300 text-center">
            ADMINS - {room.admins.length}
          </h3>
          {room.admins.map(user => (
            <MembersCard key={user.id} user={user} />
          ))}
        </>
      )}

      {userWithoutAdmins && (
        <>
          <h3 className="font-bold text-blue-600 p-1 my-1 bg-gray-300 text-center">
            MEMBERS - {userWithoutAdmins.length}
          </h3>
          {userWithoutAdmins.map(user => (
            <MembersCard key={user.id} user={user} />
          ))}
        </>
      )}

      {acceptedusersWithoudBot && acceptedusersWithoudBot.length > 0 && (
        <>
          <h3 className="font-bold text-blue-600 p-1 my-1 bg-gray-300 text-center">
            WAITING - {acceptedusersWithoudBot.length}
          </h3>
          {acceptedusersWithoudBot.map(user => {
            if (user.id === 0) return null;
            return <MembersCard key={user.id} user={user} />;
          })}
        </>
      )}
    </div>
  );
};

export default ChatMembers;

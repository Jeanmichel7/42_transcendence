import { useDispatch, useSelector } from 'react-redux';
import { reduxRemoveFriends, reduxAddUserBlocked, reduxAddWaitingFriendsSent } from '../../store/userSlice';
import { RootState } from '../../store';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { Link, useNavigate } from 'react-router-dom';

import { deleteFriend, apiBlockUser, requestAddFriend } from '../../api/relation';
import { ApiErrorResponse, GameInterface, UserInterface, UserRelation } from '../../types';

import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, IconButton, Tooltip, Zoom, Divider } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AddIcon from '@mui/icons-material/Add';
import { red } from '@mui/material/colors';
import { useState } from 'react';
import { inviteGameUser } from '../../api/game';
import ChatIcon from '@mui/icons-material/Chat';


interface FriendCardProps {
  actualUserLogin?: string,
  friend: UserInterface,
  setFriends?: React.Dispatch<React.SetStateAction<UserInterface[]>> 
}

const FriendCard:  React.FC<FriendCardProps> = ({
  actualUserLogin,
  friend,
  setFriends,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, userFriends, waitingFriendsRequestSent } = useSelector((state: RootState) => state.user);
  // const [ isFriendRequestSent, setIsFriendRequestSent ] = useState(false);
  // const descriptionParsed = friend.description ? friend.description.substring(0, 24) + '...' : 'No description';
  // const badgeColor = 
  //   friend.status === 'online' ? 'success' :
  //     friend.status === 'absent' ? 'warning' :
  //       friend.status === 'inactive' ? 'secondary' :
  //         friend.status === 'in game' ? 'info' :
  //           'error';

  const handleDefi = async () => {
    const resInvitGameUser: GameInterface | ApiErrorResponse =
       await inviteGameUser(friend.id);
    if ('error' in resInvitGameUser)
      return dispatch(setErrorSnackbar(resInvitGameUser.error + resInvitGameUser.message ? ': ' + resInvitGameUser.message : ''));
    dispatch(setMsgSnackbar('Invitation sent'));
  };

  function isRequestFriendSent() {
    return waitingFriendsRequestSent?.some((f: UserInterface) => f.id === friend.id);
  }

  const handleRequestAddFriend = async (userIdToAdd: number) => {
    // const res: UserRelation | ApiErrorResponse = await addFriend(userIdToAdd);
    if (isRequestFriendSent()) return;
    setIsLoading(true);
    const res: UserRelation | ApiErrorResponse = await requestAddFriend(userIdToAdd);
    if ('error' in res) {
      dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    } else {
      dispatch(reduxAddWaitingFriendsSent(friend));
      dispatch(setMsgSnackbar('Request sent'));
    }
    setIsLoading(false);
  };
  
  const handleRemoveFriend = async (userIdToRemove: number) => {
    setIsLoading(true);
    const res: void | ApiErrorResponse = await deleteFriend(userIdToRemove);
    if (typeof res === 'object' && 'error' in res) {
      dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    } else {
      dispatch(reduxRemoveFriends(friend.id));
      dispatch(setMsgSnackbar('Friend deleted'));
      if (userData.login == actualUserLogin && setFriends)
        setFriends((prev: UserInterface[]) => prev.filter((f: UserInterface) => f.id !== userIdToRemove));
    }
    setIsLoading(false);
  };

  const handleBlockUser = async (userToBlock: UserInterface) => {
    setIsLoading(true);
    const res: UserRelation | ApiErrorResponse = await apiBlockUser(userToBlock.id);
    if ('error' in res) {
      dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    } else {
      dispatch(setMsgSnackbar('User blocked'));
      dispatch(reduxAddUserBlocked(userToBlock.id));
      if (userData.login == actualUserLogin && setFriends)
        setFriends((prev: UserInterface[]) => prev.filter((f: UserInterface) => f.id !== userToBlock.id));
    }
    setIsLoading(false);
  };

  function isMyFriend() {
    if (userData.login == friend.login) // if it's own profile
      return true;
    return userFriends?.find((f: UserInterface) => f.id === friend.id);
  }

  return (
    <Card key={friend.login} sx={{
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 140,
      maxHeight: 332,
      margin: '10px',
    }}>
      <Link to={`/profile/${friend.login}`}>
        <CardActionArea>
          {/* <Badge
            color={badgeColor}
            overlap="circular"
            // badgeContent=""
          > */}
            <CardMedia
              component="img"
              image={friend.avatar}
              alt={friend.login}
              sx={{ height: 140, objectFit: 'cover' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
              }}
            />
            <Divider/>
          {/* </Badge> */}
          <CardContent sx={{ padding: 1 }}>
            <Typography gutterBottom variant="h2" component="div" 
              sx={{ 
                marginBottom: 2,
                fontSize: '1.1rem',
                overflow: 'hidden',
                textOverflow: 'nowrap',
                textAlign: 'center',
              }}
              title={friend.firstName + ' ' + friend.lastName}
            >
              {friend.firstName} {friend.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" 
              sx={{ height: 56, overflow: 'hidden', textOverflow: 'ellipsis' }}
              title={friend.description}
            >
              { friend.description }
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>

      <div className="flex-grow"></div>


      <Divider/>
      {/**
       * Bouton action
       **/}
      <CardActions className='flex flex-wrap items-center justify-between w-full'>
        <Tooltip
          title="Defier" arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton aria-label="defi friend"
            onClick={handleDefi}
            sx={{ margin:0, padding:0 }}
          >
            <SportsEsportsIcon color='info' />
          </IconButton>
        </Tooltip>

        { !isMyFriend() ?
        <Tooltip
          title={ isRequestFriendSent() ? 'Waiting accept' : 'Add friend' }
          arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
          >
            <div>
              <IconButton aria-label="add friend"
                sx={{ margin: 0, padding: 0 }}
                onClick={() => handleRequestAddFriend(friend.id)}
                disabled={isRequestFriendSent() || isLoading}
              >
                <AddIcon color={isRequestFriendSent() ? 'disabled' : 'primary'} />
              </IconButton>
            </div>
          </Tooltip> 
          :
        <>
          { userData.id != friend.id &&
            <Tooltip
            title={'Chat'}
            arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
          >
            <div>
              <IconButton aria-label="chat friend"
                sx={{ margin: 0, padding: 0, paddingLeft:1 }}
                onClick={() => navigate(`/chat/conv/x/${friend.id}/${friend.login}`)}
              >
                <ChatIcon color='primary' />
              </IconButton>
            </div>
          </Tooltip>
          }
        </>

        }

        {userData && userData.login == actualUserLogin &&
          <>
            <Tooltip
              title="Delete friend" arrow
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 600 }}
            >
              <IconButton aria-label="delete friend"
                sx={{ margin:0, padding:0 }}
                onClick={() => handleRemoveFriend(friend.id)}
                disabled={isLoading}
              >
                <DeleteForeverIcon sx={{ color: red[800] }} />
              </IconButton>
            </Tooltip>

            <Tooltip
              title="Block user" arrow
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 600 }}
            >
              <IconButton aria-label="delete friend"
                onClick={() => handleBlockUser(friend)}
                sx={{ margin:0, padding:0 }}
                disabled={isLoading}
              >
                <RemoveCircleIcon sx={{ color: red[800] }} />
              </IconButton>
            </Tooltip>
          </>
        }
      </CardActions>
    </Card>
  );
};

export default FriendCard;
import { useDispatch, useSelector } from 'react-redux';
import { reduxRemoveFriends, reduxAddUserBlocked, reduxAddWaitingFriendsSent } from '../../store/userSlice';
import { RootState } from '../../store';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { Link } from 'react-router-dom';

import { deleteFriend, apiBlockUser, requestAddFriend } from '../../api/relation';
import { ApiErrorResponse, GameInterface, UserInterface, UserRelation } from '../../types';

import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, IconButton, Tooltip, Zoom, Badge } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import AddIcon from '@mui/icons-material/Add';
import { red } from '@mui/material/colors';
import { useState } from 'react';
import { inviteGameUser } from '../../api/game';

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
  const { userData, userFriends, waitingFriendsRequestSent } = useSelector((state: RootState) => state.user);
  // const [ isFriendRequestSent, setIsFriendRequestSent ] = useState(false);
  const descriptionParsed = friend.description ? friend.description.substring(0, 24) + '...' : 'No description';
  const badgeColor: 'success' | 'warning' | 'error'
  = friend.status === 'online' ? 'success' :
    friend.status === 'absent' ? 'warning' : 'error';

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
      dispatch(reduxRemoveFriends(friend));
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
      dispatch(reduxAddUserBlocked(userToBlock));
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
    <Card key={friend.login} sx={{ maxWidth: 140, margin: '10px' }}>
      <Link to={`/profile/${friend.login}`}>
        <CardActionArea>
          <Badge
            color={badgeColor}
            overlap="circular"
            badgeContent=" "
          >
            <CardMedia
              component="img"
              image={friend.avatar}
              alt={friend.login}
              sx={{ height: 130, objectFit: 'cover' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
              }}
            />
          </Badge>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div" 
              sx={{ height: 56, overflow: 'hidden', textOverflow: 'ellipsis' }}
              title={friend.firstName + ' ' + friend.lastName}
            >
              {friend.firstName} {friend.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" 
              sx={{ height: 56, overflow: 'hidden', textOverflow: 'ellipsis' }}
              title={descriptionParsed}
            >
              {descriptionParsed}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>

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
            <SportsTennisIcon color='info' />
          </IconButton>
        </Tooltip>

        { !isMyFriend() &&
        <Tooltip
          title={ isRequestFriendSent() ? 'Waiting accept' : 'Add friend' }
          arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
          <div>
            <IconButton aria-label="add friend" 
              sx={{ margin:0, padding:0 }}
              onClick={() => handleRequestAddFriend(friend.id)}
              disabled={ isRequestFriendSent() || isLoading}
              >
              <AddIcon color={ isRequestFriendSent() ? 'disabled' : 'primary' }/>
            </IconButton>
          </div>
        </Tooltip> }

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
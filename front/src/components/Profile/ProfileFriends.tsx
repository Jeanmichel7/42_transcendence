import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reduxAddFriends, reduxRemoveFriends, reduxAddUserBlocked } from '../../store/userSlice';
import { Link } from 'react-router-dom';

import { getFriendProfile, deleteFriend, apiBlockUser, addFriend } from '../../api/relation';

import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, IconButton, Tooltip, Zoom, Badge, Snackbar, Alert } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import AddIcon from '@mui/icons-material/Add';
import { red } from '@mui/material/colors';

export interface AccountProps {
  id: number;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  description: string;
  is2FAEnabled: boolean;
  avatar: string;
  status: string;
}

export function FriendCard({
  actualUserLogin,
  setFriends,
  state,
  setState,
  setSnackBarMsg,
  id,
  login,
  firstName,
  lastName,
  description,
  avatar,
  status,
  email,
}: AccountProps & { actualUserLogin: string } & { setFriends: any } & { state: any } & { setState: any } & { setSnackBarMsg: any }) {

  const userData: any = useSelector((dataState: any) => dataState.user.userData);
  const descriptionParsed = description ? description.substring(0, 50) + '...' : 'No description';
  const badgeColor: 'success' | 'warning' | 'error'
    = status === 'online' ? 'success' : status === 'absent' ? 'warning' : 'error';

  const dispatch = useDispatch();
  const handleDefi = (userIdToDefi: number) => async () => {
    console.log(userIdToDefi);
  };

  const handleAddFriend = async (userIdToAdd: number) => {
    const res = await addFriend(userIdToAdd);
    // console.log("res to add at redux userData : ", res)
    setState({ ...state, open: true });
    if (res.error) {
      setSnackBarMsg('Error add friend: ' + res.error);
    } else {
      dispatch(reduxAddFriends({
        id: id,
        login: login,
        email: email,
        firstName: firstName,
        lastName: lastName,
        status: status,
        avatar: avatar,
        description: description,
      }));
      if (userData.login == actualUserLogin) setFriends((prev: any) => [...prev, res]);
      setSnackBarMsg('Friend added');
    }
  };
  
  const handleRemoveFriend = async (userIdToRemove: number) => {
    const res = await deleteFriend(userIdToRemove);
    setState({ ...state, open: true });
    if (res.error) {
      setSnackBarMsg('Error delete friends: ' + res.error);
    } else {
      dispatch(reduxRemoveFriends(userIdToRemove));
      setSnackBarMsg('Friend deleted');
      if (userData.login == actualUserLogin)
        setFriends((prev: any) => prev.filter((friend: any) => friend.id !== userIdToRemove));
    }
  };


  const handleBlockUser = async (userIdToBlock: number) => {
    const res = await apiBlockUser(userIdToBlock);
    setState({ ...state, open: true });
    if (res.error) {
      setSnackBarMsg('Error block user: ' + res.error);
    } else {
      setSnackBarMsg('User blocked');
      dispatch(reduxAddUserBlocked({
        id: id,
        login: login,
        email: email,
        firstName: firstName,
        lastName: lastName,
        status: status,
        avatar: avatar,
        description: description,
      }));
      if (userData.login == actualUserLogin)
        setFriends((prev: any) => prev.filter((friend: any) => friend.id !== userIdToBlock));
    }
  };


 


  function isMyFriend() {
    console.log('mes friends : ', userData.friends);
    return userData.friends.find((friend: any) => friend.id === id);
  }


  return (
    <Card key={login} sx={{ maxWidth: 200, margin: '10px' }}>
      <Link to={`/profile/${login}`}>
        <CardActionArea>
          <Badge
            color={badgeColor}
            overlap="circular"
            badgeContent=" "
          >
            <CardMedia
              component="img"
              height="140"
              image={'http://localhost:3000/avatars/' + avatar}
              alt={login}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
              }}
            />
          </Badge>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {firstName} {lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ height: 42 }}>
              {description ? descriptionParsed : 'No description'}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>



      {/**
       * Bouton action
       **/}
      <CardActions className='flex items-center justify-between w-full'>

        <Tooltip
          title="Defier" arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton aria-label="delete friend"
            onClick={handleDefi(id)}
          >
            <SportsTennisIcon color='info' />
          </IconButton>
        </Tooltip>


        { !isMyFriend() &&
        <Tooltip
          title="Add Friend" arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
            <IconButton aria-label="add friend"
              onClick={() => handleAddFriend(id)}
            >
              <AddIcon color='primary' />
            </IconButton>

        </Tooltip> }

        {userData && userData.login == actualUserLogin &&
          <>
            <Tooltip
              title="Delete friend" arrow
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 600 }}
            >
              <IconButton aria-label="delete friend"
                onClick={() => handleRemoveFriend(id)}
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
                onClick={() => handleBlockUser(id)}
              >
                <RemoveCircleIcon sx={{ color: red[800] }} />
              </IconButton>
            </Tooltip>
          </>
        }
      </CardActions>
    </Card>
  );
}









export default function ProfileFriends({ user }: any) {
  // const actuelUser: any = useSelector((state: any) => state.user.userData);
  const [friends, setFriends] = useState<AccountProps[]>([]);
  const [snackBarMsg, setSnackBarMsg] = React.useState('Friend deleted');
  const [state, setState] = React.useState({
    open: false,
    vertical: 'bottom' as 'top' | 'bottom',
    horizontal: 'right' as 'center' | 'left' | 'right',
  });
  const userData: any = useSelector((dataState: any) => dataState.user.userData);

  useEffect(() => {
    console.log('userData update : ', userData);
  }, [userData]);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setState({ ...state, open: false });
  };

  useEffect(() => {
    // if (typeof user === 'undefined')
    //   return;
    async function fetchAndSetFriendsProfile() {
      const res = await getFriendProfile(user.login);
      console.log('res get friends profile : ', res);
      if (res.error) {
        console.log(res);
      } else {
        setFriends(res);
      }
    }
    fetchAndSetFriendsProfile();
  }, [user]);


  return (
    <>
      <h2 className="text-3xl text-center mb-5">Friends</h2>
      <div className="flex items-center w-full pb-3">
        {friends.length && friends.map((friend) => {
          if (friend.login != user.login)
            return (
              <FriendCard
                key={friend.id}
                actualUserLogin={user.login}
                setFriends={setFriends}
                state={state}
                setState={setState}
                setSnackBarMsg={setSnackBarMsg}
                {...friend}
              />);
        })}
        <Snackbar
          anchorOrigin={{ vertical: state.vertical, horizontal: state.horizontal }}
          open={state.open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            {snackBarMsg}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}
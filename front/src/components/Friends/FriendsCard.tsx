import { useDispatch, useSelector } from 'react-redux';
import { reduxAddFriends, reduxRemoveFriends, reduxAddUserBlocked } from '../../store/userSlice';
import { Link } from 'react-router-dom';

import { deleteFriend, apiBlockUser, addFriend } from '../../api/relation';
import { UserInterface } from '../../types';

import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, IconButton, Tooltip, Zoom, Badge } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import AddIcon from '@mui/icons-material/Add';
import { red } from '@mui/material/colors';
import { RootState } from '../../store';
import { SnackbarInterface } from '../../types/utilsTypes';

export default function FriendCard({
  actualUserLogin,
  setFriends,
  setSnackBar,
  id,
  login,
  firstName,
  lastName,
  description,
  avatar,
  status,
  email,
  is2FAEnabled,
}: UserInterface 
& { actualUserLogin: string }
& { setFriends: React.Dispatch<React.SetStateAction<UserInterface[]>> }
& { setSnackBar: React.Dispatch<React.SetStateAction<SnackbarInterface>> },
) {
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.user);
  const descriptionParsed = description ? description.substring(0, 50) + '...' : 'No description';
  const badgeColor: 'success' | 'warning' | 'error'
  = status === 'online' ? 'success' :
    status === 'absent' ? 'warning' : 'error';



  const handleDefi = (userIdToDefi: number) => async () => {
    console.log(userIdToDefi);
  };

  const handleAddFriend = async (userIdToAdd: number) => {
    const res = await addFriend(userIdToAdd);
    setSnackBar( (prev) => ({ ...prev, open: true }) );
    if (res.error) {
      setSnackBar((prev) => ({ ...prev, message: 'Error add friend: ' + res.error }));
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
        is2FAEnabled: is2FAEnabled,
      }));
      if (userData.login == actualUserLogin)
        setFriends((prev: UserInterface[]) => [...prev, res]);
      setSnackBar((prev) => ({ ...prev, message: 'Friend added' }));
    }
  };
  
  const handleRemoveFriend = async (userIdToRemove: number) => {
    const res = await deleteFriend(userIdToRemove);
    setSnackBar( (prev) => ({ ...prev, open: true }));
    if (res.error) {
      setSnackBar((prev) => ({ ...prev, message: 'Error delete friends: ' + res.error }));
    } else {
      dispatch(reduxRemoveFriends(userIdToRemove));
      setSnackBar((prev) => ({ ...prev, message: 'Friend deleted' }));
      if (userData.login == actualUserLogin)
        setFriends((prev: UserInterface[]) => prev.filter((friend: UserInterface) => friend.id !== userIdToRemove));
    }
  };

  const handleBlockUser = async (userIdToBlock: number) => {
    const res = await apiBlockUser(userIdToBlock);
    setSnackBar((prev) => ({ ...prev, open: true }));
    if (res.error) {
      setSnackBar((prev) => ({ ...prev, message: 'Error block user: ' + res.error }));
    } else {
      setSnackBar((prev) => ({ ...prev, message: 'User blocked' }));
      dispatch(reduxAddUserBlocked({
        id: id,
        login: login,
        email: email,
        firstName: firstName,
        lastName: lastName,
        status: status,
        avatar: avatar,
        description: description,
        is2FAEnabled: is2FAEnabled,
      }));
      if (userData.login == actualUserLogin)
        setFriends((prev: UserInterface[]) => prev.filter((friend: UserInterface) => friend.id !== userIdToBlock));
    }
  };


  function isMyFriend() {
    // console.log('mes friends : ', userData.friends);
    return userData.friends?.find((friend: UserInterface) => friend.id === id);
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


        { userData && userData.friends && !isMyFriend() &&
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

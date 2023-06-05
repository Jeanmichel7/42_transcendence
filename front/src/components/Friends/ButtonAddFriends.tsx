import { Alert, Autocomplete, Button, Snackbar, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../api/user';
import { addFriend } from '../../api/relation';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { useDispatch, useSelector } from 'react-redux';
import { reduxAddFriends } from '../../store/userSlice';
import { ApiErrorResponse, UserInterface, UserRelation } from '../../types';
import { RootState } from '../../store';


function UserCard({ user, handleAdd }: {
  user: UserInterface,
  handleAdd: (user: UserInterface | null) => void
}) {
  return (
    // <div className="m-2">
    <Card sx={{ width: 220, margin: 1 }}>
      <CardMedia
        sx={{ height: 140 }}
        title={`${user.login} avatar`}
      >
        <img
          src={'http://localhost:3000/avatars/' + user.avatar}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; 
            target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
          }}
          className="w-40 h-40 rounded-full object-cover mx-auto "
          alt="avatar"
        />
      </CardMedia>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {user.login}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          onClick={() => handleAdd(user)}
          size="small"
        >Add</Button>
      </CardActions>
    </Card>
    // </div>
  );
}









function AddFriends() {
  const [users, setUsers] = React.useState< UserInterface[] >([]);
  const [selectedUser, setSelectedUser] = useState< UserInterface | null >(null);
  const [stateSnackBar, setStateSnackBar] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = React.useState('Friend deleted');
  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUsers() {
      const allUsers: UserInterface[] | ApiErrorResponse = await getAllUsers();
      if ('error' in allUsers)
        console.log(allUsers);
      else {
        const resFiltered = allUsers.filter((u: UserInterface) =>
          u.id != userData.id && !userData.friends?.find((f: UserInterface) => f.id === u.id));
        setUsers(resFiltered);
      }
      setSelectedUser(null);
    }
    fetchUsers();
  }, [userData.id, userData.friends]);


  function isMyFriend(userId: number): boolean {
    return !!userData.friends?.find((friend: UserInterface) => friend.id === userId);
  }

  const handleAdd = async (user: UserInterface | null) => {
    if (!user)
      return;
    setStateSnackBar(true);
    const res: UserRelation | ApiErrorResponse = await addFriend(user.id);
    if ('error' in res)
      setSnackBarMsg('Error add friend: ' + res.message);
    else {
      dispatch(reduxAddFriends(user));
      setSnackBarMsg('Friend added');
      setSelectedUser(null);
    }
  };

  const handleCloseSnackBar = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') { return; }
    setStateSnackBar(false);
  };

  return (
    <div className="m-5 p-5">
      {users &&
      <Autocomplete
        id="searchFriends"
        options={users}
        getOptionLabel={(option: UserInterface) => option.login}
        style={{  }}
        onChange={(event: React.ChangeEvent<object>, newValue: UserInterface | null) => {
          event.stopPropagation();
          setSelectedUser(newValue);
        }}
        value={selectedUser}
        renderInput={(params) => <TextField {...params} label="Search Friends" variant="outlined" />}
      />
      }

      <div className="flex">
        <Button 
          onClick={() => handleAdd(selectedUser)}
          variant="contained"
        > Add </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold">Users</h2>
        <div className="flex">
          {users.map((user: UserInterface) => {
            if (user.id != userData.id && !isMyFriend(user.id))
              return (
                <UserCard
                  key={user.id}
                  user={user}
                  handleAdd={handleAdd}
                />
              );
          })}
          <Snackbar
            open={ stateSnackBar }
            autoHideDuration={6000}
            onClose={handleCloseSnackBar}
          >
            <Alert onClose={handleCloseSnackBar} severity="success" sx={{ width: '100%' }} >
              {snackBarMsg}
            </Alert>
          </Snackbar>
          
        </div>
      </div>

    </div>
  );
}
export { AddFriends };







function ButtonAddFriends({ setServiceToCall }: { setServiceToCall: (service: string) => void }) {
  return (
    <div className={`max-w-sm text-center border-2 rounded-xl shadow-lg font-mono p-3 cursor-pointer 
        hover:bg-gray-100`}
      onClick={() => setServiceToCall('addFriends')}
    >
      <h2>Add Friends</h2>
    </div>
  );
}
export default ButtonAddFriends;
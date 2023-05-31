import { Alert, Autocomplete, Button, Snackbar, TextField } from '@mui/material';
import React, { useState } from 'react';
import { getAllUsers } from '../../api/user';
import { addFriend } from '../../api/relation';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { useDispatch, useSelector } from 'react-redux';
import { reduxAddFriends } from '../../store/userSlice';


function UserCard({ user, handleAdd }: any) {
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
  const [users, setUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [stateSnackBar, setStateSnackBar] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = React.useState('Friend deleted');
  const userData: any = useSelector((state: any) => state.user.userData);
  const dispatch = useDispatch();

  React.useEffect(() => {
    async function fetchUsers() {
      const res = await getAllUsers();
      setUsers(res.filter((e: any) => e.id != userData.id));
    }
    fetchUsers();
  }, []);

  function isMyFriend(userId: number): boolean {
    // console.log("mes friends : ", userData.friends)
    return !!userData.friends.find((friend: any) => friend.id === userId);
  }

  const handleAdd = async (user: any) => {
    setStateSnackBar(true);
    const res = await addFriend(user.id);
    if (res.statusCode)
      setSnackBarMsg('Error add friend: ' + res.message);
    else {
      await new Promise(() => {
        dispatch(reduxAddFriends(user));
      }); 
      setSnackBarMsg('Friend added');
    }
  };

  const handleCloseSnackBar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setStateSnackBar(false);
  };

  return (
    <div className="m-5 p-5">
      {users &&
      <Autocomplete
        id="searchFriends"
        options={users}
        getOptionLabel={(option: any) => option.login}
        style={{  }}
        onChange={(event: any, newValue: any) => {
          event.preventDefault();
          event.stopPropagation();
          setSelectedUser(newValue);
        }}
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
          {users.map((user: any) => {
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
            <Alert onClose={handleCloseSnackBar} severity="success" sx={{ width: '100%' }}>
              {snackBarMsg}
            </Alert>
          </Snackbar>
          
        </div>
      </div>

    </div>
  );
}
export { AddFriends };







function ButtonAddFriends({ setServiceToCall }: { setServiceToCall: (service: string) => any }) {
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
import { Alert, Autocomplete, Button, Modal, Snackbar, TextField } from "@mui/material"
import React, { useEffect } from "react";
import { getAllUsers } from "../../api/user";
import { useState } from "react";
import { addFriend } from "../../api/relation";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { useDispatch, useSelector } from "react-redux";
import { setUser, setLogged, reduxAddFriends, reduxRemoveFriends, reduxAddUserBlocked } from '../../store/userSlice'


function UserCard({ user, handleAdd }: any) {
  return (
    // <div className="m-2">
    <Card sx={{ width: 220, margin: 1 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={"http://localhost:3000/avatars/" + user.avatar}
        title="green iguana"
      />
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
  const [snackBarMsg, setSnackBarMsg] = React.useState("Friend deleted");
  const userData: any = useSelector((state: any) => state.user.userData);
  const dispatch = useDispatch()

  React.useEffect(() => {
    async function fetchUsers() {
      const res = await getAllUsers();
      setUsers(res);
      console.log('res : ', res);
    }
    fetchUsers();
  }, []);

  function isMyFriend(userId: number): boolean {
    // console.log("mes friends : ", userData.friends)
    return !!userData.friends.find((friend: any) => friend.id === userId)
  }

  const handleAdd = async (user: any) => {
    setStateSnackBar(true)
    const res = await addFriend(user.id);
    if (res.statusCode)
      setSnackBarMsg("Error add friend: " + res.message)
    else{
      dispatch(reduxAddFriends(user));
      setSnackBarMsg("Friend added")
    }
  }

  const handleCloseSnackBar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setStateSnackBar(false)
  };



  return (
    <div className="m-5 p-5">
      {users && 
      <Autocomplete
        options={ users.filter((e: {id: number}) => e.id != userData.id && !isMyFriend(e.id) ) }
        getOptionLabel={(user: { login: string; }) => user.login}
        onChange={(event, newValue: any) => {
          setSelectedUser(newValue);
        }}
        renderInput={(params) => <TextField {...params} label="Search" />}
      />
      }

      <div className="flex">
        <Button 
          onClick={() => handleAdd(selectedUser)} 
          variant="contained" 
        > Add </Button>
        {/* <span className="text-red-600 ml-2">
        {
          statuses[selectedUser] == 'Friend added' ? <Alert severity="success">{statuses[selectedUser]}</Alert> :
          statuses[selectedUser] != null ? <Alert severity="error">{statuses[selectedUser]}</Alert> : ''
        }
        </span> */}
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
              )
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
};
export { AddFriends };











function ButtonAddFriends({ setServiceToCall }: { setServiceToCall: Function }) {
  return (
    <div className={`max-w-sm text-center border-2 rounded-xl shadow-lg font-mono p-3 cursor-pointer 
        hover:bg-gray-100`}
      onClick={() => setServiceToCall('addFriends')}
    >
      <h2>Add Friends</h2>
    </div>
  )
}
export default ButtonAddFriends
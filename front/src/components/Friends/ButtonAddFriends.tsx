import { Alert, Autocomplete, Button, Modal, TextField } from "@mui/material"
import React from "react";
import { getAllUsers } from "../../api/user";
import { useState } from "react";
import { addFriend } from "../../api/relation";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

function UserCard({user, handleAdd, status}: any){
  console.log("user ", user,"hein" ,status)
  return (
    <div className="m-2">
    <Card sx={{ maxWidth: 345 }}>
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
          onClick={() => handleAdd(user.id) }
          size="small"
        >Add</Button>
        <span className="text-red-600 ml-2">{
          status == 'Friend added' ? <Alert severity="success">{status}</Alert> :
          status != '' && status != undefined ? <Alert severity="error">{status}</Alert> : ''
        }</span>
      </CardActions>
    </Card>
    </div>
  );
}


function AddFriends() {
  const [users, setUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statuses, setStatuses] = useState({});

  React.useEffect(() => {
    async function fetchUsers() {
      const res = await getAllUsers();
      setUsers(res);
      console.log('res : ', res);
    }
    fetchUsers();
  }, []);

  const handleAdd = async (userId: number) => {
    console.log('selectedUser : ', )
    const res = await addFriend(userId);
    console.log('res : ', res);
    if (res.statusCode)
      setStatuses(statuses => ({ ...statuses, [userId]: res.message }));
    else
      setStatuses(statuses => ({ ...statuses, [userId]: 'Friend added' }));
  }

  return (
    <div className="m-5 p-5">
      <Autocomplete
        options={users}
        getOptionLabel={(user) => user.login}
        onChange={(event, newValue) => {
          setSelectedUser(newValue);
        }}
        renderInput={(params) => <TextField {...params} label="Search" />}
      />
      <div className="flex">
        <Button onClick={()=>handleAdd(selectedUser.id)} variant="contained" > Add </Button>
        <span className="text-red-600 ml-2">{
          statuses[selectedUser] == 'Friend added' ? <Alert severity="success">{statuses[selectedUser]}</Alert> :
          statuses[selectedUser] != null ? <Alert severity="error">{statuses[selectedUser]}</Alert> : ''
        }</span>
      </div>


      <div>
        <h2 className="text-2xl font-bold">Users</h2>
        <div className="flex">
          {users.map((user: any, index: number) => (
            <UserCard 
              key={index} 
              user={user} 
              handleAdd={handleAdd} 
              status={statuses[user.id]}
            />
          ))}
        </div>

      </div>

    </div>
  );
};
export { AddFriends };











function ButtonAddFriends({ setServiceToCall }: { setServiceToCall: Function }) {
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);


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
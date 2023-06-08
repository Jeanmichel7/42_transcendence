import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';

import { getAllUsers } from '../../../api/user';
import { addFriend, requestAddFriend } from '../../../api/relation';

import { ApiErrorResponse, UserInterface, UserRelation } from '../../../types';

// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
import { Autocomplete, Button, TextField } from '@mui/material';
// import { Link } from 'react-router-dom';
import FriendCard from '../../Profile/FriendsCard';


// function UserCard({ user, handleAdd }: {
//   user: UserInterface,
//   handleAdd: (user: UserInterface | null) => void
// }) {
//   return (
//     <Card sx={{ width: 180, margin: 1 }}>
//       <Link to={'/profile/' + user.login}>
//         <CardActionArea>
//           <CardMedia
//             title={`${user.login} avatar`}
//             sx={{ 
//               '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
//             }}
//           >
//             <img
//               src={'http://localhost:3000/avatars/' + user.avatar}
//               onError={(e) => {
//                 const target = e.target as HTMLImageElement;
//                 target.onerror = null;
//                 target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
//               }}
//               className="h-32 object-cover w-full"
//               alt="avatar"
//             />
//           </CardMedia>

//           <CardContent>
//             <Typography gutterBottom variant="h5" component="div" sx={{ paddingTop: '20px' }}>
//               {user.login}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {user.description}
//             </Typography>
//           </CardContent>
//         </CardActionArea>
//       </Link>

//       <CardActions>
//         <Button
//           variant="outlined"
//           onClick={() => handleAdd(user)}
//           size="small"
//           sx={{}}
//         >Add</Button>
//       </CardActions>
//     </Card>
//   );
// }









export default function FriendsSearch() {
  const [users, setUsers] = React.useState<UserInterface[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUsers() {
      const allUsers: UserInterface[] | ApiErrorResponse = await getAllUsers();
      if ('error' in allUsers)
        dispatch(setErrorSnackbar('Error get users: ' + allUsers.error));
      else {
        const resFiltered = allUsers.filter((u: UserInterface) =>
          u.id != userData.id && !userData.friends?.find((f: UserInterface) => f.id === u.id));
        setUsers(resFiltered);
      }
      setSelectedUser(null);
    }
    fetchUsers();
  }, [userData.id, userData.friends, dispatch]);


  function isMyFriend(userId: number): boolean {
    return !!userData.friends?.find((friend: UserInterface) => friend.id === userId);
  }

  const handleRequestAddFriend = async (user: UserInterface | null) => {
    if (!user)
      return;
    // const res: UserRelation | ApiErrorResponse = await addFriend(user.id);
    const res: UserRelation | ApiErrorResponse = await requestAddFriend(user.id);
    if ('error' in res)
      dispatch(setErrorSnackbar('Error add friend: ' + res.error));
    else {
      // send notification to user
      // dispatch(reduxAddFriends(user));
      dispatch(setMsgSnackbar('Request sent'));
      setSelectedUser(null);
    }
  };

  return (
    <div className="m-5 p-5 h-full">
      {users &&
        <Autocomplete
          id="searchFriends"
          options={users}
          getOptionLabel={(option: UserInterface) => option.login}
          style={{}}
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
          onClick={() => handleRequestAddFriend(selectedUser)}
          variant="contained"
        > Add </Button>
      </div>

      <div className='h-full'>
        <h2 className="text-2xl font-bold">Users</h2>
        <div className="flex flex-wrap overflow-auto h-full">
          {users.map((user: UserInterface) => {
            if (user.id != userData.id && !isMyFriend(user.id))
              return (
                <FriendCard
                  key={user.id}
                  actualUserLogin={userData.login}
                  friend={user}
                />
              );
          })}
        </div>
      </div>

    </div>
  );
}

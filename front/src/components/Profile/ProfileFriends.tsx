import { useEffect, useState, SyntheticEvent } from 'react';
import { getFriendProfile } from '../../api/relation';
import { Snackbar, Alert } from '@mui/material';
import { ApiErrorResponse, UserInterface } from '../../types';
import FriendCard from '../Friends/FriendsCard';
import { SnackbarInterface } from '../../types/utilsTypes';

export default function ProfileFriends({ user }: { user: UserInterface }) {
  const [friends, setFriends] = useState<UserInterface[]>([]);
  const [snackBar, setSnackBar] = useState<SnackbarInterface>({
    open: false,
    message: '',
    severity: 'success',
    vertical: 'bottom',
    horizontal: 'right',
  });

  const handleClose = (_event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') { return; }
    setSnackBar({ ...snackBar, open: false });
  };

  useEffect(() => {
    if (typeof user === 'undefined' || !user.login)
      return;
    async function fetchAndSetFriendsProfile() {
      const friendsFetched: UserInterface[] | ApiErrorResponse = await getFriendProfile(user.login);
      if ('error' in friendsFetched) {
        console.log(friendsFetched);
      } else {
        setFriends(friendsFetched);
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
                friend={friend}
                setFriends={setFriends}
                setSnackBar={setSnackBar}
                {...friend}
              />);
        })}
        <Snackbar
          anchorOrigin={{ vertical: snackBar.vertical, horizontal: snackBar.horizontal }}
          open={snackBar.open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            {snackBar.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

import { apiBlockUser, deleteFriend } from '../../api/relation';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { UserInterface, ApiErrorResponse, UserRelation } from '../../types';

import { CircularProgress } from '@mui/material';
import { reduxAddUserBlocked, reduxRemoveFriends } from '../../store/userSlice';
import { useState } from 'react';
import FriendItem from './FriendItem';

const AllFriends = () => {
  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleBlockUser = async (userToBlock: UserInterface) => {
    setIsLoading(true);
    const resBlockRequest: UserRelation | ApiErrorResponse = await apiBlockUser(userToBlock.id);
    setIsLoading(false);

    if ('error' in resBlockRequest)
      dispatch(setErrorSnackbar('Error block user: ' + resBlockRequest.message));
    else {
      dispatch(reduxAddUserBlocked(userToBlock));
      dispatch(setMsgSnackbar('User blocked'));
    }
  };

  const handleDeleteFriend = async (userToDelete: UserInterface) => {
    setIsLoading(true);
    const resDeleteRequest: void | ApiErrorResponse = await deleteFriend(userToDelete.id);
    setIsLoading(false);

    if (typeof resDeleteRequest === 'object' && 'error' in resDeleteRequest)
      dispatch(setErrorSnackbar('Error delete friend: ' + resDeleteRequest.message));
    else {
      dispatch(reduxRemoveFriends(userToDelete));
      dispatch(setMsgSnackbar('Friend deleted'));
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }
  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      { userData.friends?.length === 0 && <p> No friends</p> }
      { userData.friends?.map((user) => (
        <FriendItem 
         key={user.id}
          user={user}
          actions={[
            { name: 'Block', callback: handleBlockUser },
            { name: 'Delete', callback: handleDeleteFriend },
          ]}
        />
      ))}
    </>
  );
};

export default AllFriends;
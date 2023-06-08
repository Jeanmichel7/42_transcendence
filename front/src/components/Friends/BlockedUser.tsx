import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CircularProgress } from '@mui/material';
import { ApiErrorResponse, UserInterface } from '../../types';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { apiUnblockUser } from '../../api/relation';
import { RootState } from '../../store';
import { reduxRemoveUserBlocked } from '../../store/userSlice';
import FriendItem from './FriendItem';

const BlockedUser = () => {
  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();


  const handleUnblockUser = async (userToUnblock: UserInterface) => {
    setIsLoading(true);
    const resUnblockRequest: void | ApiErrorResponse = await apiUnblockUser(userToUnblock.id);
    setIsLoading(false);

    if (typeof resUnblockRequest === 'object' && 'error' in resUnblockRequest)
      dispatch(setErrorSnackbar('Error unblock user: ' + resUnblockRequest.message));
    else {
      dispatch(reduxRemoveUserBlocked(userToUnblock));
      dispatch(setMsgSnackbar('User unblocked'));
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
      { userData.userBlocked?.length === 0 && <p>No blocked users</p> }
      { userData.userBlocked?.map((user) => (
        <FriendItem
          key={user.id}
          user={user}
          actions={[
            { name: 'Unblock', callback: handleUnblockUser },
          ]}
        />
      ))}
    </>
  );
};
export default BlockedUser;

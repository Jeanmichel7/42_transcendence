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
  const { userBlocked } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();


  const handleUnblockUser = async (userToUnblock: UserInterface) => {
    setIsLoading(true);
    const resUnblockRequest: void | ApiErrorResponse = await apiUnblockUser(userToUnblock.id);
    setIsLoading(false);

    if (typeof resUnblockRequest === 'object' && 'error' in resUnblockRequest)
      dispatch(setErrorSnackbar(resUnblockRequest.error + resUnblockRequest.message ? ': ' + resUnblockRequest.message : ''));
    else {
      dispatch(reduxRemoveUserBlocked(userToUnblock));
      dispatch(setMsgSnackbar('User unblocked'));
    }
  };

  return (
    <>
      { !userBlocked && <p>Loading...</p>}
      { userBlocked?.length === 0 && <p>No blocked users</p> }
      { userBlocked?.map((user) => (
        <FriendItem
          key={user.id}
          user={user}
          actions={[
            { name: 'Unblock', callback: handleUnblockUser },
          ]}
          isLoading={isLoading}
        />
      ))}
      { isLoading && <CircularProgress />}
    </>
  );
};
export default BlockedUser;

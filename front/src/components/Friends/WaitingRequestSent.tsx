import { CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cancelFriendRequest } from '../../api/relation';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { UserInterface, ApiErrorResponse } from '../../types';
import { RootState } from '../../store';
import { reduxRemoveWaitingFriendsSent } from '../../store/userSlice';
import FriendItem from './FriendItem';


const WaitingRequestSent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch();

  const handleCancelFriendRequest = async (userToCancel: UserInterface) => {
    setIsLoading(true);
    const resCancelRequest: void | ApiErrorResponse = await cancelFriendRequest(userToCancel.id);
    setIsLoading(false);

    if (typeof resCancelRequest === 'object' && 'error' in resCancelRequest)
      dispatch(setErrorSnackbar(resCancelRequest.error + resCancelRequest.message ? ': ' + resCancelRequest.message : ''));
    else {
      dispatch(reduxRemoveWaitingFriendsSent(userToCancel));
      dispatch(setMsgSnackbar('Friend request canceled'));
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
    { userData.waitingFriendsRequestSent?.length === 0 && <p> No waiting request sent</p> }
    { userData.waitingFriendsRequestSent?.map((user) => (
      <FriendItem
        key={user.id}
        user={user}
        actions={[
          { name: 'Cancel', callback: handleCancelFriendRequest },
        ]}
      />
    ))}
    </>
  );
};
export default WaitingRequestSent;

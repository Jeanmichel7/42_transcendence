import { CircularProgress } from '@mui/material';
import { useState } from 'react';
import { acceptFriend, declineFriend } from '../../api/relation';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { UserInterface, ApiErrorResponse, UserRelation, NotificationInterface } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { reduxAddFriends, reduxRemoveNotification, reduxRemoveWaitingFriends } from '../../store/userSlice';
import FriendItem from './FriendItem';

const WaitingAcceptRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const notifications: NotificationInterface[] = useSelector((state: RootState) => state.user.notifications);
  const dispatch = useDispatch();

  const handleAcceptFriendRequest = async (userToAccept: UserInterface) => {
    setIsLoading(true);
    const resAcceptRequest: UserRelation | ApiErrorResponse = await acceptFriend(userToAccept.id);
    setIsLoading(false);

    if ('error' in resAcceptRequest)
      dispatch(setErrorSnackbar(resAcceptRequest.error + resAcceptRequest.message ? ': ' + resAcceptRequest.message : ''));
    else {
      dispatch(reduxRemoveWaitingFriends(userToAccept));
      dispatch(reduxAddFriends(userToAccept));

      //search notif ans delete
      const notif: NotificationInterface = notifications.find((n) => 
        n.type === 'friendRequest' && n.sender.id === userToAccept.id && n.receiver.id === userData.id, 
      ) as NotificationInterface;
      if (notif) dispatch(reduxRemoveNotification(notif));

      dispatch(setMsgSnackbar('Friend request accepted'));
    }
  };

  const handleDeclineFriendRequest = async (userToDecline: UserInterface) => {
    setIsLoading(true);
    const resDeclineRequest: void | ApiErrorResponse = await declineFriend(userToDecline.id);
    setIsLoading(false);
    
    if (typeof resDeclineRequest === 'object' && 'error' in resDeclineRequest)
      dispatch(setErrorSnackbar(resDeclineRequest.error + resDeclineRequest.message ? ': ' + resDeclineRequest.message : ''));
    else {
      dispatch(reduxRemoveWaitingFriends(userToDecline));

      //search notif ans delete
      const notif: NotificationInterface = notifications.find((n) => 
        n.type === 'friendRequest' && n.sender.id === userToDecline.id && n.receiver.id === userData.id, 
      ) as NotificationInterface;
      if (notif) dispatch(reduxRemoveNotification(notif));
      
      dispatch(setMsgSnackbar('Friend request declined'));
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
      { userData.waitingFriendsRequestReceived?.length === 0 && <p> No waiting request received</p> }
      { userData.waitingFriendsRequestReceived?.map((user) => (
        <FriendItem 
          key={user.id}
          user={user} 
          actions={[
            { name: 'Accept', callback: handleAcceptFriendRequest },
            { name: 'Decline', callback: handleDeclineFriendRequest },
          ]}
        />
      ))}
    </>
  );
};

export default WaitingAcceptRequest;
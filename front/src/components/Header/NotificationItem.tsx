import { Button, CircularProgress, IconButton, MenuItem, Tooltip, Typography, Zoom } from '@mui/material';
import { ApiErrorResponse, NotificationInterface, UserInterface, UserRelation } from '../../types';
import { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { acceptFriend, declineFriend } from '../../api/relation';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { reduxAddFriends, reduxReadNotification, reduxRemoveNotification, reduxRemoveWaitingFriends } from '../../store/userSlice';


interface NotificationItemProps {
  notification: NotificationInterface;
  // setNotifications: React.Dispatch<React.SetStateAction<NotificationInterface[]>>;
  setAnchorElNotification: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
}

const NotificationItem = ({
  notification,
  // setNotifications,
  setAnchorElNotification,
}: NotificationItemProps) => {
  // const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAcceptFriendRequest = async (userToAccept: UserInterface) => {
    setIsLoading(true);
    const resAcceptRequest: UserRelation | ApiErrorResponse = await acceptFriend(userToAccept.id);
    setIsLoading(false);

    if ('error' in resAcceptRequest)
      dispatch(setErrorSnackbar(resAcceptRequest.error + resAcceptRequest.message ? ': ' + resAcceptRequest.message : ''));
    else {
      dispatch(reduxRemoveWaitingFriends(userToAccept));
      dispatch(reduxAddFriends(userToAccept));
      dispatch(setMsgSnackbar('Friend request accepted'));
      return true;
    }
    return false;
  };

  const handleDeclineFriendRequest = async (userToDecline: UserInterface) => {
    setIsLoading(true);
    const resDeclineRequest: void | ApiErrorResponse = await declineFriend(userToDecline.id);
    setIsLoading(false);
    
    if (typeof resDeclineRequest === 'object' && 'error' in resDeclineRequest)
      dispatch(setErrorSnackbar(resDeclineRequest.error + resDeclineRequest.message ? ': ' + resDeclineRequest.message : ''));
    else {
      dispatch(reduxRemoveWaitingFriends(userToDecline));
      dispatch(setMsgSnackbar('Friend request declined'));
      return true;
    }
    return false;
  };
  
  //handler ation notif
  const handleClickNotification = (notif: NotificationInterface) => {
    setAnchorElNotification(null);
    if (notif.type === 'friendRequest')
      navigate('/friends?tab=waiting_received');
  };

  const handleClickNotificationUser = (notif: NotificationInterface) => {
    setAnchorElNotification(null);
    navigate('/profile/' + notif.sender.login);
  };


  const handleDeleteNotification = (notif: NotificationInterface) => {
    setAnchorElNotification(null);
    dispatch(reduxRemoveNotification(notif));
    // setNotifications((prev) => prev.filter((n) => n !== notif));
  };

  const handleAcceptActionNotification = async (notif: NotificationInterface) => {
    setAnchorElNotification(null);
    if (notif.type === 'friendRequest')
      if (await handleAcceptFriendRequest(notif.sender))
        handleDeleteNotification(notif);



  };

  const handleDenyActionNotification = async (notif: NotificationInterface) => {
    setAnchorElNotification(null);
    if (notif.type === 'friendRequest')
      if ( await handleDeclineFriendRequest(notif.sender))
        handleDeleteNotification(notif);



  };


  //handler mouse notif
  const handleMouseEnter = () => {
    // setIsHovered(true);
    dispatch(reduxReadNotification(notification));
    // setNotifications(
    //   (prev) => prev.map((n) => {
    //     if (n === notification)
    //       n.read = true;
    //     return n;
    //   }),
    // );
  };

  const handleMouseLeave = () => {
    // setIsHovered(false);
  };

  // useEffect(() => {
  //   if (notification.read === true)
  //     console.log('notif read !!!')
  // }, [notification.read]);

  if (isLoading) {
    return <CircularProgress />;
  }
  
  return (
    <MenuItem
      sx={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Typography component="span"> 
        <span 
          className='font-bold mx-1'
          onClick={() => handleClickNotificationUser(notification)}
        > 
          {notification.sender.login} 
        </span>
        <span
          className='mr-12'
          onClick={() => handleClickNotification(notification)}
        >
          {notification.content}
        </span>
      </Typography>

      <Button onClick={() => handleAcceptActionNotification(notification)} color='primary' >
        Accept
      </Button>
      <Button onClick={() => handleDenyActionNotification(notification)} color='error'>
        Refuse
      </Button>
      <Tooltip
        title="Close" arrow
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 600 }}
      >
        <IconButton onClick={() => handleDeleteNotification(notification)} color='warning' >
          <CloseIcon color='error' />
        </IconButton>
      </Tooltip>
    </MenuItem>
  );
};

export default NotificationItem;
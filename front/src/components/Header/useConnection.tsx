import { useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';
import { reduxAddConversationList, reduxAddNotReadMP, reduxUpdateStatusUserConvList } from '../../store/convListSlice';
import { reduxAddNotification, reduxRemoveNotification } from '../../store/notificationSlice';
import { setMsgSnackbar, setSnackbar } from '../../store/snackbarSlice';
import { reduxAddWaitingFriends, reduxAcceptedRequest, reduxDeclinedRequest, reduxRemoveWaitingFriends, reduxRemoveFriends, reduxUpdateUserStatus } from '../../store/userSlice';
import { MessageInterface, NotificationInterface, PutSnackbarInterface, UserInterface, UserStatusInterface } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../store';

const useConnection = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const userIsLogged: boolean = useSelector((state: RootState) => state.user.isLogged);
  const socketRef = useRef<Socket>();
  const pathRef = useRef<string>(pathname);

  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    /* MP */
    socketRef.current?.on('notification_private_message', (message: MessageInterface) => {
      if (pathRef.current.split('/')[1] === 'chat' && pathRef.current.split('/')[4] === message.ownerUser.id.toString())
        return;

      const snackbar: PutSnackbarInterface = {
        open: true,
        loginFrom: message.ownerUser.login,
        message: (message.text.length > 10 
          ? message.text.substring(0, 7) + '...' 
          : message.text),
        severity: 'info',
        link: '/chat/conv/x/' + message.ownerUser.id + '/' + message.ownerUser.login,
        avatar: message.ownerUser.avatar,
      };
      dispatch(setSnackbar(snackbar));
      dispatch(reduxAddNotReadMP({ userIdFrom: message.ownerUser.id, userId: userData.id }));
    });

    return () => {
      socketRef.current?.off('notification_private_message');
    };

  }, [pathRef.current, userData.id, socketRef.current]);

  useEffect(() => {
    if (!userData.id || userData.id === -1) return;
    const socket = io('http://localhost:3000/notification', {
      reconnectionDelayMax: 10000,
      withCredentials: true,
    });

    //connect room
    socket.emit('joinNotificationRoom', {
      userId: userData.id,
    });

    socket.on('notification_friend_request', (notification: NotificationInterface) => {
      // setNotifications((prevNotifications) => [
      //   ...prevNotifications,
      //   notification,
      // ]);
      dispatch(reduxAddNotification(notification));
      dispatch(reduxAddWaitingFriends(notification.sender));
    });

    socket.on('notification_friend_request_accepted', (notification: NotificationInterface) => {
      dispatch(setMsgSnackbar(notification.sender.login + ': Friend request accepted'));
      dispatch(reduxAcceptedRequest(notification));
      dispatch(reduxAddConversationList({ item: notification.sender, userId: userData.id }));
    });

    socket.on('notification_friend_request_declined', (notification: NotificationInterface) => {
      dispatch(setMsgSnackbar(notification.sender.login + ': Friend request declined'));
      dispatch(reduxDeclinedRequest(notification));
    });

    socket.on('notification_friend_request_canceled', (notification: NotificationInterface) => {
      dispatch(reduxRemoveNotification(notification));
      // setNotifications(notifications.filter(n => n.sender.id !== notification.sender.id));
      dispatch(setMsgSnackbar(notification.sender.login + ': Friend request canceled'));
      dispatch(reduxRemoveWaitingFriends(notification.sender));
    });

    socket.on('notification_friend_deleted', (notification: NotificationInterface) => {
      dispatch(reduxRemoveFriends(notification.sender.id));
    });

    socket.on('notification_block_user', (notification: NotificationInterface) => {
      dispatch(reduxRemoveFriends(notification.sender.id));
    });


    /* ROOM */
    socket.on('notification_room_invite', (notification: NotificationInterface) => {
      dispatch(reduxAddNotification(notification));
    });

    /* user update status */
    socket.on('update_user_status', (userStatus: UserStatusInterface) => {
      // console.log('recu du socket update user status : ', userStatus);
      dispatch(reduxUpdateUserStatus(userStatus)); // modif userData.[].status
      dispatch(reduxUpdateStatusUserConvList({ item: [userStatus], userId: userData.id }));
    });

    /* GAME */
    socket.on('notification_game_invite', (notification: NotificationInterface) => {
      dispatch(reduxAddNotification(notification));
    });

    socket.on('notification_game_invite_accepted', (notification: NotificationInterface) => {
      dispatch(reduxAddNotification(notification));
    });

    socket.on('notification_game_invite_declined', (notification: NotificationInterface) => {
      dispatch(setMsgSnackbar(notification.sender.login + ': Game request declined'));
    });
    // // socket.on('notification_game_invite_canceled', (notification: NotificationInterface) => {


/*
{
    "type": "trophy",
    "content": "You win a trophy : Warrior",
    "receiver": {
        "id": "29",
        "firstName": "Darrin",
        "lastName": "Kirlin",
        "login": "Laron76",
        "email": "Furman_Buckridge-Gusikowski@gmail.com",
        "password": "$2b$10$c1j721RAxyGoIukxRC5suu2ALUFfYV2XoH51h8rryg7U1k40YmC/2",
        "role": "user",
        "avatar": "https://avatars.githubusercontent.com/u/82350039",
        "description": "Quis blanditiis vel aut repellendus atque itaque.",
        "score": 1567.7563222762817,
        "level": 3,
        "experience": 60,
        "gamesPlayed": 0,
        "consecutiveWin": 0,
        "laserKill": 0,
        "bonusUsed": 0,
        "is2FAEnabled": false,
        "status": "online",
        "secret2FA": null,
        "createdAt": "2023-06-19T18:24:15.304Z",
        "updatedAt": "2023-08-09T18:10:50.437Z",
        "lastActivity": "2023-08-09T18:10:35.727Z",
        "numberOfConsecutiveWins": 11,
        "numberOfEnemiesKilledWithLaser": 0,
        "numberOfGamesPlayed": 7,
        "numberOfGamesWonWithoutMissingBall": 0,
        "trophies": [
            {
                "id": 1,
                "name": "Warrior",
                "description": "Win 3 games in a row",
                "imagePath": "warrior.jpeg"
            },
            {
                "id": 2,
                "name": "Lord",
                "description": "Win 5 games in a row",
                "imagePath": "lord.jpeg"
            },
            {
                "id": 3,
                "name": "Emperor",
                "description": "Win 10 games in a row",
                "imagePath": "emperor.jpeg"
            },
            {
                "id": 18,
                "name": "Blitz Pong",
                "description": "Win a game in less than 2 minutes",
                "imagePath": "blitz_pong.jpeg"
            }
        ]
    },
    "sender": null,
    "read": true,
    "invitationLink": null,
    "createdAt": "2023-08-09T18:10:50.496Z",
    "updatedAt": "2023-08-09T18:10:50.496Z",
    "id": "622"
}
*/


    /* TROPHY */
    socket.on('notification_trophee', (notif: NotificationInterface) => {
      console.log('notif trophy : ', notif);
      // dispatch(reduxAddNotification(notification));

      const trophyName = notif.content.split(' : ')[1];
      const snackbar: PutSnackbarInterface = {
        open: true,
        message: notif.content,
        severity: 'info',
        trophyImg: trophyName,
        vertical: 'top',
      };
      dispatch(setSnackbar(snackbar));
      dispatch(reduxAddNotReadMP({
        userIdFrom: -1,
        userId: userData.id,
      }));
    });

    socketRef.current = socket;

    return () => {
      if (userIsLogged) return; 
      // console.log('disconnect socket');
      socket.off('notification_friend_request');
      socket.off('notification_friend_request_accepted');
      socket.off('notification_friend_request_declined');
      socket.off('notification_friend_request_canceled');
      socket.off('notification_friend_deleted');
      socket.off('notification_block_user');
      socket.off('notification_unblock_user');
      socket.off('notification_room_invite');
      socket.off('update_user_status');
      socket.off('notification_game_invite');
      socket.off('notification_game_invite_accepted');
      socket.off('notification_game_invite_declined');
      socket.disconnect();

    };
  }, [userData.id]);

};

export default useConnection;
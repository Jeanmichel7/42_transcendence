import { Dispatch } from "@reduxjs/toolkit";
import { ChatMsgInterface, ConversationInterface, RoomInterface } from "../../../types"
import { Socket } from "socket.io-client";
import { reduxRemoveConversationToList, reduxUpdateRoomConvList } from "../../../store/convListSlice";
import { setWarningSnackbar, setMsgSnackbar } from "../../../store/snackbarSlice";

export const connectionSocketChannel = (
  socket: Socket,
  id: string,
  userId: number,
  conv: ConversationInterface,
  setMessages: React.Dispatch<React.SetStateAction<ChatMsgInterface[]>>,
  setOffsetPagniation: React.Dispatch<React.SetStateAction<number>>,
  dispatch: Dispatch<any>,
  navigate: (path: string) => void,
) => {

  
  /* MESSAGE */
  socket.on('chat_message', (message: ChatMsgInterface, acknowledge) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      message,
    ]);
    setOffsetPagniation((prev) => prev + 1);
    acknowledge(true);
  });

  socket.on('chat_message_edit', (message) => {
    setMessages((prevMessages) => {
      const newMessages = prevMessages.map((msg) => {
        if (msg.id === message.id) {
          return { ...msg, text: message.text, updatedAt: message.updatedAt };
        }
        return msg;
      });
      return newMessages;
    });
  });

  socket.on('chat_message_delete', (message) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== message.id));
    setOffsetPagniation((prev) => prev - 1);
  });


  /* ROOM */
  socket.on('room_join', (roomId, user) => {
    if (roomId !== id) return;
    const roomUpdated: RoomInterface = { 
      ...conv.room,
      acceptedUsers: conv.room.acceptedUsers?.filter((u) => u.id !== user.id),
    };
    dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }));
  });

  socket.on('room_leave', (roomId, userId) => {
    if (roomId !== id) return;
    const roomUpdated: RoomInterface = {
      ...conv.room,
      users: conv.room.users?.filter((u) => u.id !== userId),
      admins: conv.room.admins?.filter((u) => u.id !== userId),
      // acceptedUsers: conv.room.acceptedUsers?.filter((u) => u.id !== userId),
    };
    dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }));
  });

  /* ROOM ADMIN */
  socket.on('room_muted', (roomId, user) => {
    if (roomId !== id) return;
    const roomUpdated: RoomInterface = {
      ...conv.room,
      mutedUsers: conv.room.mutedUsers ? [...conv.room.mutedUsers, user] : [user],
    };
    dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }));
  });

  socket.on('room_unmuted', (roomId, userId) => {
    if (roomId !== id) return;
    const roomUpdated: RoomInterface = {
      ...conv.room,
      mutedUsers: conv.room.mutedUsers?.filter((u) => u.id !== userId),
    };
    dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }));
  });

  socket.on('room_kicked', (roomId, userId) => {
    if (roomId !== id) return;
    const roomUpdated: RoomInterface = {
      ...conv.room,
      users: conv.room.users?.filter((u) => u.id !== userId),
      admins: conv.room.admins?.filter((u) => u.id !== userId),
    };
    dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }));

    if (userId === userId) {
      socket.emit('leaveRoom', {
        roomId: id,
      });
      dispatch(reduxRemoveConversationToList({ item: conv, userId: userId }));
      navigate('/chat/channel');
      dispatch(setWarningSnackbar('You have been kicked from the room ' + conv.room.name));
    }
  });

  socket.on('room_banned', (roomId, user) => {
    if (roomId !== id) return;
    const roomUpdated: RoomInterface = {
      ...conv.room,
      bannedUsers: conv.room.bannedUsers ? [...conv.room.bannedUsers, user] : [user],
      admins: conv.room.admins?.filter((u) => u.id !== user.id),
      acceptedUsers: conv.room.acceptedUsers?.filter((u) => u.id !== user.id),
    };
    dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }));

    if (userId === user.id) {
      socket.emit('leaveRoom', {
        roomId: id,
      });
      dispatch(reduxRemoveConversationToList({ item: conv, userId: userId }));
      navigate('/chat/channel');
      dispatch(setWarningSnackbar('You have been banned from the room ' + conv.room.name));
    }
  });

  socket.on('room_unbanned', (roomId, userId) => {
    if (roomId !== id) return;
    const roomUpdated: RoomInterface = {
      ...conv.room,
      bannedUsers: conv.room.bannedUsers?.filter((u) => u.id !== userId),
    };
    dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }));
  });

  /* ROOM ADMIN */
  socket.on('room_admin_added', (roomId, user) => {
    if (roomId !== id) return;
    const roomUpdated: RoomInterface = {
      ...conv.room,
      admins: conv.room.admins ? [...conv.room.admins, user] : [user],
    };
    dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }));

    if (userId === user.id) {
      // setIsAdmin(true);
      dispatch(setMsgSnackbar('You are now admin of the room ' + conv.room.name));
    }
  });

  socket.on('room_admin_removed', (roomId, userId) => {
    if (roomId !== id) return;
    const roomUpdated: RoomInterface = {
      ...conv.room,
      admins: conv.room.admins?.filter((u) => u.id !== userId),
    };
    dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }));

    if (userId === userId) {
      // setIsAdmin(false);
      dispatch(setWarningSnackbar('You are no longer admin of the room ' + conv.room.name));
    }
  });

  /* OWNER */
  socket.on('room_owner_added', (roomId, user) => {
    if (roomId !== id) return;
    const roomUpdated: RoomInterface = {
      ...conv.room,
      ownerUser: user,
    };
    dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }));

    if (userId === user.id) {
      dispatch(setMsgSnackbar('You are now owner of the room ' + conv.room.name));
    }
  });

  socket.on('room_owner_deleted', (roomId) => {
    if (roomId !== id) return;
    dispatch(reduxRemoveConversationToList({ item: conv, userId: userId }));
    dispatch(setWarningSnackbar('The room ' + conv.room.name + ' has been deleted'));
    navigate('/chat/channel');
  });

  /* ROOM USER */

  // socket.on('error', (error) => { console.log('erreur socket : ', error); });
  // socket.on('connect_error', (error) => { console.log('erreur socket : ', error); });
  // socket.on('disconnect', (reason) => { console.log('socket disconnect : ', reason); });
  // socket.on('reconnect', (attemptNumber) => { console.log('socket reconnect : ', attemptNumber); });
  // socket.on('reconnect_attempt', (attemptNumber) => { console.log('socket reconnect_attempt : ', attemptNumber); });
  // socket.on('reconnecting', (attemptNumber) => { console.log('socket reconnecting : ', attemptNumber); });
  // socket.on('reconnect_error', (error) => { console.log('socket reconnect_error : ', error); });
  // socket.on('reconnect_failed', () => { console.log('socket reconnect_failed'); });
  // socket.on('connect_timeout', (timeout) => { console.log('socket connect_timeout : ', timeout); });

  //connect to room
  socket.emit('joinRoom', {
    roomId: id,
  });
}
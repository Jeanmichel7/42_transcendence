import { ConversationInterface, RoomInterface } from '../../types';
import { Socket } from 'socket.io-client';
import {
  reduxRemoveConversationToList,
  reduxUpdateRoomConvList,
} from '../../store/convListSlice';
import { setWarningSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

export const useConnectionSocketChat = (
  socket: Socket | null,
  userId: number,
  convId: number,
) => {
  const { room } = useSelector(
    (state: RootState) =>
      state.chat.conversationsList.find(c => c.id === convId) ||
      ({} as ConversationInterface),
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      /* ROOM */
      socket.on('room_join', (roomId, user) => {
        const roomUpdated: RoomInterface = {
          ...room,
          acceptedUsers: room.acceptedUsers?.filter(u => u.id !== user.id),
          users: room.users ? [...room.users, user] : [user],
        };
        dispatch(
          reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }),
        );
      });

      socket.on('room_leave', (roomId, userIdLeave) => {
        const roomUpdated: RoomInterface = {
          ...room,
          users: room.users?.filter(u => u.id !== userIdLeave),
          admins: room.admins?.filter(u => u.id !== userIdLeave),
          acceptedUsers: room.acceptedUsers?.filter(u => u.id !== userIdLeave),
        };
        dispatch(
          reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }),
        );
      });

      /* ROOM ADMIN */
      socket.on('room_muted', (roomId, user) => {
        const roomUpdated: RoomInterface = {
          ...room,
          mutedUsers: room.mutedUsers ? [...room.mutedUsers, user] : [user],
        };
        dispatch(
          reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }),
        );
        if (userId === user.id)
          dispatch(setWarningSnackbar('You have been muted from ' + room.name));
      });

      socket.on('room_unmuted', (roomId, userIdMuted) => {
        const roomUpdated: RoomInterface = {
          ...room,
          mutedUsers: room.mutedUsers?.filter(u => u.id !== userIdMuted),
        };
        dispatch(
          reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }),
        );
        if (userId === userIdMuted)
          dispatch(setMsgSnackbar('You have been unmuted from ' + room.name));
      });

      socket.on('room_kicked', (roomId, userIdKicked) => {
        const roomUpdated: RoomInterface = {
          ...room,
          users: room.users?.filter(u => u.id !== userIdKicked),
          admins: room.admins?.filter(u => u.id !== userIdKicked),
        };
        dispatch(
          reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }),
        );

        if (userId === userIdKicked) {
          socket.emit('leaveRoom', {
            roomId: room.id,
          });
          dispatch(
            reduxRemoveConversationToList({ convId: convId, userId: userId }),
          );
          navigate('/chat/channel');
          dispatch(
            setWarningSnackbar(
              'You have been kicked from the room ' + room.name,
            ),
          );
        }
      });

      socket.on('room_banned', (roomId, user) => {
        const roomUpdated: RoomInterface = {
          ...room,
          bannedUsers: room.bannedUsers ? [...room.bannedUsers, user] : [user],
          admins: room.admins?.filter(u => u.id !== user.id),
          users: room.users?.filter(u => u.id !== user.id),
          acceptedUsers: room.acceptedUsers?.filter(u => u.id !== user.id),
        };
        dispatch(
          reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }),
        );

        if (userId === user.id) {
          socket.emit('leaveRoom', {
            roomId: room.id,
          });
          dispatch(
            reduxRemoveConversationToList({ convId: convId, userId: userId }),
          );
          navigate('/chat/channel');
          dispatch(
            setWarningSnackbar(
              'You have been banned from the room ' + room.name,
            ),
          );
        }
      });

      socket.on('room_unbanned', (roomId, userIdUnBan) => {
        const roomUpdated: RoomInterface = {
          ...room,
          bannedUsers: room.bannedUsers?.filter(u => u.id !== userIdUnBan),
        };
        dispatch(
          reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }),
        );
        if (userId === userIdUnBan)
          dispatch(
            setMsgSnackbar('You have been unbanned from the room ' + room.name),
          );
      });

      return () => {
        socket.off('room_join');
        socket.off('room_leave');
        socket.off('room_muted');
        socket.off('room_unmuted');
        socket.off('room_kicked');
        socket.off('room_banned');
        socket.off('room_unbanned');
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convId, room, socket]);
};

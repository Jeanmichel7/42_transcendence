import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiErrorResponse, RoomInterface } from '../../../types';
import { getRoomData } from '../../../api/chat';
import {
  setErrorSnackbar,
  setPersonalizedErrorSnackbar,
} from '../../../store/snackbarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import RoomCard from '../ConversationList/outlet/ChannelRoomCard';

const InvitationWrapper = () => {
  const { channelId, channelName } = useParams();
  const [room, setRoom] = useState<RoomInterface | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.user);

  const fetchRoom = useCallback(async () => {
    if (!channelId || userData.id === -1) return;
    const result: RoomInterface | ApiErrorResponse = await getRoomData(
      channelId,
    );
    if ('statusCode' in result && result.statusCode === 403) {
      dispatch(
        setPersonalizedErrorSnackbar('You are not allowed to access this room'),
      );
      navigate('/chat');
    } else if ('error' in result) {
      dispatch(setErrorSnackbar(result));
      navigate('/chat');
    } else {
      setRoom(result);

      if (!result.acceptedUsers?.some(u => u.id === userData.id)) {
        dispatch(
          setPersonalizedErrorSnackbar(
            'You are not allowed to access this room',
          ),
        );
        navigate('/chat');
      }
    }
  }, [channelId, dispatch, navigate, userData.id]);

  useEffect(() => {
    if (!channelId || !channelName) return;
    fetchRoom();
  }, [fetchRoom]);

  return <>{room && <RoomCard room={room} />}</>;
};

export default InvitationWrapper;

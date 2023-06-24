import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiErrorResponse, RoomInterface } from '../../../types';
import { getRoomData } from '../../../api/chat';
import { setErrorSnackbar } from '../../../store/snackbarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
// import { reduxAddConversationList } from '../../../store/chatSlicer';
import RoomCard from '../ConversationList/ChannelRoomCard';

const InvitationWrapper = () => {
  const { channelId, channelName } = useParams();
  const [room, setRoom] = useState<RoomInterface | null>(null);
  // const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.user);

  const fetchRoom = useCallback(async () => {
    if (!channelId || userData.id === -1) return;
    const result: RoomInterface | ApiErrorResponse = await getRoomData(channelId);
    if ('statusCode' in result && result.statusCode === 403) {
      dispatch(setErrorSnackbar('You are not allowed to access this room'));
      navigate('/chat');
    } else if ('error' in result) {
      dispatch(setErrorSnackbar(result.error + result.message ? ': ' + result.message : ''));
      navigate('/chat');
    } else {
      setRoom(result);

      if (!result.acceptedUsers?.some(u => u.id === userData.id)) {
        dispatch(setErrorSnackbar('You are not allowed to access this room'));
        navigate('/chat');
      } else {
        // check private and password
        // dispatch(reduxAddConversationList({ item: result, userId: userData.id }));
        // navigate(`/chat/channel/${channelId}/${channelName}`);
      }
    }
  }, [channelId, dispatch, navigate, userData.id]);

  useEffect(() => {
    if (!channelId || !channelName
    //  || !location.state
    ) return;
    // console.log('location : ', location);
    // console.log('channelId : ', channelId);
    // console.log('channelName : ', channelName);

    fetchRoom();
    //verifie acces
    // ajoute list conv
    // redirige vers conv

  }, [fetchRoom]);

  return (
    <>
      {room && 
        < RoomCard room={room} />
      }
    </>
  );
};

export default InvitationWrapper;
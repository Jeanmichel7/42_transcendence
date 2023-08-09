import { useDispatch, useSelector } from 'react-redux';
import {
  ApiErrorResponse,
  GameInterface,
  UserInterface,
  UserRelation,
} from '../../types';
import { RootState } from '../../store';
import { useState } from 'react';
import { apiBlockUser, deleteFriend } from '../../api/relation';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { reduxAddUserBlocked, reduxRemoveFriends } from '../../store/userSlice';
import { CircularProgress } from '@mui/material';
import FriendItem from './FriendItem';
import { useNavigate } from 'react-router-dom';
import { reduxAddConversationList } from '../../store/convListSlice';
import { getConvIdFromUserOrRoom } from '../../utils/utils';
import { inviteGameUser } from '../../api/game';
import { Nothing } from './Nothing';

interface OnLineFriendsProps {
  userDataId: number;
}

const OnLineFriends = ({ userDataId }: OnLineFriendsProps) => {
  const { userFriends } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { conversationsList } = useSelector((state: RootState) => state.chat);

  const handleBlockUser = async (userToBlock: UserInterface) => {
    setIsLoading(true);
    const resBlockRequest: UserRelation | ApiErrorResponse = await apiBlockUser(
      userToBlock.id,
    );
    setIsLoading(false);

    if ('error' in resBlockRequest)
      dispatch(
        setErrorSnackbar(
          resBlockRequest.error + resBlockRequest.message
            ? ': ' + resBlockRequest.message
            : '',
        ),
      );
    else {
      dispatch(reduxAddUserBlocked(userToBlock.id));
      dispatch(setMsgSnackbar('User blocked'));
    }
  };

  const handleDefi = async (userToDefie: UserInterface) => {
    const resInvitGameUser: GameInterface | ApiErrorResponse =
      await inviteGameUser(userToDefie.id);
    if ('error' in resInvitGameUser)
      return dispatch(
        setErrorSnackbar(
          resInvitGameUser.error + resInvitGameUser.message
            ? ': ' + resInvitGameUser.message
            : '',
        ),
      );
    dispatch(setMsgSnackbar('Invitation sent'));
  };

  const handleDeleteFriend = async (userToDelete: UserInterface) => {
    setIsLoading(true);
    const resDeleteRequest: void | ApiErrorResponse = await deleteFriend(
      userToDelete.id,
    );
    setIsLoading(false);

    if (typeof resDeleteRequest === 'object' && 'error' in resDeleteRequest)
      dispatch(
        setErrorSnackbar(
          resDeleteRequest.error + resDeleteRequest.message
            ? ': ' + resDeleteRequest.message
            : '',
        ),
      );
    else {
      dispatch(reduxRemoveFriends(userToDelete.id));
      dispatch(setMsgSnackbar('Friend deleted'));
    }
  };

  const handleNavigateToChat = (user: UserInterface) => {
    dispatch(reduxAddConversationList({ item: user, userId: userDataId }));
    let convId = getConvIdFromUserOrRoom(user, conversationsList);
    if (convId === -1)
      convId =
        conversationsList.length === 0
          ? 0
          : conversationsList[conversationsList.length - 1].id + 1;
    navigate(`/chat/conv/${convId}/${user.id}/${user.login}`);
  };

  return (
    <div className="h-full w-full">
      {!userFriends && <p>Loading...</p>}
      {userFriends?.length === 0 && (
        <Nothing text="Sorry... you don't have friends" />
      )}

      {userFriends?.length !== 0 &&
        !userFriends?.find((u) => u.status === 'online') && (
          <Nothing text="Sorry... you're alone" />
      )}
      {userFriends
        ?.filter((u) => u.status != 'offline')
        .map((user) => (
          <FriendItem
            key={user.id}
            user={user}
            actions={[
              { name: 'Defi', callback: handleDefi },
              { name: 'Chat', callback: handleNavigateToChat },
              { name: 'Block', callback: handleBlockUser },
              { name: 'Delete', callback: handleDeleteFriend },
            ]}
            isLoading={isLoading}
          />
        ))}
      {isLoading && <CircularProgress />}
    </div>
  );
};
export default OnLineFriends;

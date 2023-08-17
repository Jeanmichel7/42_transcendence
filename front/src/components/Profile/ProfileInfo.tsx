import { requestAddFriend } from '../../api/relation';
import {
  ApiErrorResponse,
  GameInterface,
  UserInterface,
  UserRelation,
} from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { IconButton, Tooltip, Zoom } from '@mui/material';
import { RootState } from '../../store';
import { ranksImages } from '../../utils/rankImages';
import { reduxAddWaitingFriendsSent } from '../../store/userSlice';
import cuteBallsClimbingVines from '../../assets/cuteBallsClimbingVines.png';
import ExperienceBar from './ExperienceBar';
import { inviteGameUser } from '../../api/game';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { reduxAddConversationList } from '../../store/convListSlice';
import { getConvIdFromUserOrRoom } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';

export default function ProfileInfo({ user }: { user: UserInterface }) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversationsList } = useSelector((state: RootState) => state.chat);
  const { userData, userFriends, waitingFriendsRequestSent } = useSelector(
    (state: RootState) => state.user,
  );

  const handleRequestAddFriend = async () => {
    const res: UserRelation | ApiErrorResponse = await requestAddFriend(
      user.id,
    );
    if ('error' in res) {
      dispatch(setErrorSnackbar(res));
    } else {
      dispatch(setMsgSnackbar('Request sent'));
      dispatch(reduxAddWaitingFriendsSent(user));
    }
  };

  const handleDefi = async () => {
    setIsLoading(true);
    const resInvitGameUser: GameInterface | ApiErrorResponse =
      await inviteGameUser(user.id);
    if ('error' in resInvitGameUser)
      return dispatch(setErrorSnackbar(resInvitGameUser));
    dispatch(setMsgSnackbar('Invitation sent'));
    setTimeout(() => {
      setIsLoading(false);
    }, 3 * 1000);
  };

  const handleNavigateToChat = () => {
    dispatch(reduxAddConversationList({ item: user, userId: userData.id }));
    let convId = getConvIdFromUserOrRoom(user, conversationsList);
    if (convId === -1)
      convId =
        conversationsList.length === 0
          ? 0
          : conversationsList[conversationsList.length - 1].id + 1;
    navigate(`/chat/conv/${convId}/${user.id}/${user.login}`);
  };

  function isRequestFriendSent() {
    return waitingFriendsRequestSent?.some(
      (f: UserInterface) => f.id === user.id,
    );
  }

  return (
    <div className="p-5">
      <div
        className="md:flex justify-between items-center
       bg-blue-100 text-center py-2 
       font-bold rounded-t-lg box-border shadow-custom"
      >
        <span className="min-w-[300px]"></span>
        <p className="ml-2"></p>
        <h2 className="text-3xl"> {user.firstName + ' ' + user.lastName} </h2>
        <div className="flex flex-row justify-center items-center mr-2">
          {userData.id &&
            userFriends &&
            !userFriends.find(u => u.id === user.id) &&
            userData.id != user.id && (
              <Tooltip
                title={isRequestFriendSent() ? 'Waiting accept' : 'Add friend'}
                arrow
                TransitionComponent={Zoom}
                TransitionProps={{ timeout: 600 }}
              >
                <div>
                  <IconButton
                    aria-label="add friend"
                    sx={{ margin: 0, padding: 0 }}
                    onClick={() => handleRequestAddFriend()}
                    disabled={isRequestFriendSent() || isLoading}
                  >
                    <AddIcon
                      color={isRequestFriendSent() ? 'disabled' : 'primary'}
                    />
                  </IconButton>
                </div>
              </Tooltip>
            )}

          <Tooltip
            title={'Chat'}
            arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
          >
            <div>
              <IconButton
                aria-label="chat friend"
                sx={{ margin: 0, padding: 0, paddingLeft: 1 }}
                onClick={handleNavigateToChat}
              >
                <ChatIcon color="primary" />
              </IconButton>
            </div>
          </Tooltip>

          <Tooltip
            title="Defi"
            arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
            sx={{ p: 0, paddingX: 1, m: 0 }}
          >
            <IconButton
              onClick={handleDefi}
              color="success"
              disabled={isLoading}
            >
              <SportsEsportsIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between rounded-b-lg bg-white shadow-custom p-3 ">
        <div className="px-[10vw] md:px-0 md:w-4/12">
          {user.avatar && (
            <img
              src={user.avatar}
              className="rounded-lg shadow-lg overflow-hidden h-[250px] object-cover
                w-full md:mt-[-40px] md:ml-[10px]"
              alt="avatar"
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
              }}
            />
          )}
          <p className="pt-3 pl-3 text-center md:text-left text-gray-500">
            {user.description ? user.description : 'No description'}
          </p>
        </div>

        <div className="relative flex-grow">
          <div className="flex justify-between p-3 ml-5">
            <div className="w-1/4 space-y-2 flex flex-col justify-between">
              <p className="md:text-xl opacity-60">Pseudo</p>
              <p className="md:text-xl opacity-60">Email</p>
              <p className="md:text-xl opacity-60">Status</p>
              <p className="md:text-xl opacity-60">Rank</p>
              <p className="md:text-xl opacity-60">Score</p>
              <p className="md:text-xl opacity-60">Level</p>
              <p className="md:text-xl opacity-60">Experience</p>
            </div>
            <div className="w-3/4 space-y-2 flex flex-col justify-between">
              <p className="md:text-xl">{user.login}</p>
              <p className="md:text-xl">{user.email}</p>
              <p className="md:text-xl">{user.status}</p>
              <div className="flex items-center">
                <img
                  src={ranksImages[user.rank]}
                  alt={user.rank}
                  className="h-8 w-8"
                />
                <p className="ml-2"> {user.rank.split('_').join(' ')} </p>
              </div>
              <p className="md:text-xl">{Math.floor(user.score)}</p>
              <p className="md:text-xl">{user.level}</p>
              <div className="flex justify-between items-center mr-2 lg:mr-24 max-w-sm">
                <ExperienceBar
                  currentExp={user.experience}
                  currentLevel={user.level}
                />
              </div>
            </div>
            <img
              src={cuteBallsClimbingVines}
              alt="illustration"
              className="absolute right-0 h-full hidden lg:block bottom-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

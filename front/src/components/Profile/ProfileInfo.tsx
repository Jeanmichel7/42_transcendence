import { requestAddFriend } from '../../api/relation';
import { ApiErrorResponse, UserInterface, UserRelation } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { Button, Typography } from '@mui/material';
import { RootState } from '../../store';
import { reduxAddWaitingFriendsSent } from '../../store/userSlice';
import cuteBallsClimbingVines from '../../assets/cuteBallsClimbingVines.png';
import ExperienceBar from './ExperienceBar';
import { Sticker } from '../../utils/StyledTitle';

export default function ProfileInfo({ user }: { user: UserInterface }) {
  const { userData, userFriends } = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch();

  const handleAddFriend = async () => {
    const res: UserRelation | ApiErrorResponse = await requestAddFriend(
      user.id,
    );
    if ('error' in res) {
      dispatch(
        setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''),
      );
    } else {
      dispatch(setMsgSnackbar('Request sent'));
      dispatch(reduxAddWaitingFriendsSent(user));
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between   text-white p-5 rounded-xl ">
      <div className="mb-5 mt-5 md:w-1/4">
        {user.avatar && (
          <img
            src={user.avatar}
            className="w-full rounded-[16px] shadow-lg h-2/3 max-h-72	 object-cover "
            alt="avatar"
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
            }}
          />
        )}
        <p className=" text-purple-600 p-3  mt-5 rounded-lg bg-white shadow-custom h-1/3	">
          {' '}
          {user.description ? user.description : 'No description'}{' '}
        </p>
      </div>

      <div className="md:w-3/4 mt-5  md:ml-5  box-border self-stretch z-0 relative rounded bg-white shadow-custom	 text-black p-5 ">
        {userData.id &&
          userFriends &&
          !userFriends.find(u => u.id === user.id) &&
          userData.id != user.id && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddFriend()}
              sx={{ display: 'block', margin: 'auto', position: 'absolute' }}
            >
              Add friend
            </Button>
          )}
        <h2
          className="text-3xl before:bg-gray-400 before:z-[-1]  before:h-16 before:w-full before:left-0 before:absolute 
        before:top-0 z-10  text-white text-center mb-5 font-bold"
        >
          {user.firstName + ' ' + user.lastName}
        </h2>

        <div className="flex justify-between items-stretch h-3/4">
          <div className="w-1/4 space-y-2 flex flex-col justify-between">
            <p className="md:text-xl opacity-60">Pseudo</p>
            <p className="md:text-xl opacity-60">Email</p>
            <p className="md:text-xl opacity-60">Status</p>
            <p className="md:text-xl opacity-60">Score</p>
            <p className="md:text-xl opacity-60">Level</p>
          </div>
          <div className="w-3/4 space-y-2 flex flex-col justify-between">
            <p className="md:text-xl">{user.login}</p>
            <p className="md:text-xl">{user.email}</p>
            <p className="md:text-xl">{user.status}</p>
            <p className="md:text-xl">{Math.floor(user.score)}</p>
            <ExperienceBar
              currentExp={user.experience}
              currentLevel={user.level}
            />
          </div>
          <img
            src={cuteBallsClimbingVines}
            alt="illustration"
            className="absolute right-0 h-full hidden md:block bottom-0"
          />
        </div>
      </div>
    </div>
  );
}

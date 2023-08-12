import { requestAddFriend } from '../../api/relation';
import { ApiErrorResponse, UserInterface, UserRelation } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { Button } from '@mui/material';
import { RootState } from '../../store';
import { reduxAddWaitingFriendsSent } from '../../store/userSlice';
import cuteBallsClimbingVines from '../../assets/cuteBallsClimbingVines.png';

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
      dispatch(setErrorSnackbar(res));
    } else {
      dispatch(setMsgSnackbar('Request sent'));
      dispatch(reduxAddWaitingFriendsSent(user));
    }
  };

  return (
    <div className='p-5'>
      <div className="md:flex justify-center bg-blue-100 text-center py-2 font-bold rounded-t-lg box-border shadow-custom">
        <span className='min-w-[300px]'></span>
        <h2 className="text-3xl"> {user.firstName + ' ' + user.lastName} </h2>
      </div>
      <div className="flex flex-col md:flex-row justify-between rounded-b-lg bg-white p-3 ">
        <div className="">
          <div className="md:absolute top-10 left-9">
            {user.avatar && (
              <img
                src={user.avatar}
                className="rounded-lg shadow-lg w-[346px] md:max-w-[256px] mx-auto"
                alt="avatar"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
                }}
              />
            )}
          </div>
          <p className=" text-center md:mt-[150px] ml-1 md:w-[256px] pt-3">
            { user.description ? user.description : 'No description' }
          </p>
        </div>

        <div className="relative flex-grow">
          {userData.id &&
            userFriends &&
            !userFriends.find((u) => u.id === user.id) &&
            userData.id != user.id && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddFriend()}
                sx={{ display: 'block', margin: 'auto' }}
              >
                Add friend
              </Button>
          )}
          <div className="flex justify-between items-stretch h-3/4 p-3 ml-5">
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
              <p className="md:text-xl">{Math.floor(user.level)}</p>
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

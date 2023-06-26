import { requestAddFriend } from '../../api/relation';
import { ApiErrorResponse, UserInterface, UserRelation } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { Button } from '@mui/material';
import { RootState } from '../../store';
import { reduxAddWaitingFriendsSent } from '../../store/userSlice';

export default function ProfileInfo({ user }: { user: UserInterface }) {
  const { userData, userFriends } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleAddFriend = async () => {
    const res: UserRelation | ApiErrorResponse = await requestAddFriend(user.id);
    if ('error' in res) {
      dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    } else {
      dispatch(setMsgSnackbar('Request sent'));
      dispatch(reduxAddWaitingFriendsSent(user));
    }
  };

  return (
    <div className="flex justify-between">
      <div className="w-1/4">
        {user.avatar &&
          <img
            src={user.avatar}
            className="text-center mb-2 w-full rounded-[16px]"
            alt="avatar"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
            }}
          />
        }
        <p> {user.description ? user.description : 'No description'} </p>
      </div>

      <div className="w-3/4 m-5 border-2px">
        <h2 className="text-3xl text-center mb-5">
          {user.firstName + ' ' + user.lastName}
        </h2>
        { userData.id && userFriends 
          && !userFriends.find(u => u.id === user.id)
          && userData.id != user.id &&
          <Button variant="contained" color="primary"
            onClick={() => handleAddFriend()}
            sx={{ display: 'block', margin: 'auto' }}
          >
            Add friend
          </Button>
        }
        <div className="flex justify-between">
          <div className="w-1/4 font-bold">
            <p className="text-xl">Pseudo</p>
            <p className="text-xl">Email</p>
            <p className="text-xl">Status</p>
            <p className="text-xl">Score</p>
          </div>
          <div className="w-3/4">
            <p className="text-xl">{user.login}</p>
            <p className="text-xl">{user.email}</p>
            <p className="text-xl">{user.status}</p>
            <p className="text-xl">{Math.floor(user.score)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
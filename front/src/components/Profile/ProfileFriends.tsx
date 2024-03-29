import { useEffect, useState } from 'react';
import { getFriendProfile } from '../../api/relation';
import { ApiErrorResponse, UserInterface } from '../../types';
import FriendCard from './FriendsCard';
import { useDispatch } from 'react-redux';
import { setErrorSnackbar } from '../../store/snackbarSlice';
import { Sticker } from '../../utils/StyledTitle';
import { Nothing } from '../Friends/Nothing';
import { NavLink } from 'react-router-dom';
export default function ProfileFriends({ user }: { user: UserInterface }) {
  const [friends, setFriends] = useState<UserInterface[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof user === 'undefined' || !user.login) return;
    async function fetchAndSetFriendsProfile() {
      const friendsFetched: UserInterface[] | ApiErrorResponse =
        await getFriendProfile(user.login);
      if ('error' in friendsFetched) {
        dispatch(setErrorSnackbar(friendsFetched));
      } else {
        setFriends(friendsFetched);
      }
    }
    fetchAndSetFriendsProfile();
  }, [user, dispatch]);

  return (
    <>
      <p className="mt-6">
        <Sticker dataText={'friends'} />
      </p>

      <div className="flex flex-wrap items-center justify-center w-full p-3 pt-0">
        {friends.length == 0 ? (
          <NavLink to="/friends?tab=add">
            <Nothing
              text="No friends"
              angry={false}
            />
          </NavLink>
        ) : (
          <div className="flex flex-wrap justify-center overflow-auto max-h-[calc(100vh-220px)] h-full px-2">
            {friends.map(friend => {
              if (friend.login != user.login)
                return (
                  <FriendCard
                    key={friend.id}
                    actualUserLogin={user.login}
                    friend={friend}
                    setFriends={setFriends}
                  />
                );
            })}
          </div>
        )}
      </div>
    </>
  );
}

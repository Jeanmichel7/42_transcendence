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
        dispatch(
          setErrorSnackbar(
            friendsFetched.error + friendsFetched.message
              ? ': ' + friendsFetched.message
              : '',
          ),
        );
      } else {
        setFriends(friendsFetched);
      }
    }
    fetchAndSetFriendsProfile();
  }, [user, dispatch]);

  return (
    <>
      <Sticker dataText={'friends'} />

      <div className="flex flex-wrap items-center justify-center w-full pb-3 p-5">
        {friends.length == 0 ? (
          <NavLink to="/friends?tab=add">
            <Nothing
              text="Sorry... go to Add Friends for adding new friends!"
              angry={false}
            />
          </NavLink>
        ) :
          <div className="flex flex-wrap justify-center overflow-auto max-h-[calc(100vh-220px)] h-full px-2">
            { friends.map((friend) => {
                if (friend.login != user.login)
                  return (
                    <FriendCard
                      key={friend.id}
                      actualUserLogin={user.login}
                      friend={friend}
                      setFriends={setFriends}
                    />
                  );
              })
            }
          </div>
        }
      </div>
    </>
  );
}

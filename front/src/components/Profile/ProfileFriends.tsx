import { useEffect, useState } from "react";
import { getFriendProfile } from "../../api/relation";
import { ApiErrorResponse, UserInterface } from "../../types";
import FriendCard from "./FriendsCard";
import { useDispatch } from "react-redux";
import { setErrorSnackbar } from "../../store/snackbarSlice";

export default function ProfileFriends({ user }: { user: UserInterface }) {
  const [friends, setFriends] = useState<UserInterface[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof user === "undefined" || !user.login) return;
    async function fetchAndSetFriendsProfile() {
      const friendsFetched: UserInterface[] | ApiErrorResponse =
        await getFriendProfile(user.login);
      if ("error" in friendsFetched) {
        dispatch(
          setErrorSnackbar(
            friendsFetched.error + friendsFetched.message
              ? ": " + friendsFetched.message
              : ""
          )
        );
      } else {
        setFriends(friendsFetched);
      }
    }
    fetchAndSetFriendsProfile();
  }, [user, dispatch]);

  return (
    <>
      <h2 className="text-3xl text-center mb-5">Friends</h2>

      <div className="flex flex-wrap items-center w-full pb-3">
        {friends.length == 0 ? (
          <p> No friends </p>
        ) : (
          friends.map((friend) => {
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
        )}
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import { acceptFriend, getBlockedUsers, getFriendRequestsToMe, getFriends, getFriendRequestsSent } from '../api/relation';
import { ApiErrorResponse, UserInterface } from '../types';
import { useDispatch } from 'react-redux';
import { setErrorSnackbar } from '../store/snackbarSlice';

export default function FriendsPage() {
  const [waitingListSend, setWaitingListSent] = useState<UserInterface[]>([]); // waitingListToBeAccepted
  const [waitingListToAccept, setWaitingListToAccept] = useState<UserInterface[]>([]);
  const [friendsList, setFriendsList] = useState<UserInterface[]>([]);
  const [blockedUsersList, setBlockedUsersList] = useState<UserInterface[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {

    async function fetchWaitingListToBeAccepted() {
      const resWaitingListSend: UserInterface[] | ApiErrorResponse = await getFriendRequestsSent();
      console.log('111 resWaitingListSend', resWaitingListSend);
      if ('error' in resWaitingListSend)
        dispatch(setErrorSnackbar('Error get friend requests: ' + resWaitingListSend.message));
      else {
        setWaitingListSent(resWaitingListSend);
      }
    }
    fetchWaitingListToBeAccepted();


    async function fetchFriendRequests() {
      const resWaitingList: UserInterface[] | ApiErrorResponse = await getFriendRequestsToMe();
      console.log('222 resWaitingList', resWaitingList);
      if ('error' in resWaitingList)
        dispatch(setErrorSnackbar('Error get friend requests: ' + resWaitingList.message));
      else {
        setWaitingListToAccept(resWaitingList);
      }
    }
    fetchFriendRequests();

    async function fetchFriendsList() {
      const resFriendsList: UserInterface[] | ApiErrorResponse = await getFriends();
      console.log('333 resFriendsList', resFriendsList);
      if ('error' in resFriendsList)
        dispatch(setErrorSnackbar('Error get friend requests: ' + resFriendsList.message));
      else {
        setFriendsList(resFriendsList);
      }
    }
    fetchFriendsList();

    async function fetchBlockedUsersList() {
      const resBlockedUsersList: UserInterface[] | ApiErrorResponse = await getBlockedUsers();
      console.log('444 resBlockedUsersList', resBlockedUsersList);
      if ('error' in resBlockedUsersList)
        dispatch(setErrorSnackbar('Error get friend requests: ' + resBlockedUsersList.message));
      else {
        setBlockedUsersList(resBlockedUsersList);
      }
    }
    fetchBlockedUsersList();


  }, [dispatch]);

  const handleAcceptFriendRequest = async (userToAcceptId: number) => {
    const resAcceptRequest = await acceptFriend(userToAcceptId);
    if ('error' in resAcceptRequest)
      dispatch(setErrorSnackbar('Error accept friend request: ' + resAcceptRequest.message));
    else {
      setWaitingListToAccept((prev) => prev.filter((user) => user.id !== userToAcceptId));
      // setWaitingListToAccept(waitingListToAccept.filter((user) => user.id !== userToAcceptId));
      // setFriendsList([...friendsList, resAcceptRequest]);
      // disatch userData.friends
    }
  };

  useEffect(() => {
    console.log('111 updated waitingListSend:', waitingListSend);
    console.log('222 updated waitingListToAccept:', waitingListToAccept);
    console.log('333 updated friendsList:', friendsList);
    console.log('444 updated blockedUsersList:', blockedUsersList);
  }, [waitingListSend, waitingListToAccept, friendsList, blockedUsersList]);

  return (
    <div>

      <h2 className='font-bold mt-5'>wainting request sent</h2>
      { waitingListSend.map((user) => (
        <div key={user.id}>
          <p>{user.firstName} {user.lastName}</p>
        </div>
      )) }

      <h2 className='font-bold mt-5'>waiting request to be accepted</h2>
      { waitingListToAccept.map((user) => (
        <div key={user.id}>
          <p>{user.firstName} {user.lastName}</p>
          <span>
            <button onClick={() => handleAcceptFriendRequest(user.id)}>Accept</button>
          </span>
        </div>
      )) }

      <h2 className='font-bold mt-5'>friends</h2>
      { friendsList.map((user) => (
        <div key={user.id}>
          <p>{user.firstName} {user.lastName}</p>
        </div>
      )) }

      <h2 className='font-bold mt-5'>blocked users</h2>
      { blockedUsersList.map((user) => (
        <div key={user.id}>
          <p>{user.firstName} {user.lastName}</p>
        </div>
      )) }
      



    </div>
  );
}


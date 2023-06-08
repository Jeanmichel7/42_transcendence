import { useEffect, useState } from 'react';
import { acceptFriend, declineFriend, cancelFriendRequest, getBlockedUsers, getFriendRequestsToMe, getFriends, getFriendRequestsSent, apiUnblockUser, apiBlockUser, deleteFriend } from '../api/relation';
import { ApiErrorResponse, UserInterface, UserRelation } from '../types';
import { useDispatch } from 'react-redux';
import { setErrorSnackbar, setMsgSnackbar } from '../store/snackbarSlice';
import { Button } from '@mui/material';

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
    const resAcceptRequest: UserRelation | ApiErrorResponse = await acceptFriend(userToAcceptId);
    if ('error' in resAcceptRequest)
      dispatch(setErrorSnackbar('Error accept friend request: ' + resAcceptRequest.message));
    else {
      setWaitingListToAccept((prev) => prev.filter((user) => user.id !== userToAcceptId));
      dispatch(setMsgSnackbar('Friend request accepted'));
      // setWaitingListToAccept(waitingListToAccept.filter((user) => user.id !== userToAcceptId));
      // setFriendsList([...friendsList, resAcceptRequest]);
      // disatch userData.friends
    }
  };

  const handleDeclineFriendRequest = async (userToDeclineId: number) => {
    const resDeclineRequest: void | ApiErrorResponse = await declineFriend(userToDeclineId);
    if (typeof resDeclineRequest === 'object' && 'error' in resDeclineRequest)
      dispatch(setErrorSnackbar('Error decline friend request: ' + resDeclineRequest.message));
    else {
      setWaitingListToAccept((prev) => prev.filter((user) => user.id !== userToDeclineId));
      dispatch(setMsgSnackbar('Friend request declined'));
    }
  };

  const handleUnblockUser = async (userToUnblockId: number) => {
    const resUnblockRequest: void | ApiErrorResponse  = await apiUnblockUser(userToUnblockId);
    if (typeof resUnblockRequest === 'object' && 'error' in resUnblockRequest)
      dispatch(setErrorSnackbar('Error unblock user: ' + resUnblockRequest.message));
    else {
      setBlockedUsersList((prev) => prev.filter((user) => user.id !== userToUnblockId));
      dispatch(setMsgSnackbar('User unblocked'));
    }
  };

  const handleCancelFriendRequest = async (userToCancelId: number) => {
    const resCancelRequest: void | ApiErrorResponse = await cancelFriendRequest(userToCancelId);
    if (typeof resCancelRequest === 'object' && 'error' in resCancelRequest)
      dispatch(setErrorSnackbar('Error cancel friend request: ' + resCancelRequest.message));
    else {
      setWaitingListSent((prev) => prev.filter((user) => user.id !== userToCancelId));
      dispatch(setMsgSnackbar('Friend request canceled'));
    }
  };

  const handleBlockUser = async (userToBlockId: number) => {
    const resBlockRequest: UserRelation | ApiErrorResponse = await apiBlockUser(userToBlockId);
    if ('error' in resBlockRequest)
      dispatch(setErrorSnackbar('Error block user: ' + resBlockRequest.message));
    else {
      setFriendsList((prev) => prev.filter((user) => user.id !== userToBlockId));
      // setBlockedUsersList((prev) => [...prev, resBlockRequest]);
      dispatch(setMsgSnackbar('User blocked'));
    }
  };

  const handleDeleteFriend = async (userToDeleteId: number) => {
    const resDeleteRequest: void | ApiErrorResponse = await deleteFriend(userToDeleteId);
    if (typeof resDeleteRequest === 'object' && 'error' in resDeleteRequest)
      dispatch(setErrorSnackbar('Error delete friend: ' + resDeleteRequest.message));
    else {
      setFriendsList((prev) => prev.filter((user) => user.id !== userToDeleteId));
      dispatch(setMsgSnackbar('Friend deleted'));
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
          <p>{user.firstName} {user.lastName}
            <Button onClick={() => handleCancelFriendRequest(user.id)}>Cancel</Button>
          </p>
        </div>
      )) }

      <h2 className='font-bold mt-5'>waiting request to be accepted</h2>
      { waitingListToAccept.map((user) => (
        <div key={user.id}>
          <p>{user.firstName} {user.lastName}
            <span>
              <Button onClick={() => handleAcceptFriendRequest(user.id)}>Accept</Button>
              <Button onClick={() => handleDeclineFriendRequest(user.id)}>Decline</Button>
            </span>
          </p>
        </div>
      )) }

      <h2 className='font-bold mt-5'>friends</h2>
      { friendsList.map((user) => (
        <div key={user.id}>
          <p>{user.firstName} {user.lastName}
            <span>
              <Button onClick={() => handleBlockUser(user.id)}>block</Button>
              <Button onClick={() => handleDeleteFriend(user.id)}>delete</Button>
            </span>
          </p>
        </div>
      )) }

      <h2 className='font-bold mt-5'>blocked users</h2>
      { blockedUsersList.map((user) => (
        <div key={user.id}>
          <p>{user.firstName} {user.lastName}
          <span>
            <Button onClick={() => handleUnblockUser(user.id)}>Unblock</Button>
          </span>
          </p>
        </div>
      )) }
    </div>
  );
}
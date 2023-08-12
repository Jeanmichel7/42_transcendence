import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInterface, RoomInterface, ConversationInterface, UserStatusInterface } from '../types';
import { isRoomInterface, isUserInterface } from '../utils/utils';


export interface ChatState {
  conversationIdSelected: number,
  conversationsList: ConversationInterface[],
}

function isConversationExists(list: ConversationInterface[], newConv: ConversationInterface): boolean {
  return list.some(conv => {
    if (isRoomInterface(conv.room) && isRoomInterface(newConv.room)) {
      if (conv.room.id === newConv.room.id)
        return true;
      else
        return false;
    } else if (isUserInterface(conv.user) && isUserInterface(newConv.user)) {
      if (conv.user.id === newConv.user.id)
        return true;
      else
        return false;
    }
    return false;
  });
}

const helperAddConversationList = (state: ChatState, item: UserInterface | RoomInterface) => {
  const newConversation: ConversationInterface = {
    id: state.conversationsList.length === 0 ? 0 : state.conversationsList[state.conversationsList.length - 1].id + 1,
    room: {} as RoomInterface,
    user: {} as UserInterface,
    msgNotRead: 0,
  };
  if (isRoomInterface(item)) {
    newConversation.room = {
      id: item.id,
      name: item.name,
      type: item.type,
      isProtected: item.isProtected,
      ownerUser: item.ownerUser,
      admins: item.admins,
      users: item.users,
    } as RoomInterface;
  } else if (isUserInterface(item)) {
    newConversation.user = {
      id: item.id,
      login: item.login,
      avatar: item.avatar,
      status: item.status,
    } as UserInterface;
  } else {
    throw new Error("item n'est ni de type RoomInterface, ni de type UserInterface");
  }
  if (isConversationExists(state.conversationsList, newConversation)) {
    return;
  } else {
    if (state.conversationsList == undefined) {
      state.conversationsList = [newConversation];
    } else {
      state.conversationsList = [...state.conversationsList, newConversation]; // order ?
    }
  }
};

const helperUpdateStatusUserConvList = (state: ChatState, item: UserStatusInterface[]) => {
  item.forEach((userStatus) => {
    state.conversationsList.forEach((conv: ConversationInterface) => {
      if (isUserInterface(conv.user) && conv.user.id === userStatus.id)
        conv.user.status = userStatus.status;
      if (isRoomInterface(conv.room)) {
        //check ownerUser
        if (conv.room.ownerUser?.id === userStatus.id && conv.room.ownerUser.id === userStatus.id) {
          conv.room.ownerUser.status = userStatus.status;
        }

        //check admins
        if (conv.room.admins) {
          conv.room.admins.forEach((admin) => {
            if (admin.id === userStatus.id) {
              admin.status = userStatus.status;
            }
          });
        }

        //check users
        if (conv.room.users) {
          conv.room.users.forEach((user) => {
            if (user.id === userStatus.id) {
              user.status = userStatus.status;
            }
          });
        }
      }
    });
  });
};

const helperUpdateConversationList = (state: ChatState, item: RoomInterface) => {
  const indexConvToUpdate = state.conversationsList.findIndex((conv) => conv.room.id === item.id);
  if (indexConvToUpdate !== -1) {
    state.conversationsList[indexConvToUpdate].room = item;
    return true;
  }
  return false;
};

const helperUpdatePrivateConversationList = (state: ChatState, item: UserInterface) => {
  const indexConvToUpdate = state.conversationsList.findIndex((conv) => conv.user.id === item.id);
  if (indexConvToUpdate !== -1) {
    state.conversationsList[indexConvToUpdate].user = item;
    return true;
  }
  return false;
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversationsList: [] as ConversationInterface[],
  } as ChatState,

  reducers: {
    reduxSetConversationList: (state, action: PayloadAction<ConversationInterface[]>) => {
      state.conversationsList = action.payload;
    },
    reduxAddConversationList: (state, action: PayloadAction<{ item: UserInterface | RoomInterface, userId: number }>) => {
      // console.log('REDUX ADD CONV LIST', action.payload);
      const { item, userId } = action.payload;
      helperAddConversationList(state, item as UserInterface | RoomInterface);
      localStorage.setItem('conversationsList' + userId, JSON.stringify(state.conversationsList));
    },
    reduxRemoveConversationToList: (state, action: PayloadAction<{ convId: number, userId: number }>) => {
      // console.log('REDUX REMOVE CONV LIST', action.payload);
      const { convId, userId } = action.payload;
      state.conversationsList = state.conversationsList
        .filter((conv: ConversationInterface) => conv.id !== convId);
      localStorage.setItem('conversationsList' + userId, JSON.stringify(state.conversationsList));
    },
    reduxUpdateRoomConvList: (state, action: PayloadAction<{ item: RoomInterface, userId: number }>) => {
      // console.log('REDUX UPDATE ROOM CONV LIST', action.payload);
      const { item, userId } = action.payload;
      if (helperUpdateConversationList(state, item))
        localStorage.setItem('conversationsList' + userId, JSON.stringify(state.conversationsList));
    },
    reduxUpdatePrivateConvList: (state, action: PayloadAction<{ item: UserInterface, userId: number }>) => {
      // console.log('REDUX UPDATE PRIVATE CONV LIST', action.payload);
      const { item, userId } = action.payload;
      if (helperUpdatePrivateConversationList(state, item))
        localStorage.setItem('conversationsList' + userId, JSON.stringify(state.conversationsList));
    },
    reduxUpdateStatusUserConvList: (state, action: PayloadAction<{ item: UserStatusInterface[], userId: number }>) => {
      // console.log('REDUX UPDATE STATUS USER CONV LIST', action.payload);
      const { item, userId } = action.payload;
      helperUpdateStatusUserConvList(state, item);
      localStorage.setItem('conversationsList' + userId, JSON.stringify(state.conversationsList));
    },
    reduxRemoveWaitingUserInRoom: (state, action: PayloadAction<{ roomId: number, userId: number }>) => {
      // console.log('REDUX REMOVE WAITING USER IN ROOM', action.payload);
      const { roomId, userId } = action.payload;
      const indexConvToUpdate = state.conversationsList.findIndex((conv) => conv.room.id === roomId);
      if (indexConvToUpdate !== -1) {
        state.conversationsList[indexConvToUpdate].room.acceptedUsers = state.conversationsList[indexConvToUpdate].room.acceptedUsers
          ?.filter((user: UserInterface) => user.id !== userId);
        localStorage.setItem('conversationsList' + userId, JSON.stringify(state.conversationsList));
      }
    },


    /* MP */
    reduxAddNotReadMP: (state, action: PayloadAction<{ userIdFrom: number, userId: number }>) => {
      const { userIdFrom, userId } = action.payload;
      const indexConvToUpdate = state.conversationsList.findIndex((conv) => conv.user.id === userIdFrom);
      if (indexConvToUpdate !== -1) {
        state.conversationsList[indexConvToUpdate].msgNotRead++;
        state.conversationsList.sort((a, b) => b.msgNotRead - a.msgNotRead);
        localStorage.setItem('conversationsList' + userId, JSON.stringify(state.conversationsList));
      }
    },
    reduxResetNotReadMP: (state, action: PayloadAction<{ userIdFrom: number, userId: number }>) => {
      const { userIdFrom, userId } = action.payload;
      const indexConvToUpdate = state.conversationsList.findIndex((conv) => conv.user.id == userIdFrom);
      if (indexConvToUpdate !== -1) {
        state.conversationsList[indexConvToUpdate].msgNotRead = 0;
        state.conversationsList.sort((a, b) => b.msgNotRead - a.msgNotRead);
        localStorage.setItem('conversationsList' + userId, JSON.stringify(state.conversationsList));
      }
    },

  },
});

export const {
  reduxSetConversationList,
  reduxAddConversationList,
  reduxRemoveConversationToList,
  reduxUpdateRoomConvList,
  reduxUpdateStatusUserConvList,
  reduxRemoveWaitingUserInRoom,
  reduxAddNotReadMP,
  reduxResetNotReadMP,
  reduxUpdatePrivateConvList,
} = chatSlice.actions;

export default chatSlice.reducer;
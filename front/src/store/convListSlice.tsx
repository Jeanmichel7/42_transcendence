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
  //create new conversation
  // console.log('redux add conv list : ', item);
  const newConversation: ConversationInterface = {
    id: state.conversationsList.length === 0 ? 0 : state.conversationsList[state.conversationsList.length - 1].id + 1,
    room: {} as RoomInterface,
    user: {} as UserInterface,
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
    // console.log('redux conv already exist');
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
  // console.log('redux update status conv list : ', item);
  item.forEach((userStatus) => {
    state.conversationsList.forEach((conv: ConversationInterface) => {
      if (isUserInterface(conv.user) && conv.user.id === userStatus.id) {
        conv.user.status = userStatus.status;
      }
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
      console.log('redux check user status ');
    });
  });
};

const helperUpdateConversationList = (state: ChatState, item: RoomInterface) => {
  //edit conversation
  const indexConvToUpdate = state.conversationsList.findIndex((conv) => conv.room.id === item.id);
  if (indexConvToUpdate !== -1) {
    state.conversationsList[indexConvToUpdate].room = item;
    return true;
  }
  return false;
};

//check si ID est unique sinon random...

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    // conversationIdSelected: -1,
    conversationsList: [] as ConversationInterface[],
  } as ChatState,

  reducers: {
    // manage conversation
    // reduxSetCurrentConversationList: (state, action: PayloadAction<number>) => {
    //   state.conversationIdSelected = action.payload;
    // },

    reduxSetConversationList: (state, action: PayloadAction<ConversationInterface[]>) => {
      state.conversationsList = action.payload;
    },
    reduxAddConversationList: (state, action: PayloadAction<{ item: UserInterface | RoomInterface, userId: number }>) => {
      console.log('REDUX ADD CONV LIST', action.payload);
      const { item, userId } = action.payload;
      helperAddConversationList(state, item as UserInterface | RoomInterface);
      localStorage.setItem('conversationsList' + userId, JSON.stringify(state.conversationsList));
    },
    reduxRemoveConversationToList: (state, action: PayloadAction<{ convId: number, userId: number }>) => {
      // console.log('REDUX REMOVE CONV LIST');
      const { convId, userId } = action.payload;
      state.conversationsList = state.conversationsList
        .filter((conv: ConversationInterface) => conv.id !== convId);
      localStorage.setItem('conversationsList' + userId, JSON.stringify(state.conversationsList));
    },
    reduxUpdateRoomConvList: (state, action: PayloadAction<{ item: RoomInterface, userId: number }>) => {
      // console.log('REDUX UPDATE ROOM CONV LIST');
      const { item, userId } = action.payload;
      if (helperUpdateConversationList(state, item))
        localStorage.setItem('conversationsList' + userId, JSON.stringify(state.conversationsList));
    },
    reduxUpdateStatusUserConvList: (state, action: PayloadAction<{ item: UserStatusInterface[], userId: number }>) => {
      // console.log('REDUX UPDATE STATUS USER CONV LIST');
      const { item, userId } = action.payload;
      helperUpdateStatusUserConvList(state, item);
      localStorage.setItem('conversationsList' + userId, JSON.stringify(state.conversationsList));
    },
    reduxRemoveWaitingUserInRoom: (state, action: PayloadAction<{ roomId: number, userId: number }>) => {
      // console.log('REDUX REMOVE WAITING USER IN ROOM');
      const { roomId, userId } = action.payload;
      const indexConvToUpdate = state.conversationsList.findIndex((conv) => conv.room.id === roomId);
      if (indexConvToUpdate !== -1) {
        state.conversationsList[indexConvToUpdate].room.acceptedUsers = state.conversationsList[indexConvToUpdate].room.acceptedUsers
          ?.filter((user: UserInterface) => user.id !== userId);
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
} = chatSlice.actions;

export default chatSlice.reducer;
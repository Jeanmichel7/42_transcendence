import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInterface, RoomInterface, ConversationInterface } from '../types';
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

// const helperSetConversationList = (state: ChatState, action: PayloadAction<ConversationInterface[]>) => {
//   state.conversationsList = action.payload.map((conv) => {
//     if (isRoomInterface(conv.room)) {
//       return {
//         id: state.conversationsList.length === 0 ? 0 : state.conversationsList[state.conversationsList.length - 1].id + 1,
//         room: {
//           id: conv.room.id,
//           name: conv.room.name,
//           type: conv.room.type,
//           isProtected: conv.room.isProtected,
//           users: conv.room.users,
//           // lastMessage: conv.lastMessage,
//           // lastMessageDate: conv.lastMessageDate,
//         },
//         user: {} as UserInterface,
//       };
//     } else if (isUserInterface(conv.user)) {
//       return {
//         id: state.conversationsList.length === 0 ? 0 : state.conversationsList[state.conversationsList.length - 1].id + 1,
//         user: {
//           id: conv.user.id,
//           login: conv.user.login,
//           email: conv.user.email,
//           firstName: conv.user.firstName,
//           lastName: conv.user.lastName,
//           avatar: conv.user.avatar,
//           status: conv.user.status,
//           // lastMessage: conv.lastMessage,
//           // lastMessageDate: conv.lastMessageDate,
//         },
//         room: {} as RoomInterface,
//       };
//     } else {
//       throw new Error("action.payload n'est ni de type RoomInterface, ni de type UserInterface");
//     }
//   });
// };

const helperAddConversationList = (state: ChatState, item: UserInterface | RoomInterface) => {
  //create new conversation
  // console.log('redux conv list : ', item);
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

const helperUpdateConversationList = (state: ChatState, item: RoomInterface) => {
  //edit conversation
  // console.log('redux conv list : ', item);
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
      const { item, userId } = action.payload;
      helperAddConversationList(state, item as UserInterface | RoomInterface);
      localStorage.setItem('conversationsList' + userId, JSON.stringify(state.conversationsList));
    },
    reduxRemoveConversationToList: (state, action: PayloadAction<{ item: ConversationInterface, userId: number }>) => {
      const { item, userId } = action.payload;
      state.conversationsList = state.conversationsList
        .filter((conv: ConversationInterface) => conv.id !== item.id);
      localStorage.setItem('conversationsList' + userId, JSON.stringify(state.conversationsList));
    },
    reduxUpdateRoomConvList: (state, action: PayloadAction<{ item: RoomInterface, userId: number }>) => {
      const { item, userId } = action.payload;
      if (helperUpdateConversationList(state, item))
        localStorage.setItem('conversationsList' + userId, JSON.stringify(state.conversationsList));
    },
  },
});

export const {
  reduxSetConversationList,
  reduxAddConversationList,
  reduxRemoveConversationToList,
  reduxUpdateRoomConvList,
} = chatSlice.actions;

export default chatSlice.reducer;
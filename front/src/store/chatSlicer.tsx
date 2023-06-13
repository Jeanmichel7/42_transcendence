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

const helperSetConversationList = (state: ChatState, action: PayloadAction<ConversationInterface[]>) => {
  state.conversationsList = action.payload.map((conv) => {
    if (isRoomInterface(conv.room)) {
      return {
        id: state.conversationsList.length === 0 ? 0 : state.conversationsList[state.conversationsList.length - 1].id + 1,
        room: {
          id: conv.room.id,
          name: conv.room.name,
          type: conv.room.type,
          isProtected: conv.room.isProtected,
          users: conv.room.users,
          // lastMessage: conv.lastMessage,
          // lastMessageDate: conv.lastMessageDate,
        },
        user: {} as UserInterface,
      };
    } else if (isUserInterface(conv.user)) {
      return {
        id: state.conversationsList.length === 0 ? 0 : state.conversationsList[state.conversationsList.length - 1].id + 1,
        user: {
          id: conv.user.id,
          login: conv.user.login,
          email: conv.user.email,
          firstName: conv.user.firstName,
          lastName: conv.user.lastName,
          avatar: conv.user.avatar,
          status: conv.user.status,
          // lastMessage: conv.lastMessage,
          // lastMessageDate: conv.lastMessageDate,
        },
        room: {} as RoomInterface,
      };
    } else {
      throw new Error("action.payload n'est ni de type RoomInterface, ni de type UserInterface");
    }
  });
};

const helperAddConversationList = (state: ChatState, action: PayloadAction<UserInterface | RoomInterface>) => {
  //create new conversation
  const newConversation: ConversationInterface = {
    id: state.conversationsList.length === 0 ? 0 : state.conversationsList[state.conversationsList.length - 1].id + 1,
    room: {} as RoomInterface,
    user: {} as UserInterface,
  };
  if (isRoomInterface(action.payload)) {
    newConversation.room = {
      id: action.payload.id,
      name: action.payload.name,
      type: action.payload.type,
      isProtected: action.payload.isProtected,
      users: action.payload.users,
      // lastMessage: conv.lastMessage,
      // lastMessageDate: conv.lastMessageDate,
    } as RoomInterface;
  } else if (isUserInterface(action.payload)) {
    newConversation.user = {
      id: action.payload.id,
      login: action.payload.login,
      // email: action.payload.email,
      // firstName: action.payload.firstName,
      // lastName: action.payload.lastName,
      avatar: action.payload.avatar,
      status: action.payload.status,
    } as UserInterface;
  } else {
    throw new Error("action.payload n'est ni de type RoomInterface, ni de type UserInterface");
  }
  if (isConversationExists(state.conversationsList, newConversation)) {
    console.log('redux conv already exist');
    return;
  } else {
    if (state.conversationsList == undefined) {
      state.conversationsList = [newConversation];
    } else {
      state.conversationsList = [...state.conversationsList, newConversation]; // order ?
    }
  }
};

//check si ID est unique sinon random...

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversationIdSelected: -1,
    conversationsList: localStorage.getItem('conversationsList') ? JSON.parse(localStorage.getItem('conversationsList') as string) : [] as ConversationInterface[],
  } as ChatState,

  reducers: {
    // manage conversation
    reduxSetCurrentConversationList: (state, action: PayloadAction<number>) => {
      state.conversationIdSelected = action.payload;
    },

    reduxSetConversationList: (state, action: PayloadAction<ConversationInterface[]>) => {
      helperSetConversationList(state, action);
      localStorage.setItem('conversationsList', JSON.stringify(state.conversationsList));
    },

    reduxAddConversationList: (state, action: PayloadAction<UserInterface | RoomInterface>) => {
      helperAddConversationList(state, action);
      localStorage.setItem('conversationsList', JSON.stringify(state.conversationsList));
    },
    reduxRemoveConversationToList: (state, action: PayloadAction<ConversationInterface>) => {
      state.conversationsList = state.conversationsList
        .filter((conv: ConversationInterface) => conv.id !== action.payload.id);
      localStorage.setItem('conversationsList', JSON.stringify(state.conversationsList));
    },
  },
});

export const {
  reduxSetCurrentConversationList,
  reduxSetConversationList,
  reduxAddConversationList,
  reduxRemoveConversationToList,
} = chatSlice.actions;

export default chatSlice.reducer;
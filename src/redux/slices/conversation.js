import { createSlice, current } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";
import axios from "../../utils/axios";
import { showSnackbar } from "./app";

const userId = window.localStorage.getItem("userId");

const initialState = {
  conversations: [],
  currentConversation: null,
  currentMessages: [],
};

const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    fetchConversations(state, action) {
      const list = action.payload.conversations.map((el) => {
        return {
          conversationId: el.conversationId,
          participants: el?._id,
          name: el.name,
          avatarUrl: el.avatarUrl,
          message: el.lastArrivedMessage.content, 
          time: el.lastArrivedMessage.createdAt,
          pinned: false,
        };
      });
      state.conversations = list;
    },
    updateConversation(state, action) {
      const this_conversation = action.payload.conversation;
      state.conversations = state.conversations.map(
        (el) => {
          if (el?.id !== this_conversation._id) {
            return el;
          } else {
            const user = this_conversation.participants.find(
              (elm) => elm._id.toString() !== userId
            );
            return {
              id: this_conversation._id._id,
              userId: user?._id,
              name: `${user?.firstName} ${user?.lastName}`,
              online: user?.status === "Online",
              img: faker.image.avatar(),
              msg: faker.music.songName(),
              time: "9:36",
              unread: 0,
              pinned: false,
            };
          }
        }
      );
    },
    addConversation(state, action) {
      const this_conversation = action.payload.conversation;
      const user = this_conversation.participants.find(
        (elm) => elm._id.toString() !== userId
      );
      state.conversations = state.conversations.filter(
        (el) => el?.id !== this_conversation._id
      );
      state.conversations.push({
        id: this_conversation._id._id,
        userId: user?._id,
        name: `${user?.firstName} ${user?.lastName}`,
        online: user?.status === "Online",
        img: faker.image.avatar(),
        msg: faker.music.songName(),
        time: "9:36",
        unread: 0,
        pinned: false,
      });
    },
    setCurrentConversation(state, action) {
      state.currentConversation = action.payload;
    },
    fetchCurrentMessages(state, action) {
      const messages = action.payload.messages;
      const formatted_messages = messages.map((el) => ({
        id: el._id,
        type: "msg",
        subtype: el.type,
        message: el.text,
        incoming: el.to === userId,
        outgoing: el.from === userId,
      }));
      state.currentMessages = formatted_messages;
    },
    addMessage(state, action) {
      state.currentMessages.push(action.payload.message);
    }
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const FetchConversations = () => {
  return async (dispatch, getState) => {
    await axios.get(
      "/conversation/all",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`
        }
      },
    ).then(
      function (response) {
        dispatch(slice.actions.fetchConversations({conversations: response.data}));
      }
    ).catch(
      dispatch(showSnackbar({severity: "error", message: "An error occured while fetch conversation, please reload page!"}))
    )
  };
};
export const AddConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addConversation({ conversation }));
  };
};
export const UpdateConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateConversation({ conversation }));
  };
};

export const SetCurrentConversation = (currentConversation) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setCurrentConversation(currentConversation));
  };
};


export const FetchCurrentMessages = ({messages}) => {
  return async(dispatch, getState) => {
    dispatch(slice.actions.fetchCurrentMessages({messages}));
  }
}

export const AddMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addMessage({message}));
  }
}
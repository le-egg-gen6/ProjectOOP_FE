import { createSlice, current } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";
import axios from "../../utils/axios";
import { showSnackbar } from "./app";

const userId = window.localStorage.getItem("userId");

const initialState = {
  directConversations: [],
  groupConversations: [],
  currentConversation: null,
  currentMessages: [],
};

const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    fetchDirectConversations(state, action) {
      const list = action.payload.conversations.map((el) => {
        return {
          conversationId: el.conversationId,
          participants: el.participants.map(
            (elm) => {
              return {
                userId: elm.userId,
                username: elm.username,
                fullName: elm.fullName,
                avatarUrl: elm.avatarUrl,
              }
            }
          ),
          name: el.name,
          avatarUrl: el.avatarUrl,
          message: el.lastArrivedMessage,
          pinned: false,
        };
      });
      state.directConversations = list;
    },
    fetchGroupConversations(state, action) {
      const list = action.payload.conversations.map((el) => {
        return {
          conversationId: el.conversationId,
          participants: el.participants.map(
            (elm) => {
              return {
                userId: elm.userId,
                username: elm.username,
                fullName: elm.fullName,
                avatarUrl: elm.avatarUrl,
              }
            }
          ),
          name: el.name,
          avatarUrl: el.avatarUrl,
          message: el.lastArrivedMessage,
          pinned: el.pinned,
        };
      });
      state.groupConversations = list;
    },
    updateConversation(state, action) {
      const this_conversation = action.payload.conversation;
      state.conversations = state.conversations.map(
        (el) => {
          if (el?.id !== this_conversation._id) {
            return el;
          } else {
            const user = this_conversation.participants.find(
              (elm) => elm.userId !== userId
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
        id: el.mesaageId,
        type: el.type,
        subtype: el.subtype,
        content: el.content,
        senderId: el.senderId
      }));
      state.currentMessages = formatted_messages;
    },
    addMessage(state, action) {
      if (state.currentConversation.conversationId === action.payload.message.conversationId) {
        state.currentMessages.push(action.payload.message);
      } else {
        state.directConversations = state.directConversations.map(
          (el) => {
            if (el?.conversationId !== this_conversation._id) {
              return el;
            } else {
              const user = this_conversation.participants.find(
                (elm) => elm.userId !== userId
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
      }
    }
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const FetchDirectConversations = () => {
  return async (dispatch, getState) => {
    await axios.get(
      "/conversation/all-direct-conversation",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`
        }
      },
    ).then(
      function (response) {
        dispatch(slice.actions.fetchDirectConversations({ conversations: response.data.data }));
      }
    ).catch(
      (error) => {
        dispatch(showSnackbar({ severity: "error", message: "An error occured while fetch conversation, please reload page!" }));
      }
    )
  };
};

export const FetchGroupConversations = () => {
  return async (dispatch, getState) => {
    await axios.get(
      "/conversation/all-group-conversation",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`
        }
      },
    ).then(
      function (response) {
        dispatch(slice.actions.fetchGroupConversations({ conversations: response.data.data }));
      }
    ).catch(
      (error) => {
        dispatch(showSnackbar({ severity: "error", message: "An error occured while fetch conversation, please reload page!" }));
      }
    )
  };
};

export const AddGroupConversation = (formValues) => {
  return async (dispatch, getState) => {
    await axios.post(
      '/conversation/new-group',
      {
        ...formValues,
        "type": "GROUP"
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`
        }
      }
    ).then(
      function (response) {
        dispatch(showSnackbar({ severity: "success", message: "Group created successfully!" }));
        dispatch(FetchGroupConversations());
      }
    ).catch(
      (error) => {
        dispatch(showSnackbar({ severity: "error", message: "An error occured while create group, please try again!" }))
      }
    )
  }
}

export const AddDirectConversation = ({friendId}) => {
  return async (dispatch, getState) => {
    await axios.post(
      '/conversation/new-group',
      {
        "members": [getState().app.user.userId, friendId],
        "type": "DIRECT"
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`
        }
      }
    ).then(
      function (response) {
        dispatch(showSnackbar({ severity: "success", message: "Your friend are online, start chat now!" }));
        dispatch(FetchDirectConversations());
      }
    ).catch(
      (error) => {
        dispatch(showSnackbar({ severity: "error", message: "An error occured while contact your friend, please try again!" }))
      }
    )
  }
}

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


export const FetchCurrentMessages = (conversationId) => {
  return async (dispatch, getState) => {
    await axios.get(
      "/conversation/all-message",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`
        },
        params: {
          "conversationId": conversationId
        }
      }
    ).then(
      function (response) {
        dispatch(slice.actions.fetchCurrentMessages({messages : response.data.data}));
      }
    ).catch(
      (error) => {
        dispatch(showSnackbar({severity: "error", message: "An error occured while fetch message, please reload page!"}));
      }
    )
  }
}

export const AddMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addMessage({ message }));
  }
}
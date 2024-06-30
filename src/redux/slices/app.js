import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import axiosImage from "../../utils/axiosImageDb";
import { IMAGE_DB_API_KEY } from "../../config";
import { SetCurrentConversation } from "./conversation";
import { useSelector } from "react-redux";
// ----------------------------------------------------------------------

const initialState = {
  user: {},
  sideBar: {
    open: false,
  },
  isLoggedIn: false,
  tab: 0, // [0, 1, 2, 3]
  snackbar: {
    open: null,
    severity: null,
    message: null,
  },
  users: [], // all users of app who are not friends and not requested yet
  friends: [], // all friends
  friendRequests: [], // all friend requests
  selectedConversationId: null,
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchCallLogs(state, action) {
      state.call_logs = action.payload.call_logs;
    },
    fetchUser(state, action) {
      state.user = action.payload.user;
    },
    updateUser(state, action) {
      state.user = action.payload.user;
    },
    // Toggle Sidebar
    toggleSideBar(state) {
      state.sideBar.open = !state.sideBar.open;
    },
    updateSideBarType(state, action) {
      state.sideBar.type = action.payload.type;
    },
    updateTab(state, action) {
      state.tab = action.payload.tab;
    },

    openSnackBar(state, action) {
      // console.log(action.payload);
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackBar(state) {
      state.snackbar.open = false;
      state.snackbar.message = null;
    },
    updateUsers(state, action) {
      state.users = action.payload.users;
    },
    updateFriends(state, action) {
      state.friends = action.payload.friends;
    },
    updateFriendRequests(state, action) {
      state.friendRequests = action.payload.requests;
    },
    selectConversation(state, action) {
      state.selectedConversationId = action.payload.selectedConversationId;
    },
    signOut(state, action) {
      state.user = {};
      state.sideBar = {
        open: false,
      };
      state.isLoggedIn = false;
      state.tab = 0; // [0, 1, 2, 3]
      state.snackbar = {
        open: null,
        severity: null,
        message: null,
      };
      state.users = []; // all users of app who are not friends and not requested yet
      state.friends = []; // all friends
      state.friendRequests = []; // all friend requests
      state.selectedConversationId = null;
    }
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const closeSnackBar = () => async (dispatch, getState) => {
  dispatch(slice.actions.closeSnackBar());
};

export const showSnackbar = ({ severity, message }) => async (dispatch, getState) => {
  dispatch(
    slice.actions.openSnackBar({
      message,
      severity,
    })
  );

  setTimeout(() => {
    dispatch(slice.actions.closeSnackBar());
  }, 4000);
};

export function ToggleSidebar() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.toggleSideBar());
  };
};

export function UpdateSidebarType(type) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateSideBarType({ type }));
  };
};

export function UpdateTab(tab) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateTab(tab));
  };
};

export function LogoutForAppRedux() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.signOut());
  }
}

export function FetchUsers() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/user/get-all-verified-user",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        const success = response.data.success;
        if (success) {
          dispatch(slice.actions.updateUsers({ users: response.data.data }));
        } else {
          dispatch(showSnackbar({ severity: "error", message: response.data.message }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};


export function FetchFriends() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/friend/get-all-friends",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        const success = response.data.success;
        if (success) {
          dispatch(slice.actions.updateFriends({ friends: response.data.data }));
        } else {
          dispatch(showSnackbar({ severity: "error", message: response.data.message }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export function SendFriendRequest(receiverId) {
  return async (dispatch, getState) => {
    await axios.post(
      "/friend-request/send-friend-request",
      {
        senderId: getState().app.user.userId,
        receiverId: receiverId
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      }
    ).then((response) => {
      const success = response.data.success;
      if (success) {
        dispatch(showSnackbar({ severity: "success", message: response.data.message }))
        var usersAfter = getState().app.users;
        var i = 0;
        while (i < usersAfter.length) {
          if (usersAfter[i].userId === receiverId) {
            usersAfter.splice(i, 1);
          } else {
            ++i;
          }
        }
        dispatch(slice.actions.updateUsers({ users: usersAfter }));
      } else {
        dispatch(showSnackbar({ severity: "error", message: response.data.message }));
      }
    }).catch((err) => {
      console.log(err);
    });
  }
}

export function AcceptFriendRequest(requestId, senderId) {
  return async (dispatch, getState) => {
    await axios.post(
      "/friend-request/accept-friend-request",
      {
        requestId: requestId,
        senderId: senderId,
        receiverId: getState().app.user.userId
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      }
    ).then((response) => {
      const success = response.data.success;
      if (success) {
        dispatch(showSnackbar({ severity: "success", message: response.data.message }))
        var friendRequestsAfter = getState().app.friendRequests;
        var i = 0;
        while (i < friendRequestsAfter.length) {
          if (friendRequestsAfter[i].requestId === requestId) {
            friendRequestsAfter.splice(i, 1);
          } else {
            ++i;
          }
        }
        dispatch(slice.actions.updateFriendRequests({ requests: friendRequestsAfter }));
      } else {
        dispatch(showSnackbar({ severity: "error", message: response.data.message }));
      }
    }).catch((err) => {
      console.log(err);
    })
  }
};

export function FetchFriendRequests() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/friend-request/get-all-friend-request",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        const sucesss = response.data.success;
        if (sucesss) {
          dispatch(
            slice.actions.updateFriendRequests({ requests: response.data.data })
          );
        } else {
          dispatch(showSnackbar({ severity: "error", message: response.data.message }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const SelectConversation = ({ selectedConversationId }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.selectConversation({ selectedConversationId }));
    dispatch(SetCurrentConversation());
  };
};

export const FetchUserProfile = () => {
  return async (dispatch, getState) => {
    axios
      .get("/user/get-me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      })
      .then((response) => {
        console.log(response);
        const success = response.data.success;
        if (success) {
          dispatch(slice.actions.fetchUser({ user: response.data.data }));
        } else {
          dispatch(showSnackbar({ severity: "error", message: response.data.message }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const UpdateUserProfile = (formValues) => {
  return async (dispatch, getState) => {

    await axios.post(
      "/user/update-me",
      {
        userId: getState().app.user.userId,
        ...formValues,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      }
    ).then(
      (response) => {
        console.log(response);
        dispatch(slice.actions.updateUser({ user: response.data.data }));
        dispatch(showSnackbar({severity: "success", message: "User updated succesfully!"}))
      }
    ).catch(
      (error) => {
        dispatch(showSnackbar({ severity: "error", message: "An error occured while update your profile, please try again." }));
      }
    )
  };
};

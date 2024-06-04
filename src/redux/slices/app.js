import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import axiosImage from "../../utils/axiosImageDb";
import { IMAGE_DB_API_KEY } from "../../config";
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
  conversationId: null,
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
      console.log(action.payload);
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackBar(state) {
      console.log("This is getting executed");
      state.snackbar.open = false;
      state.snackbar.message = null;
    },
    updateUsers(state, action) {
      state.users = action.payload.users;
    },
    updateAllUsers(state, action) {
      state.allUsers = action.payload.allUsers;
    },
    updateFriends(state, action) {
      state.friends = action.payload.friends;
    },
    updateFriendRequests(state, action) {
      state.friendRequests = action.payload.requests;
    },
    selectConversation(state, action) {
      state.conversationId = action.payload.conversationId;
    },
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
        dispatch(slice.actions.updateUsers({ users: response.data }));
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
        dispatch(slice.actions.updateFriends({ friends: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export function SendFriendRequest(friend_id) {
  return async (dispatch, getState) => {
    await axios.post(
      
    ).then(
  
    ).catch(
  
    )
  }
}

export function AcceptFriendRequest(request_id) {

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
        dispatch(
          slice.actions.updateFriendRequests({ requests: response.data.data })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const SelectConversation = ({ conversationId }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.selectConversation({ conversationId }));
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
        dispatch(slice.actions.fetchUser({ user: response.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const UpdateUserProfile = (formValues) => {
  return async (dispatch, getState) => {
    const file = formValues.avatar;
    axiosImage.post(
      "",
      {
        params: {
          key : IMAGE_DB_API_KEY,
          image : file
        } 
      }
    ).then(
      (response) => {
        axios.post(
          "/user/update-me",
          { 
            ...formValues, 
            avatarUrl: response.data.data.url, 
            avatarName: response.data.data.title,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getState().auth.token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          dispatch(slice.actions.updateUser({ user: response.data }));
        })
        .catch((err) => {
          dispatch(showSnackbar({severity: "error", message: "An error occured while update your details, please try again."}))
        })
      }
    ).catch(
      dispatch(showSnackbar({severity: "error", message: "An error occured while upload your avatar, please try again."})) 
    )
  };
};

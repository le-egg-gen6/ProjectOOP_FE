import { createSlice } from "@reduxjs/toolkit";

import axios from "../../utils/axios";
import { showSnackbar } from "./app";

// ----------------------------------------------------------------------

const initialState = {
  isLoggedIn: false,
  token: "",
  isLoading: false,
  isVerified: false,
  error: false,
  user: null,
  userId: null,
  email: "",
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },
    logIn(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.isVerified = action.payload.isVerified;
    },
    signOut(state, action) {
      state.isLoggedIn = false;
      state.isVerified = false;
      state.token = "";
      state.userId = null;
    },
    updateEmail(state, action) {
      state.email = action.payload.email;
    },
    updateStatus(state, action) {
      state.isVerified = true
    }
  },
});

// Reducer
export default slice.reducer;

export function NewPassword(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/password-reset/verify",
        {
          email: getState().auth.email,
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        const success = response.data.isError === 0;
        if (success) {
          dispatch(
            showSnackbar({ severity: "success", message: response.data.message })
          );
          dispatch(
            slice.actions.updateEmail({ email: "" })
          );
          window.location.href = "/auth/login";
        } else {
          dispatch(
            showSnackbar({ severity: "error", message: response.data.message })
          );
        }
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch(function (error) {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: "An error occured, please try again." }));
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      });
  };
}

export function ForgotPassword(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
    dispatch(
      slice.actions.updateEmail({ email: formValues.email })
    )
    await axios
      .post(
        "/password-reset/send-otp",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        const success = response.data.isError === 0;
        if (success) {
          dispatch(
            showSnackbar({ severity: "success", message: response.data.message })
          );
          window.location.href = "/auth/new-password";
        } else {
          dispatch(
            showSnackbar({ severity: "error", message: response.data.message })
          );
        }
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch(function (error) {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: "An error occured, please try again." }));
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      });
  };
}

export function LoginUser(formValues) {
  return async (dispatch, getState) => {
    // Make API call here

    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/auth/login",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        const success = response.data.isError === 0;
        if (success) {
          dispatch(
            showSnackbar({ severity: "success", message: response.data.message })
          );
          dispatch(
            slice.actions.updateIsLoading({ isLoading: false, error: false })
          );
          dispatch(
            slice.actions.logIn({
              isLoggedIn: true,
              token: response.data.token,
              userId: response.data.userId,
              isVerified: response.data.isVerified === 0 ? true : false,
            })
          );
        } else {
          dispatch(
            showSnackbar({ severity: "error", message: response.data.errorMessage })
          );
          dispatch(
            slice.actions.updateIsLoading({ isLoading: false, error: false })
          );
        }
      })
      .catch(function (error) {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: "An error occured, please try again." }));
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      });
  };
}

export function LogoutUser() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/auth/logout",
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
            "Content-Type": "application/json",
          },
        }
      ).then(
        function (response) {
          console.log(response);
          var success = response.data.isError === 0;
          if (success) {
            dispatch(
              showSnackbar({ severity: "success", message: response.data.message })
            );
            dispatch(slice.actions.signOut());
          } else {
            dispatch(
              showSnackbar({ severity: "error", message: response.data.message })
            );
          }
        }
      ).catch(function (error) {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: "An error occured, please try again." }));
        dispatch(
          slice.actions.updateIsLoading({ error: true, isLoading: false })
        );
      });
  };
}

export function RegisterUser(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/auth/register",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        const success = response.data.isError === 0;
        if (success) {
          dispatch(
            showSnackbar({ severity: "success", message: response.data.message })
          );

          dispatch(
            slice.actions.updateIsLoading({ isLoading: false, error: false })
          );

          dispatch(
            slice.actions.logIn({
              isLoggedIn: true,
              token: response.data.token,
              userId: response.data.userId,
              isVerified: response.data.isVerified === 0 ? true : false,
            })
          )

        } else {
          dispatch(
            showSnackbar({ severity: "error", message: response.data.errorMessage })
          );
          dispatch(
            slice.actions.updateIsLoading({ isLoading: false, error: true })
          );
        }
      })
      .catch(function (error) {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: "An error occured, please try again." }));
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      });
  };
}

export function VerifyEmail(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/email-verification/verify",
        {
          userId: getState().auth.userId,
          ...formValues,
        },
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        var success = response.data.isError === 0;
        if (success) {
          dispatch(
            showSnackbar({ severity: "success", message: response.data.message })
          );
          dispatch(
            slice.actions.updateStatus()
          );
        } else {
          dispatch(
            showSnackbar({ severity: "error", message: response.data.message })
          );
        }
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch(function (error) {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: "An error occured, please try again." }));
        dispatch(
          slice.actions.updateIsLoading({ error: true, isLoading: false })
        );
      });
  };
}

export function ResendEmailOTP(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/email-verification/resend",
        {

        },
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        var success = response.data.isError === 0;
        if (success) {
          dispatch(
            showSnackbar({ severity: "success", message: response.data.message })
          );
        } else {
          dispatch(
            showSnackbar({ severity: "error", message: response.data.message })
          );
        }
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch(function (error) {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: "An error occured, please try again." }));
        dispatch(
          slice.actions.updateIsLoading({ error: true, isLoading: false })
        );
      });
  }
}

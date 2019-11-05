import {
  SESSION_START,
  SESSION_SUCCESS,
  SESSION_FAIL,
  SESSION_LOGOUT,
  // NETWORK
  NETWORK
} from "../types";
import axios from "axios";

const timeOut = 3600 * 24 * 14;

export const logout_session = () => dispatch => {
  localStorage.removeItem("session_id");
  localStorage.removeItem("session_token");
  localStorage.removeItem("expirationSessionTime");
  return dispatch({
    type: SESSION_LOGOUT
  });
};

const checksessionTimeOut = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout_session());
    }, expirationTime * 1000);
  };
};

export const sessionCheckState = () => dispatch => {
  const session_id = localStorage.getItem("session_id");
  const session_token = localStorage.getItem("session_token");
  const expirationDate = new Date(
    localStorage.getItem("expirationSessionTime")
  );
  if (session_id === undefined && session_token === undefined) {
    dispatch(logout_session());
  } else {
    if (expirationDate <= new Date()) {
      dispatch(logout_session());
    } else {
      dispatch(
        checksessionTimeOut(
          (expirationDate.getTime() - new Date().getTime()) / 1000
        )
      );
    }
  }
};

export const getSession = () => {
  return dispatch => {
    // send a request to the server to get the session
    dispatch({
      type: SESSION_START
    });
    const session_id = localStorage.getItem("session_id");
    const session_token = localStorage.getItem("session_token");
    const session = {
      session: { session_id: session_id, session_token: session_token }
    };
    axios
      .post(`${NETWORK}/session`, session)
      .then(response => {
        const session = response.data.session;
        const expirationDate = new Date(new Date().getTime() + timeOut * 1000);

        localStorage.setItem("session_id", session.session_id);
        localStorage.setItem("session_token", session.session_token);
        localStorage.setItem("expirationSessionTime", expirationDate);
        dispatch({
          type: SESSION_SUCCESS,
          session: session
        });
      })
      .catch(error => {
        dispatch({
          type: SESSION_FAIL,
          error: error
        });
      });
  };
};

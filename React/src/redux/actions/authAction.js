import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
  AUTH_SIGNUP_SUCCESS,
  NETWORK
} from "../types";
import axios from "axios";
import { createMessage, createError } from "./alertAction";

export const timeOut = 3600 * 24 * 14;

export const authStart = () => {
  return {
    type: AUTH_START
  };
};
export const authSuccess = token => {
  return {
    type: AUTH_SUCCESS,
    token: token
  };
};
export const authFail = error => {
  return {
    type: AUTH_FAIL,
    error: error
  };
};
export const logout = () => {
  const token = localStorage.getItem("token");
  token !== null
    ? (axios.defaults.headers = {
        "Content-Type": "application/json",
        "x-access-token": `${token}`
      })
    : (axios.defaults.headers = {
        "Content-Type": "application/json"
      });
  if (token !== null) {
    axios.post(`${NETWORK}/logout`).catch(error => console.log(error));
  }
  localStorage.removeItem("token");
  localStorage.removeItem("expirationAuthTime");
  return {
    type: AUTH_LOGOUT
  };
};
export const checkAuthTimeOut = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authLogin = data => {
  return dispatch => {
    dispatch(authStart());
    axios.defaults.headers = {
      "Content-Type": "application/json"
    };
    axios
      .post(`${NETWORK}/login`, data)
      .then(res => {
        console.log(res.data);

        const token = res.data.Token;
        const expirationDate = new Date(new Date().getTime() + timeOut * 1000);
        localStorage.setItem("token", token);
        localStorage.setItem("expirationAuthTime", expirationDate);
        dispatch(authSuccess(null));
        dispatch(createMessage({ message: "Logged In" }));
        dispatch(checkAuthTimeOut(timeOut));
      })
      .catch(error => {
        dispatch(createError({ error: error.response.data.error }));
        dispatch(authFail(error.response.data.error));
        // console.log(error);
      });
  };
};
export const authSignup = data => {
  return dispatch => {
    dispatch(authStart());
    axios
      .post(`${NETWORK}/signup`, data)
      .then(() => {
        dispatch({
          type: AUTH_SIGNUP_SUCCESS
        });
        dispatch(createMessage({ message: "Signed Up" }));
        dispatch(checkAuthTimeOut(timeOut));
      })
      .catch(error => {
        dispatch(createError({ error: error.response.data.error }));
        dispatch(authFail(error.response.data.error));
      });
  };
};
export const authCheckState = () => dispatch => {
  const token = localStorage.getItem("token");
  const expirationDate = new Date(localStorage.getItem("expirationAuthTime"));
  if (token === undefined) {
    dispatch(logout());
  } else {
    if (expirationDate <= new Date()) {
      dispatch(logout());
    } else {
      dispatch(authSuccess(token));
      dispatch(
        checkAuthTimeOut(
          (expirationDate.getTime() - new Date().getTime()) / 1000
        )
      );
    }
  }
};

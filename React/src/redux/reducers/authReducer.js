import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
  AUTH_SIGNUP_SUCCESS
} from "../types";

const initialState = {
  token: null,
  error: null,
  loading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_START:
      return { ...state, error: null, loading: true }; //return authStart(state, action);
    case AUTH_SIGNUP_SUCCESS:
      return { ...state, loading: false };
    case AUTH_SUCCESS:
      return { ...state, token: action.token, error: null, loading: false }; //return authSuccess(state, action);
    case AUTH_FAIL:
      return { ...state, error: action.error, loading: false }; // return authFail(state, action);
    case AUTH_LOGOUT:
      return { ...state, token: null }; //return authLogout(state, action);
    default:
      return state;
  }
};

export default reducer;

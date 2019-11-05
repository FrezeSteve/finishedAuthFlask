import {
  SESSION_START,
  SESSION_SUCCESS,
  SESSION_FAIL,
  SESSION_LOGOUT
} from "../types";

const initialState = {
  session: "",
  error: "",
  loading_session: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SESSION_START:
      return { ...state, loading_session: true };
    case SESSION_SUCCESS:
      return {
        ...state,
        session: action.session,
        loading_session: false
      };
    case SESSION_FAIL:
      return {
        ...state,
        error: action.error.response.data,
        loading_session: false
      };
    case SESSION_LOGOUT:
      return { ...state, session: "" };
    default:
      return state;
  }
};

import {
  CREATE_MESSAGES_START,
  CREATE_MESSAGES_SUCCESS,
  CREATE_ERROR_START,
  CREATE_ERROR_SUCCESS
} from "../types";

const initialState = {
  message: "",
  error: "",
  status: null,
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_MESSAGES_START:
      return { ...state, message: action.payload.message, loading: true };
    case CREATE_MESSAGES_SUCCESS:
      return { ...state, message: "", loading: false };
    case CREATE_ERROR_START:
      return { ...state, error: action.payload.error, loading: true };
    case CREATE_ERROR_SUCCESS:
      return { ...state, error: "", loading: false };
    default:
      return state;
  }
};

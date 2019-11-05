import {
  CREATE_MESSAGES_START,
  CREATE_MESSAGES_SUCCESS,
  CREATE_ERROR_START,
  CREATE_ERROR_SUCCESS
} from "../types";

// CREATE_MESSAGE

export const createMessage = message => dispatch => {
  dispatch({
    type: CREATE_MESSAGES_START,
    payload: message
  });
  setTimeout(() => {
    dispatch({
      type: CREATE_MESSAGES_SUCCESS
    });
  }, 2 * 1000);
};

// CREATE_ERROR

export const createError = error => dispatch => {
  dispatch({
    type: CREATE_ERROR_START,
    payload: error
  });
  setTimeout(() => {
    dispatch({
      type: CREATE_ERROR_SUCCESS
    });
  }, 2 * 1000);
};

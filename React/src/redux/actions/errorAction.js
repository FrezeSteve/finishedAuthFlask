import { createError } from "./alertAction";

export const ErrorDispatch = error => {
  return dispatch => {
    dispatch(createError(error));
  };
};

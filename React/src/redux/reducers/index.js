import { combineReducers } from "redux";

// Reducers
import sessionReducer from "./sessionReducer";
import productReducer from "./productReducer";
import authReducer from "./authReducer";
import alertReducer from "./alertReducer";

export default combineReducers({
  sessionReducer,
  productReducer,
  authReducer,
  alertReducer
});

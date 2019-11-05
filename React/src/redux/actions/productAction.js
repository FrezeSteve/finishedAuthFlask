import {
  PRODUCT_START,
  PRODUCT_SUCCESS,
  PRODUCT_FAIL,
  NETWORK
} from "../types";
import { createError } from "./alertAction";
import axios from "axios";

export const postProduct = data => dispatch => {
  dispatch({
    type: PRODUCT_START
  });
  const token = localStorage.getItem("token");
  token !== null
    ? (axios.defaults.headers = {
        "Content-Type": "application/json",
        "x-access-token": `${token}`
      })
    : (axios.defaults.headers = {
        "Content-Type": "application/json"
      });
  axios
    .post(`${NETWORK}/product`, data)
    .then(res => {
      dispatch({
        type: PRODUCT_SUCCESS,
        message: res.data
      });
    })
    .catch(error => {
      dispatch({
        type: PRODUCT_FAIL,
        error: error.response.data.error
      });
      dispatch(createError({ error: error.response.data.error }));
    });
};

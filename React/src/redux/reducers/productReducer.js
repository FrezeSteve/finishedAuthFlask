import { PRODUCT_START, PRODUCT_SUCCESS, PRODUCT_FAIL } from "../types";

const initialState = {
  message: "",
  error: "",
  loading_product: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_START:
      return { ...state, loading_product: true };
    case PRODUCT_SUCCESS:
      return {
        ...state,
        message: action.message,
        loading_product: false
      };
    case PRODUCT_FAIL:
      return {
        ...state,
        error: action.error,
        loading_product: false
      };
    default:
      return state;
  }
};

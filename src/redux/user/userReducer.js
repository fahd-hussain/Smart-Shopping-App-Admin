const initState = {
  loading: false,
  user: [],
  error: "",
};

export const userReducer = (state = initState, action) => {
  switch (action.type) {
    case "GET_USER_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "GET_USER_SUCCESS":
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: ''
      };

    case "GET_USER_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: [],
      };
    default:
      return state;
  }
};

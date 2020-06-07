const initState = {
    loading: false,
    store: [],
    stores: "",
    error: "",
};

export const storeReducer = (state = initState, action) => {
    switch (action.type) {
        case "UPDATE_STORE_SUCCESS":
            return {
                ...state,
                store: action.payload,
            };
        case "FETCH_STORE_REQUEST":
            return {
                ...state,
                loading: true,
            };

        case "FETCH_STORE_SUCCESS":
            return {
                ...state,
                stores: action.payload,
                loading: false,
                error: "",
            };

        case "FETCH_STORE_FAILURE":
            return {
                ...state,
                error: action.payload,
                stores: "",
            };
        default:
            return state;
    }
};

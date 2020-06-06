const initState = {
    loading: false,
    shelf: "",
    shelves: [],
    error: "",
};

export const shelfReducer = (state = initState, action) => {
    switch (action.type) {
        case "UPDATE_SHELF_SUCCESS":
            return {
                ...state,
                shelf: action.payload,
            };
        case "FETCH_SHELVES_REQUEST":
            return {
                loading: true,
            };
        case "FETCH_SHELVES_SUCCESS":
            return {
                ...state,
                loading: false,
                shelves: action.payload,
                error: "",
            };
        case "FETCH_SHELVES_FAILURE":
            return {
                ...state,
                loading: false,
                shelves: [],
                error: action.payload,
            };
        default:
            return state;
    }
};

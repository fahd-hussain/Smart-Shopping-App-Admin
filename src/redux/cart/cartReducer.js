const initState = {
    loading: false,
    cart: [],
    carts: [],
    error: "",
};

export const cartReducer = (state = initState, action) => {
    switch (action.type) {
        case "CART_UPDATE":
            return {
                ...state,
                cart: action.payload,
            };

        case "FETCH_CART_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "FETCH_CART_SUCCESS":
            return {
                ...state,
                carts: action.payload,
                error: ""
            };
        case "FETCH_CART_FAILURE":
            return {
                ...state,
                error: action.payload,
                carts: []
            };
        default:
            return state;
    }
};

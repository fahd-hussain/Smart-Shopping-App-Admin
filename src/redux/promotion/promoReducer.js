const initState = {
    isLoading: true,
    errorMessage: null,
    promotions: [],
    promotion: []
}

export const promoReducer = ( state = initState, action) => {
    switch ( action.type ){
        case "UPDATE_PROMOTION_SUCCESS":
            return {
                ...state,
                promotion: action.payload,
            };
        case "FETCH_PROMOTIONS_SUCCESS":
            return { 
                ...state,
                isLoading: false,
                errorMessage: null,
                promotions: action.payload
            }
        
        case "FETCH_PROMOTIONS_REQUEST":
            return {
                ...state,
                isLoading: true,
                errorMessage: null,
                promotions: []
            }
        case "FETCH_PROMOTIONS_FAILED":
            return {
                ...state,
                isLoading: false,
                errorMessage: action.payload,
                promotions: []
            }
        default:
            return state
    }
}
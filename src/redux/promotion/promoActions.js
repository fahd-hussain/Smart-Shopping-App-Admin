// Libraries
import axios from 'axios'

// Local Imports
import baseUrl from '../../constants/baseUrl'

// Global Variables
const url = `${baseUrl}promotions`

const fetchPromotionsLoading = () => {
    return {
        type: "FETCH_PROMOTIONS_REQUEST"
    }
}

const fetchPromotionsFailed = ( errorMessage ) => {
    return {
        type: "FETCH_PROMOTIONS_FAILED",
        payload: errorMessage
    }
}

const fetchPromotionsSuccess = ( promotions ) => {
    return {
        type: "FETCH_PROMOTIONS_SUCCESS",
        payload: promotions
    }
}

const updatePromotionSuccess = (promotion) => {
    return {
        type: "UPDATE_PROMOTION_SUCCESS",
        payload: promotion
    }
}

export const updatePromotion = (data) => (dispatch) => {
    return dispatch(updatePromotionSuccess(data))
}

export const fetchPromotions = () => ( dispatch ) => {
    dispatch(fetchPromotionsLoading())

    const promiseArray = [];

    promiseArray.push(
        new Promise((resolve, reject) => {
            axios(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(res => {
                const temp = [];
                res.data.map( item => {
                    temp.push({ _id: item._id, description: item.description, image: item.image, label: item.label, name: item.name, price: item.price })
                })
                dispatch(fetchPromotionsSuccess(temp))
                resolve(temp)
            })
            .catch(error => {
                dispatch(fetchPromotionsFailed(error))
                reject(error)
            })
        })
    )
    return Promise.all(promiseArray)
}
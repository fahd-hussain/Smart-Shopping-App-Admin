import axios from "axios";

import baseUrl from "../../constants/baseUrl";

const updateCartSuccess = (data) => {
    return {
        type: "CART_UPDATE",
        payload: data,
    };
};
const fetchCartRequest = () => {
    return {
        type: "FETCH_CART_REQUEST",
    };
};
const fetchCartSuccess = (data) => {
    return {
        type: "FETCH_CART_SUCCESS",
        payload: data,
    };
};
const fetchCartFailure = (error) => {
    return {
        type: "FETCH_CART_FAILURE",
        payload: error,
    };
};

export const updateCart = (data) => (dispatch) => {
    return dispatch(updateCartSuccess(data));
};

export const fetchCart = (token) => (dispatch) => {
    dispatch(fetchCartRequest);
    const promiseArray = [];
    const url = `${baseUrl}cart`;
    promiseArray.push(
        new Promise((resolve, reject) => {
            axios(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            })
            .then((res) => {
                const temp = []
                res.data.map( item => {
                    temp.push({ _id: item._id, cartItems: item.cartItems, totalPrice: item.totalPrice, name: item.createdAt })
                })
                dispatch(fetchCartSuccess(temp));
                resolve(temp)
            })
            .catch((error) => {
                dispatch(fetchCartFailure(error));
                reject(error)
            });
        }),
    );

    return Promise.all(promiseArray)
};

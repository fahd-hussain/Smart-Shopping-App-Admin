// Libraries
import axios from "axios";

// Local Imports
import baseUrl from "../../constants/baseUrl";

// Global Variables
const url = `${baseUrl}store`

const updateStoreSuccess = (data) => {
    return {
        type: "UPDATE_STORE_SUCCESS",
        payload: data,
    };
};

const fetchStoreRequest = () => {
    return {
        type: "FETCH_STORE_REQUEST",
    };
};

const fetchStoreSuccess = (store) => {
    return {
        type: "FETCH_STORE_SUCCESS",
        payload: store,
    };
};

const fetchStoreFailure = (error) => {
    return {
        type: "FETCH_STORE_FAILURE",
        payload: error,
    };
};

export const updateStore = (data) => (dispatch) => {
    return dispatch(updateStoreSuccess(data));
};

export const fetchStore = () => (dispatch) => {
    dispatch(fetchStoreRequest());
    
    const promiseArray = [];

    promiseArray.push(
        new Promise((resolve, reject) => {
            axios(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    const store = [];
                    res.data.map((element) => store.push({ barcode: element.barcode, name: element.name, _id: element._id, price: element.price, shelf: new Object({ name: element.shelf.name, _id: element.shelf._id})}));
                    dispatch(fetchStoreSuccess(store));
                    // console.log(store)
                    resolve(store)
                })
                .catch((error) => {
                    dispatch(fetchStoreFailure(error));
                    reject(error)
                });
        })
    )
    return Promise.all(promiseArray)
};

import axios from "axios";

// Local Imports
import baseUrl from "../../constants/baseUrl";

// Global Variables
const url = `${baseUrl}users`;

const fetchTokenRequest = () => {
    return {
        type: "TOKEN_REQUEST",
    };
};

const fetchTokenSuccess = (token) => {
    return {
        type: "TOKEN_SUCCESS",
        payload: token,
    };
};

const fetchTokenFailure = (error) => {
    return {
        type: "TOKEN_FAILURE",
        payload: error,
    };
};

export const getToken = (username, password) => (dispatch) => {
    dispatch(fetchTokenRequest());

    const promiseArray = [];

    promiseArray.push(
        new Promise((resolve, reject) => {
            axios(`${url}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({ username, password }),
            })
                .then((res) => {
                    const token = "Bearer " + res.data.token;
                    dispatch(fetchTokenSuccess(token));
                    resolve(token);
                })
                .catch((error) => {
                    dispatch(fetchTokenFailure(error));
                    reject(error);
                });
        }),
    );

    return Promise.all(promiseArray);
};
// --------------------------------------------------------------------------- //
export const setToken = (username, password, firstname, lastname, gender) => (dispatch) => {
    dispatch(fetchTokenRequest());

    const promiseArray = [];

    promiseArray.push(
        new Promise((resolve, reject) => {
            axios(`${url}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({ username, password, firstname, lastname, gender }),
            })
                .then((res) => {
                    const token = "Bearer " + res.data.token;
                    dispatch(fetchTokenSuccess(token));
                    resolve(token);
                })
                .catch((error) => {
                    dispatch(fetchTokenFailure(error));
                    reject(error);
                });
        }),
    );

    return Promise.all(promiseArray);
};
//---------------------------------------------------------------------------- //
export const removeToken = () => (dispatch) => {
    dispatch(fetchTokenRequest());

    const promiseArray = [];

    promiseArray.push(
        new Promise((resolve, reject) => {
            axios(`${url}/logout`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(() => {
                    dispatch(fetchTokenSuccess(null));
                    resolve("done");
                })
                .catch((error) => {
                    dispatch(fetchTokenFailure(error));
                    reject(error);
                });
        }),
    );

    return Promise.all(promiseArray);
};

// Libraries
import axios from "axios";

// Local Imports
import baseUrl from "../../constants/baseUrl";

// Global Variables
const url = `${baseUrl}users`
const fetchUserRequest = () => {
    return {
        type: "GET_USER_REQUEST",
    };
};

const fetchUserSuccess = (user) => {
    return {
        type: "GET_USER_SUCCESS",
        payload: user,
    };
};

const fetchUserFailure = (error) => {
    return {
        type: "GET_USER_FAILURE",
        payload: error,
    };
};

export const fetchUser = (token) => (dispatch) => {
    dispatch(fetchUserRequest());

    const promiseArray = [];

    promiseArray.push(
        new Promise((resolve, reject) => {
            axios(`${url}/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            })
                .then((res) => {
                    const { _id, username, profilePicture, firstname, lastname, gender, admin } = res.data.user
                    const user = {_id, username, profilePicture, firstname, lastname, gender, admin}
                    dispatch(fetchUserSuccess(user));
                    resolve(user)
                })
                .catch((error) => {
                    dispatch(fetchUserFailure(error));
                    reject(error)
                });
        }),
    );

    return Promise.all(promiseArray)
};

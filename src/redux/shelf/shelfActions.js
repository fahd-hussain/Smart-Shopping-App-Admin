// Libraries
import axios from "axios";

// Local Imports
import baseUrl from "../../constants/baseUrl";

// Global Variables
const url = `${baseUrl}shelf`;

const updateShelfSuccess = (data) => {
    return {
        type: "UPDATE_SHELF_SUCCESS",
        payload: data,
    };
};

const fetchShelvesRequest = () => {
    return {
        type: "FETCH_SHELVES_REQUEST",
    };
};

const fetchShelvesSuccess = (payload) => {
    return {
        type: "FETCH_SHELVES_SUCCESS",
        payload,
    };
};

const fetchShelvesFailure = (payload) => {
    return {
        type: "FETCH_SHELVES_FAILURE",
        payload,
    };
};

export const updateShelf = (data) => (dispatch) => {
    return dispatch(updateShelfSuccess(data));
};

export const fetchShelves = () => (dispatch) => {
    dispatch(fetchShelvesRequest);

    const promiseArray = [];
    // console.log(url)
    promiseArray.push(
        new Promise((resolve, reject) => {
            axios(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    const Shelves = [];
                    res.data.map((item) => {
                        Shelves.push({
                            _id: item._id,
                            column: item.column,
                            row: item.row,
                            isCorner: item.isCorner,
                            neighbors: item.neighbors,
                            name: item.name,
                        });
                    });
                    // console.log(Shelves[0].neighbors)
                    dispatch(fetchShelvesSuccess(Shelves));
                    resolve(Shelves);
                })
                .catch((error) => {
                    dispatch(fetchShelvesFailure(error));
                    reject(error);
                });
        }),
    );
    return Promise.all(promiseArray);
};

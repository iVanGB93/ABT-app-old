import axiosInstance from "../../axios";
import { SET_ITEMS, CHANGE_LOADING_ITEM, CHANGE_ERROR, SET_ITEM, SET_USED_ITEMS } from "./actionTypes";

export const changeLoading = (loading) => {
    return {
        type: CHANGE_LOADING_ITEM,
        payload: loading
    }
};

export const changeError = (error) => {
    return {
        type: CHANGE_ERROR,
        payload: error
    }
};

export const setItem = (item) => {
    return {
        type: SET_ITEM,
        payload: item
    }
}

export const getItems = (provider) => {
    return async (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_ITEM,
            payload: true
        })
        await axiosInstance
        .get(`items/list/${provider}/`)
        .then(function(response) {
            dispatch({
                type: SET_ITEMS,
                payload: response.data
            })
        })
        .catch(function(error) {
            console.error('Error fetching items:', error.message);
            dispatch({
                type: CHANGE_ERROR,
                payload: error.message
            })
        });
    }
};

export const getUsedItems = (id) => {
    return async (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_ITEM,
            payload: true
        })
        await axiosInstance
        .get(`jobs/items/used/${id}/`)
        .then(function(response) {
            dispatch({
                type: SET_USED_ITEMS,
                payload: response.data
            })
        })
        .catch(function(error) {
            console.error('Error fetching items:', error.message);
            dispatch({
                type: CHANGE_ERROR,
                payload: error.message
            })
        });
    }
};


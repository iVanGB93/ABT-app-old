import axiosInstance from "../../axios";
import { SET_CLIENTS, DELETE_CLIENT, CHANGE_LOADING_CLIENT, SET_CLIENT, CHANGE_ERROR } from "./actionTypes";

export const changeLoading = (loading) => {
    return {
        type: CHANGE_LOADING_CLIENT,
        payload: loading
    }
};

export const setError = (error) => {
    return {
        type: CHANGE_ERROR,
        payload: error
    }
};


export const getClients = (provider) => {
    return async (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_CLIENT,
            payload: true
        })
        await axiosInstance
        .get(`user/clients/${provider}/`)
        .then(function(response) {
            if (response.data) {
                dispatch({
                    type: SET_CLIENTS,
                    payload: response.data
                })
            } else {
                dispatch({
                    type: CHANGE_ERROR,
                    payload: response
                })
            }
        })
        .catch(function(error) {
            console.error('Error fetching clients:', error.message);
            dispatch({
                type: CHANGE_ERROR,
                payload: error.message
            })
        });
    }
};

export const getClient = (id) => {
    return async (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_CLIENT,
            payload: true
        })
        await axiosInstance
        .get(`jobs/client/detail/${id}/`)
        .then(function(response) {
            dispatch({
                type: SET_CLIENT,
                payload: response.data
            })
        })
        .catch(function(error) {
            console.error('Error fetching a client:', error.message);
            dispatch({
                type: CHANGE_ERROR,
                payload: error.message
            })
        });
    }
};

export const deleteClient = (id) => {
    return async (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_CLIENT,
            payload: true
        })
        await axiosInstance
        .get(`jobs/client/delete/${id}/1`)
        .then(function(response) {
            dispatch({
                type: DELETE_CLIENT,
                payload: {'name': response.data.message}
            })
        })
        .catch(function(error) {
            console.error('Error deleting a client:', error.message);
            dispatch({
                type: CHANGE_ERROR,
                payload: error.message
            })
        });
    }
};

export const setClient = (client) => {
    return {
        type: SET_CLIENT,
        payload: client
    }
};
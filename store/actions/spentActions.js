import { SET_SPENTS, SET_SPENT, CHANGE_ERROR, CHANGE_LOADING_SPENT, ACTION_SUCCESS } from '../actions/actionTypes';
import axiosInstance from "../../axios";

export const changeLoading = (loading) => {
    return {
        type: CHANGE_LOADING_SPENT,
        payload: loading
    }
};

export const changeError = (error) => {
    return {
        type: CHANGE_ERROR,
        payload: error
    }
};

export const setSpent = (spent) => {
    return {
        type: SET_SPENT,
        payload: spent
    }
};

export const getSpents = (id) => {
    return async (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_SPENT,
            payload: true
        })
        await axiosInstance
        .get(`jobs/spents/list/${id}/`)
        .then(function(response) {
            dispatch({
                type: SET_SPENTS,
                payload: response.data
            })
        })
        .catch(function(error) {
            console.error('Error fetching spents:', error.message);
            dispatch({
                type: CHANGE_ERROR,
                payload: error.message
            })
        });
    }
};

export const editSpent = (id, description, price, image) => {
    return async (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_SPENT,
            payload: true
        })
        const formData = new FormData();
        formData.append('action', 'update');
        formData.append('description', description);
        formData.append('price', price);
        if (image !== null) {
            const uriParts = image.uri.split('.');
            const fileType = uriParts[uriParts.length - 1];
            const fileName = `${description}SpentPicture.${fileType}`;
            formData.append('image', {
                uri: image.uri,
                name: fileName,
                type: `image/${fileType}`,
            })
        };
        await axiosInstance
        .post(`jobs/spents/update/${id}/`, formData,
        { headers: {
            'content-Type': 'multipart/form-data',
        }})
        .then(function(response) {
            data = response.data;
            if (data.OK) {
                dispatch({
                    type: ACTION_SUCCESS,
                    payload: response.data.message
                })
            }
        })
        .catch(function(error) {
            console.error('Error updating a spent:', error);
            dispatch({
                type: CHANGE_ERROR,
                payload: error.message
            })
        });
    }
};

export const createSpent = (job_id, description, price, image, isEnabled) => {
    return async (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_SPENT,
            payload: true
        })
        const formData = new FormData();
        formData.append('action', 'new');
        formData.append('job_id', job_id);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('use_item', isEnabled);
        if (image !== null) {
            const uriParts = image.uri.split('.');
            const fileType = uriParts[uriParts.length - 1];
            const fileName = `${description}SpentPicture.${fileType}`;
            formData.append('image', {
                uri: image.uri,
                name: fileName,
                type: `image/${fileType}`,
            })
        };
        await axiosInstance
        .post('jobs/spents/create/new/', formData,
        { headers: {
            'content-Type': 'multipart/form-data',
        }})
        .then(function(response) {
            data = response.data;
            if (data.OK) {
                dispatch({
                    type: ACTION_SUCCESS,
                    payload: response.data.message
                })
            }
        })
        .catch(function(error) {
            console.error('Error creating a spent:', error);
            dispatch({
                type: CHANGE_ERROR,
                payload: error.message
            })
        });
    }
};

export const deleteSpent = (id) => {
    return async (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_SPENT,
            payload: true
        })
        await axiosInstance
        .post(`jobs/spents/delete/${id}/`, { action: 'delete'},
        { headers: {
        'content-Type': 'multipart/form-data',
        }})
        .then(function(response) {
            if (response.data.OK) {
                dispatch({
                    type: ACTION_SUCCESS,
                    payload: response.data.message
                });
            }
        })
        .catch(function(error) {
            console.error('Error deleting a spent:', error);
            dispatch({
                type: CHANGE_ERROR,
                payload: error.message
            })
        });
    };
};
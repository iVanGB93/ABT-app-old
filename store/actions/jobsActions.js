import axiosInstance from "../../axios"
import { SET_JOBS, SET_JOB, CHANGE_LOADING_JOB, CHANGE_ERROR, SET_INVOICE, SET_CHARGES } from "./actionTypes";

export const changeLoading = (loading) => {
    return {
        type: CHANGE_LOADING_JOB,
        payload: loading
    }
};

export const setError = (error) => {
    return {
        type: CHANGE_ERROR,
        payload: error
    }
};

export const getJobs = (provider) => {
    return async (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_JOB,
            payload: true
        })
        await axiosInstance
        .get(`jobs/list/${provider}/`)
        .then(function(response) {
            dispatch({
                type: SET_JOBS,
                payload: response.data
            })
        })
        .catch(function(error) {
            console.error('Error fetching jobs:', error.message);
            dispatch({
                type: CHANGE_ERROR,
                payload: error.message
            });
        });
    }
};

export const getJob = (id) => {
    return async (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_JOB,
            payload: true
        })
        await axiosInstance
        .get(`jobs/detail/${id}/`)
        .then(function(response) {
            dispatch({
                type: SET_JOB,
                payload: response.data
            })
        })
        .catch(function(error) {
            console.error('Error fetching a Job:', error.message);
            dispatch({
                type: CHANGE_ERROR,
                payload: error.message
            });
        });
    }
};

export const setJob = (job) => {
    return {
        type: SET_JOB,
        payload: job
    }
};

export const setCharges = (charges) => {
    return {
        type: SET_CHARGES,
        payload: charges
    }
};

export const setInvoice = (invoice) => {
    return {
        type: SET_INVOICE,
        payload: invoice
    }
};

export const getCharges = (invoice) => {
    return async (dispatch) => {
        await axiosInstance
        .get(`jobs/charges/${invoice}/`)
        .then(function(response) {
            dispatch({
                type: SET_CHARGES,
                payload: response.data
            })
        })
        .catch(function(error) {
            console.error('Error fetching Charges:', error);
            if (error.response.status === 404) {
                dispatch({
                    type: CHANGE_ERROR,
                    payload: error.response.data.message
                });
            } else {
                dispatch({
                    type: CHANGE_ERROR,
                    payload: error.message
                });
            }
        });
    }
};

export const getInvoice = (job) => {
    return async (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_JOB,
            payload: true
        })
        await axiosInstance
        .get(`jobs/invoice/${job}/`)
        .then(function(response) {
            if (response.status === 200) {
                dispatch({
                    type: SET_INVOICE,
                    payload: response.data.invoice
                });
                dispatch({
                    type: SET_CHARGES,
                    payload: response.data.charges
                });
            } else {
                dispatch({
                    type: SET_INVOICE,
                    payload: {},
                });
                dispatch({
                    type: SET_CHARGES,
                    payload: [],
                });
                dispatch({
                    type: CHANGE_ERROR,
                    payload: response.data.message
                });
            }
        })
        .catch(function(error) {
            console.error('Error fetching a Job:', error);
            dispatch({
                type: CHANGE_ERROR,
                payload: error.message
            });
        });
    }
};

export const createInvoice = (job, price, paid, charges) => {
    return async (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_JOB,
            payload: true
        })
        await axiosInstance
        .post(`jobs/invoice/create/${job}/`, {price: price, paid: paid, charges: charges})
        .then(function(response) {
            dispatch({
                type: SET_INVOICE,
                payload: response.data
            })
        })
        .catch(function(error) {
            console.error('Error creating invoice:', error);
            if (error.response.status === 404) {
                dispatch({
                    type: CHANGE_ERROR,
                    payload: error.response.data.message
                });
            } else {
                dispatch({
                    type: CHANGE_ERROR,
                    payload: error.message
                });
            }
        });
    }
};

export const updateInvoice = (job, price, paid, charges) => {
    return async (dispatch) => {
        dispatch({
            type: CHANGE_LOADING_JOB,
            payload: true
        })
        await axiosInstance
        .put(`jobs/invoice/update/${job}/`, {price: price, paid: paid, charges: charges})
        .then(function(response) {
            dispatch({
                type: SET_INVOICE,
                payload: response.data
            })
        })
        .catch(function(error) {
            console.error('Error creating invoice:', error);
            if (error.response.status === 404) {
                dispatch({
                    type: CHANGE_ERROR,
                    payload: error.response.data.message
                });
            } else {
                dispatch({
                    type: CHANGE_ERROR,
                    payload: error.message
                });
            }
        });
    }
};
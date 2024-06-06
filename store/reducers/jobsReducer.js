import { SET_JOBS, SET_JOB, CHANGE_LOADING_JOB, CHANGE_ERROR, SET_INVOICE, SET_CHARGES } from "../actions/actionTypes";


const initialState = {
    loading: false,
    job: {},
    jobs: [],
    error: null,
    updated: false,
    invoice: {},
    charges: [],
}

export default (state = initialState, {type, payload}) => {
    switch (type) {
        case CHANGE_LOADING_JOB:
            return {...state, loading: payload}
        case CHANGE_ERROR:
            return {...state, error: payload, loading: false}
        case SET_JOB:
            return {...state, job: payload, loading: false, error: null, updated: true}
        case SET_JOBS:
            return {...state, jobs: payload, loading: false, error: null, updated: true}
        case SET_INVOICE:
            return {...state, invoice: payload, loading: false, error: null, updated: true}
        case SET_CHARGES:
            return {...state, charges: payload, loading: false, error: null, updated: true}
        default:
            break;
    }
    return state
}
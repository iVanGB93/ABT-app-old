import { SET_SPENTS, SET_SPENT, CHANGE_ERROR, CHANGE_LOADING_SPENT, ACTION_SUCCESS } from '../actions/actionTypes';

const initialState = {
    loading: false,
    spent: {},
    spents: [],
    message: null,
    error: null,
}

export default (state = initialState, {type, payload}) => {
    switch (type) {
        case CHANGE_LOADING_SPENT:
            return {...state, loading: payload}
        case CHANGE_ERROR:
            return {...state, error: payload, loading: false, message: null}
        case ACTION_SUCCESS:
            return {...state, message: payload, loading: false, error: null}
        case SET_SPENTS:
            return {...state, spents: payload, loading: false, message: null, error: null}
        case SET_SPENT:
            return {...state, spent: payload, loading: false, message: null, error: null}
        default:
            break;
    }
    return state
}
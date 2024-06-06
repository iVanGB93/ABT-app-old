import { DELETE_CLIENT, CHANGE_LOADING_CLIENT, SET_CLIENT, SET_CLIENTS, CHANGE_ERROR } from "../actions/actionTypes";


const initialState = {
    loading: false,
    client: {},
    clients: [],
    error: null,
}

export default (state = initialState, {type, payload}) => {
    switch (type) {
        case CHANGE_LOADING_CLIENT:
            return {...state, loading: payload}
        case CHANGE_ERROR:
            return {...state, error: payload, loading: false}
        case SET_CLIENT:
            return {...state, client: payload, loading: false, error: null}
        case SET_CLIENTS:
            return {...state, clients: payload, loading: false, error: null}
        case DELETE_CLIENT:
            return {...state, client: payload, loading: false, error: null}
        default:
            break;
    }
    return state
}
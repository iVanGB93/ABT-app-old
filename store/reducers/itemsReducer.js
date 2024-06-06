import { SET_ITEMS, CHANGE_LOADING_ITEM, CHANGE_ERROR, SET_ITEM, SET_USED_ITEMS } from '../actions/actionTypes';

const initialState = {
    loading: false,
    item: {},
    items: [],
    usedItems: [],
    error: null,
}

export default (state = initialState, {type, payload}) => {
    switch (type) {
        case CHANGE_LOADING_ITEM:
            return {...state, loading: payload}
        case CHANGE_ERROR:
            return {...state, error: payload, loading: false}
        case SET_ITEMS:
            return {...state, items: payload, loading: false, error: null}
        case SET_USED_ITEMS:
            return {...state, usedItems: payload, loading: false, error: null}
        case SET_ITEM:
            return {...state, item: payload, loading: false, error: null}
        default:
            break;
    }
    return state
}
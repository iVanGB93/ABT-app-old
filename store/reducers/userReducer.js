import { AUTH_START, AUTH_SUCCESS, AUTH_LOGOUT, AUTH_FAIL, AUTH_TOKENS, CHANGE_STYLE, CHANGE_BUSSINESS_NAME, CHANGE_IMAGE_URI } from '../actions/actionTypes';

const initialState = {
    loading: false,
    userName: null,
    token: null,
    refreshToken: null,
    error: null,
    color: '#694fad',
    textColor: '#ffffff',
    darkTheme: false,
    bussinessName: "Bussiness Name",
    imageUri: null,
};

export default (state = initialState, {type, payload}) => {
    switch (type) {
        case AUTH_START:
            return {...state, loading: true, error: null}
        case AUTH_SUCCESS:
            return {...state, loading: false, userName: payload.username, token: payload.token, refreshToken: payload.refreshToken}
        case AUTH_TOKENS:
            return {...state, loading: false, token: payload.token, refreshToken: payload.refreshToken}
        case AUTH_FAIL:
            return {...state, loading: false, error: payload}
        case AUTH_LOGOUT:
            return {...state, loading: false, userName: null, token: null}
        case CHANGE_STYLE:
            return {...state, color: payload.color, darkTheme: payload.darkTheme, textColor: payload.textColor}
        case CHANGE_BUSSINESS_NAME:
            return {...state, bussinessName: payload}
        case CHANGE_IMAGE_URI:
            return {...state, imageUri: payload}
        default:
            break;
    }
    return state
}
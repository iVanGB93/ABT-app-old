import { AUTH_TOKENS, CHANGE_BUSSINESS_NAME, CHANGE_IMAGE_URI, CHANGE_STYLE } from "./actionTypes";


export const setTokens = (token, refreshToken) => {
    return {
        type: AUTH_TOKENS,
        payload: {
            token: token,
            refreshToken: refreshToken,
        },
    };
};

export const setBussinessName = (name) => {
    return {
        type: CHANGE_BUSSINESS_NAME,
        payload: name,
    };
};

export const setImageUri = (uri) => {
    return {
        type: CHANGE_IMAGE_URI,
        payload: uri,
    };
};
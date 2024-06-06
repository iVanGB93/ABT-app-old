import axiosInstance from "../../axios";
import { AUTH_LOGOUT, AUTH_START, AUTH_SUCCESS, AUTH_FAIL, AUTH_TOKENS, CHANGE_STYLE } from "./actionTypes";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const authSuccess = (username, token, refreshToken) => {
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('refreshToken', refreshToken);
    return {
        type: AUTH_SUCCESS,
        payload: {
            username: username,
            token: token,
            refreshToken: refreshToken,
        },
    };
};

export const setTokens = (token, refreshToken) => {
    return {
        type: AUTH_TOKENS,
        payload: {
            token: token,
            refreshToken: refreshToken,
        },
    };
};

export const authLogin = (username, password) => {
    return async (dispatch) => {
        dispatch({
            type: AUTH_START,
        })
        await axiosInstance
        .post("token/", {username: username, password: password})
        .then(function(response) {
            if (response.data.access !== undefined) {
                dispatch(authSuccess(username, response.data.access, response.data.refresh));
            } else {
                dispatch({
                    type: AUTH_FAIL,
                    payload: "Token not defined."
                })
            }
        })
        .catch(function(error) {
            console.error('Error logging in:', error.response, error.message);
            if (typeof error.response === 'undefined') {
                dispatch({
                    type: AUTH_LOGOUT,
                })
            } else {
                if (error.response.status === 401) {
                    dispatch({
                        type: AUTH_FAIL,
                        payload: "Username or Password incorrect"
                    })
                } else {
                    dispatch({
                        type: AUTH_FAIL,
                        payload: error.message
                    })
                };
            };
        });
    }
};

export const authRegister = (username, password, email) => {
    return async (dispatch) => {
        dispatch({
            type: AUTH_START,
        })
        await axiosInstance
        .post("user/register/", {username: username, password: password, email: email})
        .then(function(response) {
            console.log(response.data);
            if (response.status === 201) {
                dispatch(authLogin(username, password))
            } 
            if (response.status === 203) {
                dispatch({
                    type: AUTH_FAIL,
                    payload: response.data.message
                })
            }
        })
        .catch(function(error) {
            console.error('Error registering:', error, error.message);
            if (typeof error.response === 'undefined') {
                dispatch({
                    type: AUTH_LOGOUT,
                })
            } else {
                dispatch({
                    type: AUTH_FAIL,
                    payload: error.message
                })
            };
        });
    }
};

export const authLogout = () => {
    return {
        type: AUTH_LOGOUT,
        payload: false
    }
};

export const changeStyle = (color, darkTheme, textColor) => {
    return {
        type: CHANGE_STYLE,
        payload: {
            color: color,
            darkTheme: darkTheme,
            textColor: textColor
        }
    }
};
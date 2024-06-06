import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Alert } from 'react-native';
/* import { decode as atob } from 'base-64'; */
import { navigate } from './navigationRef';
import { store } from './store/store';
import { baseURL } from './settings';
import { setTokens } from './store/actions/userActions';

const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 5000
});

axiosInstance.interceptors.request.use(
	async function (config) {
		const state = store.getState();
		const token = state.userData.token;
		if (token) {
		  config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	}, function (error) {
		// Do something with request error
	return Promise.reject(error);
});
	 
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		const originalRequest = error.config;
		if (typeof error.response === 'undefined') {
			Alert.alert(
				'A server/network error occurred. ' +
				'Sorry about this - we will get it fixed shortly.'
			);
			return Promise.reject(error);
		}
		if ( error.response.status === 401 && originalRequest.url === baseURL + 'token/refresh/') {
			console.log("Refresh token not valid...");
			navigate('UserStack', {screen: 'Login'});
			return Promise.reject(error);
		}
		if (error.response.data.code === 'token_not_valid' && error.response.status === 401) {
			console.log("Getting new token...");
			const state = store.getState();
			const token = state.userData.token;
			const refreshToken = state.userData.refreshToken;
			if (refreshToken) {
				const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
				// exp date in token is expressed in seconds, while now() returns milliseconds:
				const now = Math.ceil(Date.now() / 1000);
				if (tokenParts.exp > now) {
					return axiosInstance
						.post('/token/refresh/', { refresh: refreshToken })
						.then((response) => {
							if (response.data.access) {
								store.dispatch(setTokens(response.data.access, response.data.refresh))
								axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + response.data.access;
							};
							if (response.data.refresh) {
								store.dispatch(setTokens(response.data.access, response.data.refresh))
								originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access;
							};
							return axiosInstance(originalRequest);
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
					console.log('Refresh token is expired', tokenParts.exp, now);
					store.dispatch(setTokens(null, null));
					navigate('UserStack', {screen: 'Login'});
				}
			} else {
				console.log('Refresh token not available.');
				store.dispatch(setTokens(null, null));
				navigate('UserStack', {screen: 'Login'});
			}
		}
		console.log("ELSE", error.response.data.code, error.response.status, error.response.statusText);
		// specific error handling done elsewhere
		return Promise.reject(error);
	}
);

export default axiosInstance;
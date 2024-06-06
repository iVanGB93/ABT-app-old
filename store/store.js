import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';

import userReducer from "./reducers/userReducer";
import clientsReducer from './reducers/clientsReducer';
import jobsReducer from './reducers/jobsReducer';
import itemsReducer from './reducers/itemsReducer';
import spentsReducer from './reducers/spentsReducer';


const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    whitelist: ['userData',],
};

const rootReducer = combineReducers({
    userData: userReducer,
    clients: clientsReducer,
    jobs: jobsReducer,
    items: itemsReducer,
    spents: spentsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    });

export const persistor = persistStore(store);

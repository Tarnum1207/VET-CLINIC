import {combineReducers, configureStore} from "@reduxjs/toolkit";

//libs
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

//slices
import reducerCommon from './slices/common';
import reducerPage from "./slices/page";

//api
import { apiWrapper } from "./apiWrapper";

//Конфигурируем персистор, указываем какие редьюсеры идут в локалсторадж а какие нет
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: [
        'common',
    ], // What you don't wanna to persist
    whitelist: [
        'regions',
        'readonly',
        'user',
    ], // What you want to persist
}

//Выделяем редьюсеры, чтоб сделать слияние с конфигурацией выше
const rootReducer = combineReducers({
    common: reducerCommon,
    page: reducerPage,
    [apiWrapper.reducerPath]: apiWrapper.reducer
});

//Редьюсер соединенный с локалсторадж, который содержит все редьюсеры
const persistedReducer = persistReducer(persistConfig, rootReducer);

//Прокидываем персист как обычный редьюсер
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            //Игнорируем ненужные экшены от персистора
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(
            apiWrapper.middleware
        )
});

//Экспортируем для компонента провайдера PersistGate
export const persistor = persistStore(store);

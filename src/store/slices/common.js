import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    language: 'ru',
    themeUI: 'light',
    currentFolder: [],
    isGrafanaViewed: false,
    isKibanaViewed: false,
    isResourcesExpanded: false,
    isDrsExpanded: false,
}

export const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        SET_LANGUAGE: (state) => {
            state.language = 'eng'
        },
        SET_THEME: (state) => {
            state.themeUI = 'dark'
        },
        SET_CURRENT_FOLDER: {
            //Если не нужен какой-то уникальный ответ в action.payload, то это нагромождение можно убрать
            // и написать так же как функции выше, получится более кратко
            reducer: (state, action) => {
                state.currentFolder = action.payload.currentFolder;
            },
            //Позволяет конфигурировать payload который придет в reducer, можно и без него,
            // тогда будет передавать ровно то что в него приходит в dispatch
            prepare: (value) => ({
                payload: {
                    currentFolder: value
                }
            })
        },
        SET_IS_GRAFANA_VIEWED: {
            reducer: (state, action) => {
                state.isGrafanaViewed = action.payload.isGrafanaViewed;
            },
            prepare: (value) => ({
                payload: {
                    isGrafanaViewed: value
                }
            })
        },
        SET_IS_KIBANA_VIEWED: {
            reducer: (state, action) => {
                state.isKibanaViewed = action.payload.isKibanaViewed;
            },
            prepare: (value) => ({
                payload: {
                    isKibanaViewed: value
                }
            })
        },
    }
});
export const {
    SET_LANGUAGE,
    SET_THEME,
    SET_CURRENT_FOLDER,
    SET_IS_GRAFANA_VIEWED,
    SET_IS_KIBANA_VIEWED,
} = commonSlice.actions;
export default commonSlice.reducer;
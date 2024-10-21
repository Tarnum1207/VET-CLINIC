import { createSlice } from "@reduxjs/toolkit"

export const initialState = {
    currentPage: " ",
}

export const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        /**
         * Устанавливает current page
         * @param state
         * @param action{Object}
         * @param action.payload{string}
         * @constructor
         */
        SET_CURRENT_PAGE: (state, action) => {
            state.currentPage = action.payload
        }
    },
})
export const {
    SET_CURRENT_PAGE,
} = pageSlice.actions
export default pageSlice.reducer
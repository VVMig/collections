import { SET_SEARCH } from "./types";

const initialState = {
    items: JSON.parse(sessionStorage.getItem('search-items')) || {}, 
    searchText: sessionStorage.getItem('search-text') || ''
}

export const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SEARCH:
            return {
                ...state, items: action.payload.items, searchText: action.payload.searchText
            }
        default:
            return state
    }
}
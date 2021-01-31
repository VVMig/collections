import { GET_COLLECTION, SORT_COLLECTION, CHANGE_ASCENDING, START_LOADING_COLLECTION, END_LOADING_COLLECTION } from "./types";

const initialState = {
    collection: {},
    sortOptions: {
        key: 'Date',
        ascending: true
    },
    loadingCollection: false
}

export const collectionReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_COLLECTION:
            return {
                ...state, collection: action.payload
            }
        case SORT_COLLECTION:
            return {
                ...state, sortOptions: {
                    ...state.sortOptions,
                    key: action.payload
                }
            }
        case CHANGE_ASCENDING:
            return {
                ...state, sortOptions: {
                    ...state.sortOptions,
                    ascending: !state.sortOptions.ascending
                }
            }
        case START_LOADING_COLLECTION: 
            return {
                ...state, loadingCollection: true
            }
        case END_LOADING_COLLECTION:
            return {
                ...state, loadingCollection: false
            }
        default:
            return state
    }
}
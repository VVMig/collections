import { GET_COLLECTION, SORT_COLLECTION, CHANGE_ASCENDING } from "./types";

const initialState = {
    collection: {},
    sortOptions: {
        key: 'Date',
        ascending: true
    }
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
        default:
            return state
    }
}
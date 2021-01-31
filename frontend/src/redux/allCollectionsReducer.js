import { GET_ALLCOLLECTIONS, START_LOADING_COLLECTIONS, END_LOADING_COLLECTIONS } from "./types";

const initialState = {
    collections: {},
    loading: false
}

export const allCollectionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALLCOLLECTIONS:
            return {
                ...state, collections: action.payload
            }
        case START_LOADING_COLLECTIONS:
            return {
                ...state, loading: true
            }
        case END_LOADING_COLLECTIONS:
            return {
                ...state, loading: false
            }    
        default:
            return state
    }
}
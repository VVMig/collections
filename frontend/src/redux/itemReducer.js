import { GET_ITEM, SET_ITEM } from "./types";

const initialState = {
    item: {}
}

export const itemReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ITEM:
            return {
                ...state, item: action.payload
            }
        case GET_ITEM:
            return {
                ...state, item: action.payload
            }    
        default:
            return state
    }
}
import { GET_HOME } from "./types";

const initialState = {
    tags: [],
    lastAdded: [],
    mostLike: []
}

export const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_HOME: 
            return {...state, 
                tags: action.payload.tags, 
                lastAdded: action.payload.lastAdded,
                mostLike: action.payload.mostLike 
            }
        default:
            return state
    }
}
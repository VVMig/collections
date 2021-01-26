import { GET_USER, IS_LOGIN, RESET_USER, SET_USER, DELETE_USER, SET_ADMIN, REMOVE_ADMIN, BLOCK_USER, UNBLOCK_USER } from "./types";

const initialState = {
    userData: {
        token: undefined,
        user: undefined
    }
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER:
            return { 
                token: action.payload.token,
                user: action.payload.user
            }
        case SET_USER:
            return { 
                token: action.payload.token,
                user: action.payload.user
            }
        case RESET_USER:
            return { 
                token: action.payload.token,
                user: action.payload.user
            }   
        case DELETE_USER:
            return state
        case SET_ADMIN:
            return state
        case REMOVE_ADMIN:
            return state
        case BLOCK_USER:
            return state
        case UNBLOCK_USER:
            return state
        case IS_LOGIN:
            return state
        default:
            return state
    }
}
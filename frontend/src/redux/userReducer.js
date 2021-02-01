import { GET_USER, IS_LOGIN, RESET_USER, SET_USER, DELETE_USER, SET_ADMIN, REMOVE_ADMIN, 
    BLOCK_USER, UNBLOCK_USER, SWITCH_LANG, TOGGLE_MODE } from "./types";

const initialState = {
    userData: {
        token: undefined,
        user: {
            lang: localStorage.getItem('lang') || 'en',
            darkMode: false
        }
    }
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER:
            return {...state, userData: {
                ...state.userData, 
                token: action.payload.token,
                user: action.payload.user
                }
            }
        case SET_USER:
            return {...state, userData: {
                ...state.userData,
                token: action.payload.token,
                user: action.payload.user
                }
            }
        case RESET_USER:
            return {...state, userData: {
                ...state.userData,
                token: action.payload.token,
                user: action.payload.user
                }
            }
        case SWITCH_LANG:
            return {...state, userData: {
                ...state.userData,
                user: {
                    ...state.userData.user,
                    lang: action.payload
                }
                }
            }
        case TOGGLE_MODE:
            return {...state, userData: {
                ...state.userData,
                user: {
                    ...state.userData.user,
                    darkMode: action.payload
                }
                }
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
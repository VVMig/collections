import { SET_ERROR, CLEAR_ERROR, START_LOADING_PAGE, END_LOADING_PAGE, ERROR_CLEARALL, SET_NOTIFY } from "./types"

const initialState = {
    error: '',
    notify: false,
    loading: false
}

export const errorReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ERROR:
            return {...state, error: action.payload}
        case CLEAR_ERROR:
            return  {...state, error: ''} 
        case START_LOADING_PAGE:
            return {...state, loading: true}
        case END_LOADING_PAGE:
            return {...state, loading: false}
        case ERROR_CLEARALL:
            return {...state, ...action.payload}
        case SET_NOTIFY:
            return {...state, notify: action.payload}          
        default:
            return state    
    }
}
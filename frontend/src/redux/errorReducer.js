import { SET_ERROR, CLEAR_ERROR } from "./types"

const initialState = {
    error: {
        message: null
    }
}

export const errorReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ERROR:
            return {
                error:{
                    message: action.payload 
                }
            }
        case CLEAR_ERROR:
            return  {
                error:{
                    message: action.payload 
                }
            }        
        default:
            return state    
    }
}
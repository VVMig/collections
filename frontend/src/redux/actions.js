import Axios from 'axios'

import { GET_USER, SET_USER, RESET_USER, SET_ERROR, DELETE_USER, 
    SET_ADMIN, REMOVE_ADMIN, BLOCK_USER, UNBLOCK_USER, 
    CLEAR_ERROR, SET_ITEM, GET_COLLECTION, GET_ITEM, SORT_COLLECTION, GET_HOME, SET_SEARCH } from "./types";

export function setSearch(searchText) {
    return async dispatch => {
        try {
            const response = await Axios.get('/item/search', {
                params: {
                    searchText
                }
            })

            localStorage.setItem('search-items', JSON.stringify(response.data))
            localStorage.setItem('search-text', searchText)

            dispatch({
                type: SET_SEARCH,
                payload: {
                    items: response.data,
                    searchText
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}

export function getHome() {
    return async dispatch => {
        try {
            const response = await Axios.get('/user/home')

            dispatch({
                type: GET_HOME,
                payload: response.data
            })
        } catch (error) {
            console.log(error)
        }
    }
}

export function sortCollection(key) {
    return {
        type: SORT_COLLECTION,
        payload: key
    }
}

export function getCollection(id) {
    return async dispatch => {
        try {
            const response = await Axios.get('/collections/collection', {
                params: {
                    id
                }
            })

            dispatch({
                type: GET_COLLECTION,
                payload: response.data
            })
        } catch (error) {
            
        }
    }
}

export function setUser(user) {
    return dispatch => {
        dispatch({
            type: SET_USER,
            payload: user
        })
    }
}

export function setItem(item) {
    return {
        type: SET_ITEM,
        payload: item
    }
}

export function getItem(id) {
    return async dispatch => {
        try {
            const response = await Axios.get('/item/', {
                params: {
                    id
                }
            })

            dispatch({
                type: GET_ITEM,
                payload: response.data
            })
        } catch (error) {
            
        }
    }
}

export function blockUser(token, users) {
    return dispatch => {
        users.forEach(async (id) => {            
            try {
                await Axios.post(`/user/block`, {id}, {
                    headers: {
                        'x-auth-token': token
                    }
                })
            } catch (error) {
                dispatch(setError(error.response && error.response.data ? (error.response.data.message || error.response.data) : ''))
                dispatch({
                    type: BLOCK_USER
                })
            } 
        }) 

        dispatch({
            type: BLOCK_USER
        })
    }
}

export function deleteUser(token, users) {
    return async dispatch => {
        users.forEach(async (id) => {
            try {
                await Axios.delete(`/user/delete`, {
                    params: {
                        id
                    },
                    headers: {
                        'x-auth-token': token        
                        }
                    }
                )
                
            } catch (error) {
                dispatch(setError(error.response && error.response.data ? (error.response.data.message || error.response.data) : ''))
                dispatch({
                    type: DELETE_USER
                })
            }
        })
        
        dispatch({
            type: DELETE_USER
        })
    }
}

export function setAdmin(token, users) {
    return dispatch => {
        users.forEach(async (id) => {            
            try {
                await Axios.post(`/user/setAdmin`, {id}, {
                    headers: {
                        'x-auth-token': token
                    }
                })
            } catch (error) {
                dispatch(setError(error.response && error.response.data ? (error.response.data.message || error.response.data) : ''))
                dispatch({
                    type: SET_ADMIN
                })
            } 
        }) 

        dispatch({
            type: SET_ADMIN
        })
    }
}

export function unblockUser(token, users) {
    return dispatch => {
        users.forEach(async (id) => {            
            try {
                await Axios.post(`/user/unblock`, {id}, {
                    headers: {
                        'x-auth-token': token
                    }
                })
            } catch (error) {
                dispatch(setError(error.response && error.response.data ? (error.response.data.message || error.response.data) : ''))
                dispatch({
                    type: UNBLOCK_USER
                })
            } 
        }) 

        dispatch({
            type: UNBLOCK_USER
        })
    }
}

export function setError(error) {
    if(!error) {
        error = 'Connection error. Please try again later:('
    }

    return dispatch => {
        dispatch({
            type: SET_ERROR,
            payload: error
        })
    }
}

export function clearError() {
    return dispatch => {
        dispatch({
            type: CLEAR_ERROR,
            payload: ''
        })
    }
}

export function removeAdmin(token, users, err) {
    return dispatch => {
        users.forEach(async (id) => {            
            try {
                await Axios.post(`/user/removeAdmin`, {id}, {
                    headers: {
                        'x-auth-token': token
                    }
                })
            } catch (error) {
                dispatch(setError(error.response && error.response.data ? (error.response.data.message || error.response.data) : ''))
                dispatch({
                    type: REMOVE_ADMIN
                })
            } 
        }) 

        dispatch({
            type: REMOVE_ADMIN,
        })
    }
}

export function isLogin() {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
}

export function resetUser() {
    return dispatch => {
        dispatch({
            type: RESET_USER,
            payload: {
                token: undefined,
                user: undefined
            }
        })
    }
}

export function getUser() {
    return async dispatch => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')

        if(!token){
            resetUser()
            return;
        }

        try {
            const tokenRes = await Axios.post(
            "user/verifyToken",
            null,
            { headers: { "x-auth-token": token } }
            )

            if (tokenRes.data) {
            const userRes = await Axios.get("user/", {
                headers: { "x-auth-token": token },
            });
            
            dispatch({ 
                type: GET_USER,
                payload: {
                    token,
                    user: userRes.data
                }
            })
            }
        } catch (error) {
            dispatch(setError(error.response && error.response.data ? (error.response.data.message || error.response.data) : ''))
        }
    }
}
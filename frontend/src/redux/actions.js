import Axios from 'axios'
import { API_URL } from '../config'

import { GET_USER, SET_USER, RESET_USER, SET_ERROR, DELETE_USER, 
    SET_ADMIN, REMOVE_ADMIN, BLOCK_USER, UNBLOCK_USER, 
    CLEAR_ERROR, SET_ITEM, GET_COLLECTION, GET_ITEM, SORT_COLLECTION, 
    GET_HOME, SET_SEARCH, SWITCH_LANG, GET_ALLCOLLECTIONS, START_LOADING_PAGE, 
    END_LOADING_PAGE, ERROR_CLEARALL, SET_NOTIFY, START_LOADING_COLLECTIONS, END_LOADING_COLLECTIONS, TOGGLE_MODE } from "./types";


export function toggleMode(mode) {
    return async (dispatch, getState) => {
        try {
            if(!getState().userData.userData.token) {
                dispatch({
                    type: TOGGLE_MODE,
                    payload: mode
                })
                return
            }

            await Axios.post(`${API_URL}/api/user/darkMode`, {
                mode
            }, {
                headers: {
                    'x-auth-token': getState().userData.userData.token
                }
            })
    
            dispatch({
                type: TOGGLE_MODE,
                payload: mode
            })
        } catch (error) {
            dispatch(setError(error))
        }

    }
}

export function clearErrorAll() {
    return {
        type: ERROR_CLEARALL,
        payload: {
            error: '',
            notify: false,
            loading: false
        }
    }        
}

export function setNotify(state) {
    return {
        type: SET_NOTIFY,
        payload: state
    }
}

export function getAllCollections(id) {
    return async dispatch => {
        try {
            dispatch({type: START_LOADING_COLLECTIONS})
            const response = await Axios.get(`${API_URL}/api/collections/`, {
                params: {
                    id
                }
            })
            dispatch({
                type: GET_ALLCOLLECTIONS,
                payload: response.data
            })
        } catch (error) {
            dispatch(setError(error))
        }
        finally {
            dispatch({type: END_LOADING_COLLECTIONS})
        }
    }
}

export function switchLang(lang) {
    return async (dispatch, getState) => {
        const token = getState().userData.userData.token

        if(!token) {
            dispatch({
                type: SWITCH_LANG,
                payload: lang
            })

            localStorage.setItem('lang', lang)
        }

        try {
            const response = await Axios.post(`${API_URL}/api/user/switchLang`, {
                lang
            }, {
                headers: {
                    'x-auth-token': token
                }
            })
    
            dispatch({
                type: SWITCH_LANG,
                payload: response.data
            })
        } catch (error) {
            
        }

    }
}

export function setSearch(searchText) {
    return async dispatch => {
        try {
            dispatch(startLoadingPage())

            const response = await Axios.get(`${API_URL}/api/item/search`, {
                params: {
                    searchText
                }
            })

            sessionStorage.setItem('search-items', JSON.stringify(response.data))
            sessionStorage.setItem('search-text', searchText)

            dispatch({
                type: SET_SEARCH,
                payload: {
                    items: response.data,
                    searchText
                }
            })
        } catch (error) {
            dispatch(setError(error))
        }
        finally {
            dispatch(endLoadingPage())
        }
    }
}

export function getHome(firstLoad) {
    return async (dispatch, getState) => {
        if(firstLoad)
            dispatch(startLoadingPage())
        try {
            if(getState().error.error) {
                return
            }

            const response = await Axios.get(`${API_URL}/api/user/home`)

            dispatch({
                type: GET_HOME,
                payload: response.data
            })
        } catch (error) {
            dispatch(setError(error))
        }
        finally {
            if(firstLoad)
                dispatch(endLoadingPage())
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
    return async (dispatch, getState) => {
        try {
            if(getState().error.error) {
                return
            }

            if(!getState().collection.collection.collection) {
                dispatch(startLoadingPage()) 
            } else if(getState().collection.collection.collection._id !== id) {
                dispatch(startLoadingPage()) 
            }           

            const response = await Axios.get(`${API_URL}/api/collections/collection`, {
                params: {
                    id
                }
            })

            dispatch({
                type: GET_COLLECTION,
                payload: response.data
            })            
        } catch (error) {
            dispatch(setError(error))
        }
        finally {
            dispatch(endLoadingPage())
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
            const response = await Axios.get(`${API_URL}/api/item/`, {
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
                await Axios.post(`${API_URL}/api/user/block`, {id}, {
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
                await Axios.delete(`${API_URL}/api/user/delete`, {
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
                await Axios.post(`${API_URL}/api/user/setAdmin`, {id}, {
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
                await Axios.post(`${API_URL}/api/user/unblock`, {id}, {
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
    let text = ''

    if(error.response) {
        text = error.response.data.message || error.response.data.error.message
    }
    else text = 'Connection error. Please try again later:('

    return {
        type: SET_ERROR,
        payload: text
    }
}

export function clearError() {
    return {
            type: CLEAR_ERROR,
            payload: ''
        }
}

export function startLoadingPage() {
    return {
        type: START_LOADING_PAGE
    }
}

export function endLoadingPage() {
    return {
        type: END_LOADING_PAGE
    }
}

export function removeAdmin(token, users, err) {
    return dispatch => {
        users.forEach(async (id) => {            
            try {
                await Axios.post(`${API_URL}/api/user/removeAdmin`, {id}, {
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
                user: {
                    lang: 'en'
                }
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
            `${API_URL}/api/user/verifyToken`,
            null,
            { headers: { "x-auth-token": token } }
            )

            if (tokenRes.data) {
            const userRes = await Axios.get(`${API_URL}/api/user/`, {
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
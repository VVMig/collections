import { combineReducers } from 'redux'

import { userReducer } from './userReducer'
import { errorReducer } from './errorReducer'
import { itemReducer } from './itemReducer'
import { collectionReducer } from './collectionReducer'
import { homeReducer } from './homeReducer'
import { searchReducer } from './searchReducer'
import { allCollectionsReducer } from './allCollectionsReducer'

export const rootReducer = combineReducers({
    userData: userReducer,
    error: errorReducer,
    item: itemReducer,
    collection: collectionReducer,
    home: homeReducer,
    search: searchReducer,
    allCollections: allCollectionsReducer
})
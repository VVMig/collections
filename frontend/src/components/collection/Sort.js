import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Icon from 'react-bootstrap-icons'

import { sortCollection } from '../../redux/actions'
import { CHANGE_ASCENDING } from '../../redux/types'

import './CollectionsItems.css'

function Sort() {
    const { sortOptions, collection }  = useSelector(state => state.collection)
    const [selectedSort, setSelectedSort] = useState(sortOptions.key)

    const dispatch = useDispatch()  

    useEffect(() => {
        dispatch(sortCollection(selectedSort.toLowerCase()))
    }, [selectedSort, dispatch])

    return (
        <div className="d-flex align-items-center mb-3 col-6">
            <span>Sort</span>
            <select className="form-control ml-2" value={selectedSort} id="inputGroupSelect01" onChange={(e) => setSelectedSort(e.target.value)}>
                <option value="Title">Title</option>
                <option value="Likes">Likes</option>
                {collection.collection.author && <option value="Author">Author</option>}
                {collection.collection.year && <option value="Date">Date</option>}
                {collection.collection.comments && <option value="Comments">Comments</option>}
            </select>
            <span 
            className="ml-2" 
            onClick={() => dispatch({type: CHANGE_ASCENDING})}
            style={{cursor: 'pointer'}}
            >
                {sortOptions.ascending ? <Icon.SortUp size={20}/> : <Icon.SortDown size={20}/>}
            </span>
        </div>
    )
}

export default Sort
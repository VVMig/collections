import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Icon from 'react-bootstrap-icons'

import { sortCollection } from '../../redux/actions'
import { CHANGE_ASCENDING } from '../../redux/types'

import lang from '../../lang.json'

function Sort() {
    const { sortOptions, collection }  = useSelector(state => state.collection)
    const [selectedSort, setSelectedSort] = useState(sortOptions.key)
    const { userData } = useSelector(state => state.userData)
    const dispatch = useDispatch()  

    useEffect(() => {
        dispatch(sortCollection(selectedSort.toLowerCase()))
    }, [selectedSort, dispatch])

    return (
        <div className="d-flex align-items-center mb-3 w-100 px-2 p-sm-0">
            <span>{lang.Sort.sort[userData.user.lang]}</span>
            <select className="form-control ml-2" value={selectedSort} id="inputGroupSelect01" onChange={(e) => setSelectedSort(e.target.value)}>
                <option value="Title">{lang.Sort.title[userData.user.lang]}</option>
                <option value="Likes">{lang.Sort.likes[userData.user.lang]}</option>
                {collection.collection.author && <option value="Author">{lang.Sort.author[userData.user.lang]}</option>}
                {collection.collection.year && <option value="Date">{lang.Sort.date[userData.user.lang]}</option>}
                {collection.collection.comments && <option value="Comments">{lang.Sort.comments[userData.user.lang]}</option>}
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
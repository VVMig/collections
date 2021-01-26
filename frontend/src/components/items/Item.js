import React, { useRef } from 'react'
import $ from 'jquery'
import {  useDispatch } from 'react-redux'

import Like from './ItemLike'
import Picture from './ItemPicture'

import { getItem } from '../../redux/actions'
import { useHistory } from 'react-router-dom'

function Item(props) {
    const { author, year, title, _id, picture, collection_id } = props.itemProps
    const likes = props.itemProps.likes
    const { homeAction } = props

    const card = useRef()

    const history = useHistory()

    const dispatch = useDispatch()

    function hover() {
        $(card.current).toggleClass('border-primary')
    }

    function toCollection() {
        history.push(`/collections/collection?collection_id=${collection_id}`)
    }

    return (
        <>
            <div className="card border" ref={card}  onMouseEnter={hover} onMouseLeave={hover} style={{width: '12rem'}}>
                <Picture picture={picture} title={title} styles={{height: 100}} className="card-img-top"/>
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <ul className="list-group list-group-flush">
                        {author &&
                        <li className="list-group-item">Author: {author}</li>}
                        {year && 
                        <li className="list-group-item">Date: {new Date(year).toLocaleDateString()}</li>}
                    </ul>
                </div>
                <div className="d-flex card-footer">
                    <span 
                        data-toggle="modal" 
                        data-target="#item"
                        style={{cursor: 'pointer'}}
                        onClick={() => {
                            dispatch(getItem(_id))
                            if(typeof homeAction === 'function') {
                                toCollection()
                            }
                        }}
                    >
                        More
                    </span>
                    <Like likes={likes} id={_id} homeAction={homeAction}/>
                </div>
            </div>      
        </>
    )
}

export default Item
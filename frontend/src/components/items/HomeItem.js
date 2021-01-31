import React, { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import $ from 'jquery'
import {  useDispatch, useSelector } from 'react-redux'

import Like from './ItemLike'
import MainPicture from '../mainPicture/MainPicture'

import { getItem, setItem } from '../../redux/actions'
import { useHistory } from 'react-router-dom'

import lang from '../../lang.json'

function Item(props) {
    const { author, year, title, _id, picture, collection_id } = props.itemProps
    const likes = props.itemProps.likes
    const { homeAction } = props

    const location = useLocation()

    const { userData } = useSelector(state => state.userData)
    const { collection } = useSelector(state => state.collection.collection)

    const card = useRef()

    const history = useHistory()

    const dispatch = useDispatch()

    function hover() {
        $(card.current).toggleClass('border-primary')
    }

    function toCollection(e) {
        dispatch(getItem(_id))

        history.push(`/collection?collection_id=${collection_id}`)
    }

    return (
        <>
            <div className="row w-100 justify-content-center">
                <div className="d-flex row col-8 bg-light border rounded">
                    <div className="d-flex flex-column col-md-6 justify-content-between p-2 order-md-1 order-2">
                        <div className="d-flex flex-column text-center">
                            <h4>{title}</h4>
                            <div className="text-left mt-3">
                                <ul className="list-group">
                                    {author && <li className="list-group-item">Author: {author}</li>}
                                    {year && <li className="list-group-item">Date: {new Date(year).toLocaleDateString()}</li>}
                                </ul>
                            </div>   
                        </div>
                        <div className="d-flex justify-content-between mt-1">
                            <button className="btn btn-primary" onClick={toCollection}>View item</button>
                            <Like likes={likes} id={_id}/>
                        </div>
                    </div>
                    <div className="col-md-6 p-2 p-md-0 order-1 order-md-2">
                        <MainPicture picture={picture}/>
                    </div>
                </div>
            </div>     
        </>
    )
}

export default Item
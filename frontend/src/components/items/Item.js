import React, { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import $ from 'jquery'
import {  useDispatch, useSelector } from 'react-redux'

import Like from './ItemLike'
import MainPicture from '../mainPicture/MainPicture'

import { getItem, setItem } from '../../redux/actions'
import { useHistory } from 'react-router-dom'

import './Item.scss'

import lang from '../../lang.json'

function Item(props) {
    const { author, year, title, _id, picture, collection_id } = props.itemProps
    const likes = props.itemProps.likes
    const { homeAction } = props

    const location = useLocation()

    const { userData } = useSelector(state => state.userData)
    const { collection } = useSelector(state => state.collection.collection)

    const history = useHistory()

    const dispatch = useDispatch()

    function toCollection(e) {
        dispatch(getItem(_id))

        if(location.pathname === '/collection') {
            return 
        }

        history.push(`/collection?collection_id=${collection_id}`)
    }

    return (
        <>
            <div className="card border item" 
            style={{width: '12rem'}}
            >
                <MainPicture picture={picture} title={title} styles={{height: 100}} className="card-img-top"/>
                <div className="card-body" onClick={(e) => toCollection(e)} data-toggle="modal" data-target="#item" style={{cursor: 'pointer'}}>
                    <h5 className="card-title">{title}</h5>
                    <ul className="list-group list-group-flush">
                        {author &&
                        <li className="list-group-item">{lang.Item.author[userData.user.lang]}: {author}</li>}
                        {year && 
                        <li className="list-group-item">{lang.Item.date[userData.user.lang]}: {new Date(year).toLocaleDateString()}</li>}
                    </ul>
                </div>
                <div className="d-flex card-footer">
                    {location.pathname === '/collection' 
                    && (userData.user.userRole === 'admin' || collection.owner === userData.user.id) &&
                    <span 
                        style={{cursor: 'pointer'}}
                        data-toggle="modal"
                        data-target="#editItem"
                        onClick={(e) => {
                            dispatch(setItem({...props.itemProps}))                           
                        }}
                    >
                        {lang.Item.edit[userData.user.lang]}
                    </span>
                    }
                    <Like likes={likes} id={_id} homeAction={homeAction}/>
                </div>
            </div>      
        </>
    )
}

export default Item
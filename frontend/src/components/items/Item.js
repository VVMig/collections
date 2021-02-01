import React from 'react'
import { useLocation } from 'react-router-dom'
import {  useDispatch, useSelector } from 'react-redux'
import Axios from 'axios'
import Like from './ItemLike'
import MainPicture from '../mainPicture/MainPicture'

import { clearErrorAll, getCollection, setError, setItem, setNotify } from '../../redux/actions'
import { useHistory } from 'react-router-dom'
import * as Icon from 'react-bootstrap-icons'

import { API_URL } from '../../config'

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
        history.push(`/collection?collection_id=${collection_id}&item_id=${_id}`)
    }

    async function deleteItem() {
        try {
            dispatch(clearErrorAll())
            dispatch(setNotify(true))
            await Axios.delete(`${API_URL}/api/item/delete`, {
                params: {
                    id: _id,
                    collection_id
                },
                headers: {
                    'x-auth-token': userData.token
                }
            })

            dispatch(getCollection(collection_id))
        } catch (error) {
            dispatch(setError(error))
        }
        finally {
        }
    }

    return (
        <>
            <div className="card border item" 
            style={{width: '12rem'}}
            >
                <MainPicture picture={picture} title={title} styles={{height: 100}} className="card-img-top"/>
                <div className="card-body" onClick={(e) => toCollection(e)} style={{cursor: 'pointer'}}>
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
                    <>
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
                        <span className="ml-1" style={{cursor: 'pointer'}} onClick={deleteItem}>
                            <Icon.TrashFill className="text-danger"/>
                        </span>
                    </>
                    }
                    <Like likes={likes} id={_id} homeAction={homeAction}/>
                </div>
            </div>      
        </>
    )
}

export default Item
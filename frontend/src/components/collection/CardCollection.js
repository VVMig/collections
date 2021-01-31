import React from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios'
import * as Icon from 'react-bootstrap-icons'
import { useSelector, useDispatch } from 'react-redux'
import ReactMarkdown from 'react-markdown'

import MainPicture from '../mainPicture/MainPicture'
import { API_URL } from '../../config'

import lang from '../../lang.json'
import { clearErrorAll, endLoadingPage, getAllCollections, getCollection, setError, setNotify, startLoadingPage } from '../../redux/actions'

function CollectionsItems(props) {
    const { title, topic, description, picture, _id, owner } = props 
    const { userData } = useSelector(state => state.userData)
    const dispatch = useDispatch()

    function editCollection() {
        dispatch(getCollection(_id))
    }

    async function deleteCollection() {
        try {
            dispatch(clearErrorAll())
            dispatch(startLoadingPage())
            dispatch(setNotify(true))
            await Axios.delete(`${API_URL}/api/collections/delete`, {
                params: {
                    id: _id
                },
                headers: {
                    'x-auth-token': userData.token
                }
            })

            dispatch(getAllCollections(owner))
        } catch (error) {
            dispatch(setError(error))
        }
        finally {
            dispatch(endLoadingPage())
        }
    }

    return (
        <>
            <div className="card">
                <MainPicture picture={picture} />
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{topic}</h6>
                    <ReactMarkdown source={description}/>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                    <Link to={`/collection?collection_id=${_id}`} className="btn btn-primary">{lang.CollectionCard.explore[userData.user.lang]}</Link>
                    {(userData.user && (userData.user.id === owner || userData.user.userRole === 'admin')) &&
                    <div className="dropdown dropup">
                        <span id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{cursor: 'pointer'}}>
                            <Icon.ThreeDotsVertical/>
                        </span>
                        <div className="dropdown-menu dropdown-menu-left" aria-labelledby="dropdownMenuButton">
                            <button className="dropdown-item" type="button" onClick={deleteCollection}><Icon.TrashFill className="text-danger"/> Delete</button>
                            <button className="dropdown-item" type="button" data-toggle="modal" data-target="#editCollection" onClick={editCollection}><Icon.PencilFill/> Edit</button>
                        </div>
                    </div> 
                    }
                </div>
            </div>
        </>
    )
}

export default CollectionsItems
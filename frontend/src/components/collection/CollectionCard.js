import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Axios from 'axios'
import * as Icon from 'react-bootstrap-icons'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'

import Spinner from '../spinner/Spinner'

import './CollectionsItems.css'

function CollectionsItems(props) {
    const { title, topic, description, picture, _id, owner } = props 

    const location = useLocation()
    const userData = useSelector(state => state.userData)

    const [errorMessage, setErrorMessage] = useState('')

    async function deleteCollection() {
        try {
            Axios.delete('/collections/delete', {
                params: {
                    id: _id
                },
                headers: {
                    'x-auth-token': userData.token
                }
            })
        } catch (error) {
            setErrorMessage('')
            setErrorMessage(error.response ? error.response.data.message : 'Connection error. Please try again later:(')
        }

    }

    return (
        <>
            {(errorMessage) && <Spinner errorLoading={true} errorMessage={errorMessage}/>}
            <div className="card" style={{width: '18rem'}}>
                <div className="card-img-top" style={{backgroundImage: `url(${picture})`}} alt={title}/>
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{topic}</h6>
                    <ReactMarkdown source={description}/>
                </div>
                <div className="card-footer">
                    <Link to={`${location.pathname}/collection?collection_id=${_id}`} className="btn btn-primary">Explore</Link>
                    {(userData.user && (userData.user.id === owner || userData.user.userRole === 'admin')) && <Icon.TrashFill className="text-danger ml-2 delete-collection" onClick={deleteCollection}/>}
                </div>
            </div>
        </>
    )
}

export default CollectionsItems
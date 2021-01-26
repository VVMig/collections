import React, {  } from 'react'
import { Link } from 'react-router-dom'
import * as Icon from 'react-bootstrap-icons'
import Axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'

import UserPicture from '../userPicture/UserPicture'

import './Comment.css'
import { getItem } from '../../redux/actions'

function Comment(props) {
    const { userPhoto, userId, date, comment, modal, userName, owner, _id } = props 

    const userData = useSelector(state => state.userData)
    const { item } = useSelector(state => state.item)

    const dispatch = useDispatch()

    async function removeComment() {
        try {
            await Axios.post('/item/removeComment', {
                commentId: _id,
                itemId: item._id
            }, {
                headers: {
                    'x-auth-token': userData.token
                }
            })
            
            dispatch(getItem(item._id))
        } catch (error) {
            
        }
    }

    return (
            <div className="d-flex comment flex-column w-100">
                <div className="d-flex align-items-center comment-header justify-content-between p-1 border border-primary">
                    <div className="d-flex align-items-center"> 
                        <Link 
                        onClick={() => modal.current.click()}
                        to={`/profile?id=${userId}`}
                        style={{textDecoration: 'none'}}
                        >
                        <UserPicture picture={userPhoto} name={userName}/>    
                        </Link>
                        <span className="pl-1">{userName}</span>
                    </div>
                    <div>
                        {new Date(date).toLocaleDateString()}
                        {(userData.user && (userId=== owner || userData.user.userRole === 'admin')) && <span className="ml-1" style={{cursor: 'pointer'}} onClick={removeComment}><Icon.X/></span>}
                    </div>
                </div>  
                <div className="border p-2">
                    <ReactMarkdown source={comment}/>
                </div> 
            </div> 
    )
}

export default Comment
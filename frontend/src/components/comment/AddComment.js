import React, { useState, useRef } from 'react'
import Axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import * as Icon from 'react-bootstrap-icons'

import UserPicture from '../userPicture/UserPicture'

import { getItem } from '../../redux/actions'

import './AddComment.css'

function AddComment(props) {
    const userData = useSelector(state => state.userData)
    const { item } = useSelector(state => state.item)
    const { collection } = useSelector(state => state.collection.collection)

    const commentBtn = useRef()

    const dispatch = useDispatch()

    const [comment, setComment] = useState('')

    function confirmKey(e) {
        if(e.code === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            addComment()
        }
    }

    async function addComment() {
        if(!comment.trim()) {
            return
        }

        setComment('')

        try {
            await Axios.post('/item/comment', {
                comment,
                itemId: item._id,
                collectionId: collection._id
            }, {
                headers: {
                    'x-auth-token': userData.token
                }
            })

            dispatch(getItem(item._id))
            commentBtn.current.blur()
        } catch (error) {
            
        }
    }

    return (
        <>
            {userData.user && 
            <div className="d-flex comment flex-column w-100">
                <div className="d-flex align-items-center p-1 border border-primary">
                    <UserPicture picture={userData.user.userPhoto} name={userData.user.displayName}/>
                    <span className="pl-1">{userData.user.displayName}</span>
                </div>  
                <div className="d-flex border p-2">
                    <textarea placeholder="Leave a comment..." value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    maxLength="200" 
                    className="form-control mr-1"
                    onKeyPress={confirmKey}></textarea>
                    <button className="btn btn-outline-primary btn-comment" disabled={!comment.length} ref={commentBtn} onClick={addComment}>
                        <Icon.ArrowRightCircle/>
                    </button>
                </div> 
            </div> 
            }
        </>
    )
}

export default AddComment
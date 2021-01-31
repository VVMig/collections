import React, { useState, useEffect } from 'react'
import * as Icon from 'react-bootstrap-icons'
import {  useDispatch, useSelector } from 'react-redux'
import Axios from 'axios'
import { getCollection, getItem } from '../../redux/actions'
import { API_URL } from '../../config'

function ItemLike({ likes, id, homeAction }) {
    const { collection } = useSelector(state => state.collection.collection)

    const { userData } = useSelector(state => state.userData)

    const [liked, setLiked] = useState(false)
    const [likesNumber, setLikesNumber] = useState(0)

    const dispatch = useDispatch()

    useEffect(() => {
        setLiked((userData.user && likes.usersId.findIndex(e => e === `${userData.user.id}`)) >= 0)
        setLikesNumber(likes.number)
    }, [likes, userData])

    async function toggleLike() {
        try {
            await Axios.post(`${API_URL}/api/item/like`, {
                itemId: id
            }, {
                headers: {
                    'x-auth-token': userData.token
                }
            })

            if(typeof homeAction === 'function') {
                homeAction()
            }  
            else {
                dispatch(getCollection(collection._id))
                dispatch(getItem(id))
            }
     
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <span onClick={toggleLike} style={{cursor: 'pointer'}} className="ml-auto">
                {liked ? 
                <Icon.HeartFill className="item-liked"/>
                : <Icon.Heart className="item-unliked"/>} {likesNumber}
            </span>
        </>
    )
}

export default ItemLike
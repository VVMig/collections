import React, { useRef, useEffect } from 'react'
import Tags from '@yaireo/tagify/dist/react.tagify'
import { useSelector, connect, useDispatch } from 'react-redux'

import '@yaireo/tagify/dist/tagify.css'

import './ModalItem.css'

import Comment from '../comment/Comment'
import AddComment from '../comment/AddComment'
import Like from './ItemLike'

import { getItem } from '../../redux/actions'

function ModalItem(props) {
    const { item } = useSelector(state => state.item)
    const userData = useSelector(state => state.userData) 
    const { collection } = useSelector(state => state.collection.collection)

    const closeModal = useRef()

    const dispatch = useDispatch()

    useEffect(() => {
        const interval = setInterval(async () => {
            if(!item._id) {
                return
            }
            dispatch(getItem(item._id))
        }, 3000)

        return () => clearInterval(interval)
    })

    return (
        <div className="modal fade" ref={closeModal} tabIndex="-1" id="item" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{item.title}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {item.picture &&
                        <img src={item.picture} className="img-fluid rounded" alt={item.title}/>}
                        <ul className="list-group mt-1">
                            {item.author && <li className="list-group-item">Author: {item.author}</li>}
                            {item.year && <li className="list-group-item">Date: {new Date(item.year).toLocaleDateString()}</li>}
                        </ul>
                        {item.tags && item.tags.length > 0 && <Tags value={item.tags} readOnly className="mt-1"/>}
                        {item.likes &&
                        <div className="d-flex justify-content-end">
                             <Like likes={item.likes} id={item._id}/>
                        </div>}
                    </div>
                    <div className="d-flex modal-footer justify-content-start">
                        {collection.comments &&
                        <>
                            <AddComment />
                            {item.comments ? item.comments.map((e,i) => <Comment key={i} {...e} modal={closeModal} owner={userData.user && userData.user.id}/>) :
                            <p>Loading...</p>}
                        </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => state.item;

export default connect(mapStateToProps, null)(ModalItem)
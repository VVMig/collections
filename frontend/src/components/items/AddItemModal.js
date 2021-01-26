import React, { useState, useRef, useEffect, useCallback } from 'react'
import Tags from '@yaireo/tagify/dist/react.tagify'
import '@yaireo/tagify/dist/tagify.css'
import Axios from 'axios'

import { useSelector, useDispatch } from 'react-redux'

import { getCollection } from '../../redux/actions'

import FileInput from '../fileInput/FileInput'

import './AddItem.css'

const baseTagifySettings = {
    blacklist: ["xxx", "yyy", "zzz"],
    maxTags: 5,
    placeholder: "type something",
    dropdown: {
      enabled: 0
    }
  }

function AddItemModal(props) {
    const {author, year, comments, id} = props

    const closeModal = useRef()
    const tagifyRef = useRef()

    const dispatch = useDispatch()

    const userData = useSelector(state => state.userData)

    const [title, setTitle] = useState('')
    const [itemAuthor, setItemAuthor] = useState('')
    const [itemDate, setItemDate] = useState('')
    const [tagifySettings] = useState([])
    const [tagifyProps, setTagifyProps] = useState({})
    const [picture, setPicture] = useState('')

    const fetchItems = useCallback(() => {
        dispatch(getCollection(id))            
    }, [id, dispatch]) 

    async function addItem() {
        try {
            await Axios.post('/item/add', {
                title,
                date: itemDate,
                author: itemAuthor,
                tags: tagifyRef.current.value,
                id,
                picture
            }, {
                headers: {
                    'x-auth-token': userData.token
                }
            })

            closeModal.current.click()
            fetchItems()
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

    useEffect(() => {
        const getTags = async () => {
            try {
                setTagifyProps({loading: true})

                const response = await Axios.get('/item/tags')

                setTagifyProps((lastProps) => ({
                    ...lastProps,
                    whitelist: response.data.map(e => e.text),
                    loading: false

                }))
            } catch (error) {
                
            }
            
        }
        getTags()
    }, [])

    const settings = {
        ...baseTagifySettings,
        ...tagifySettings
      }

    return (
        <div className="modal fade" id="addItem" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{position: 'relative'}}>
                        <>
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Item settings</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                            <div className="input-group mb-3">
                                    <div className="custom-control custom-switch mr-2">
                                        <input disabled defaultChecked={comments} type="checkbox" className="custom-control-input" id="commentsCheck"/>
                                        <label className="custom-control-label" htmlFor="commentsCheck">Comments</label>
                                    </div>
                                    <div className="custom-control custom-switch mr-2">
                                        <input disabled defaultChecked={author} type="checkbox" className="custom-control-input" id="authorCheck"/>
                                        <label className="custom-control-label" htmlFor="authorCheck">Author</label>
                                    </div>
                                    <div className="custom-control custom-switch">
                                        <input disabled defaultChecked={year} type="checkbox" className="custom-control-input" id="yearCheck"/>
                                        <label className="custom-control-label" htmlFor="yearCheck">Year</label>
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">Title</span>
                                    </div>
                                    <input 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)}
                                    type="text" className="form-control" placeholder="Title" aria-label="Title" aria-describedby="basic-addon1"/>
                                </div>
                                <div className="input-group mb-3">
                                    <FileInput picture={picture} setPicture={setPicture}/>
                                </div>
                                {author && 
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">Author</span>
                                    </div>
                                    <input 
                                    value={itemAuthor}
                                    onChange={(e) => setItemAuthor(e.target.value)}
                                    type="text" className="form-control" placeholder="Author" aria-label="Author" aria-describedby="basic-addon1"/>
                                </div>
                                }
                                {year &&
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Date</span>
                                    </div>
                                    <input 
                                    onChange={(e) => setItemDate(e.target.valueAsNumber)} 
                                    type="date" className="form-control" placeholder="Date" aria-label="Date"/>
                                </div>
                                }
                                <div className="input-group mb-3">
                                    <Tags
                                    tagifyRef={tagifyRef}
                                    settings={settings}
                                    {...tagifyProps}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" ref={closeModal}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={addItem}>Add item</button>
                            </div> 
                        </>
                    </div>
                </div>
            </div>
    )
}

export default AddItemModal
import React, { useState, useRef, useEffect, useCallback } from 'react'
import Tags from '@yaireo/tagify/dist/react.tagify'
import '@yaireo/tagify/dist/tagify.css'
import Axios from 'axios'

import { useSelector, useDispatch } from 'react-redux'

import { getCollection, setNotify, clearErrorAll, startLoadingPage, setError, endLoadingPage } from '../../redux/actions'

import FileInput from '../fileInput/FileInput'
import { API_URL } from '../../config'

import lang from '../../lang.json'

import './AddItem.scss'

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

    const tagifyRef = useRef()

    const dispatch = useDispatch()

    const { userData } = useSelector(state => state.userData)

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
            dispatch(clearErrorAll())
            dispatch(startLoadingPage())
            dispatch(setNotify(true))

            await Axios.post(`${API_URL}/api/item/add`, {
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

            fetchItems()
        } catch (error) {
            dispatch(setError(error))
        }
        finally {
            dispatch(endLoadingPage())
        }
    }

    useEffect(() => {
        const getTags = async () => {
            try {
                setTagifyProps({loading: true})

                const response = await Axios.get(`${API_URL}/api/item/tags`)

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
                                <h5 className="modal-title" id="exampleModalLabel">{lang.AddItemModal.itemSettings[userData.user.lang]}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                            <div className="input-group mb-3">
                                    <div className="custom-control custom-switch mr-2">
                                        <input disabled defaultChecked={comments} type="checkbox" className="custom-control-input" id="commentsCheck"/>
                                        <label className="custom-control-label" htmlFor="commentsCheck">{lang.AddItemModal.comments[userData.user.lang]}</label>
                                    </div>
                                    <div className="custom-control custom-switch mr-2">
                                        <input disabled defaultChecked={author} type="checkbox" className="custom-control-input" id="authorCheck"/>
                                        <label className="custom-control-label" htmlFor="authorCheck">{lang.AddItemModal.author[userData.user.lang]}</label>
                                    </div>
                                    <div className="custom-control custom-switch">
                                        <input disabled defaultChecked={year} type="checkbox" className="custom-control-input" id="yearCheck"/>
                                        <label className="custom-control-label" htmlFor="yearCheck">{lang.AddItemModal.date[userData.user.lang]}</label>
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">{lang.AddItemModal.title[userData.user.lang]}</span>
                                    </div>
                                    <input 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)}
                                    type="text" className="form-control" placeholder={lang.AddItemModal.title[userData.user.lang]} aria-label="Title" aria-describedby="basic-addon1"/>
                                </div>
                                <div className="input-group mb-3">
                                    <FileInput picture={picture} setPicture={setPicture}/>
                                </div>
                                {author && 
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">{lang.AddItemModal.author[userData.user.lang]}</span>
                                    </div>
                                    <input 
                                    value={itemAuthor}
                                    onChange={(e) => setItemAuthor(e.target.value)}
                                    type="text" className="form-control" placeholder={lang.AddItemModal.author[userData.user.lang]} aria-label="Author" aria-describedby="basic-addon1"/>
                                </div>
                                }
                                {year &&
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">{lang.AddItemModal.date[userData.user.lang]}</span>
                                    </div>
                                    <input 
                                    onChange={(e) => setItemDate(e.target.valueAsNumber)} 
                                    type="date" className="form-control" placeholder={lang.AddItemModal.date[userData.user.lang]} aria-label="Date"/>
                                </div>
                                }
                                <div className="input-group mb-3">
                                    <Tags
                                    tagifyRef={tagifyRef}
                                    settings={settings}
                                    {...tagifyProps}
                                    placeholder={lang.AddItemModal.tags['en']}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">{lang.AddItemModal.close[userData.user.lang]}</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={addItem}>{lang.AddItemModal.addItem[userData.user.lang]}</button>
                            </div> 
                        </>
                    </div>
                </div>
            </div>
    )
}

export default AddItemModal
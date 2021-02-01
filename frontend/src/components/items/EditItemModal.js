import React, { useState, useRef, useEffect } from 'react'
import Tags from '@yaireo/tagify/dist/react.tagify'
import '@yaireo/tagify/dist/tagify.css'
import Axios from 'axios'

import { useSelector, useDispatch } from 'react-redux'

import { clearErrorAll, getCollection, setError, setNotify } from '../../redux/actions'

import FileInput from '../fileInput/FileInput'
import { API_URL } from '../../config'

import lang from '../../lang.json'

import './AddItem.scss'
import { END_LOADING_COLLECTION, START_LOADING_COLLECTION } from '../../redux/types'

const baseTagifySettings = {
    blacklist: ["xxx", "yyy", "zzz"],
    maxTags: 5,
    placeholder: "type something",
    dropdown: {
      enabled: 0
    }
  }

function EditItemModal(props) {
    const tagifyRef = useRef()

    const { userData } = useSelector(state => state.userData)
    const { item } = useSelector(state => state.item)
    const { collection } = useSelector(state => state.collection.collection)

    const dispatch = useDispatch()

    const [title, setTitle] = useState('')
    const [itemAuthor, setItemAuthor] = useState('')
    const [itemDate, setItemDate] = useState('')
    const [tagifySettings] = useState([])
    const [tagifyProps, setTagifyProps] = useState({})
    const [picture, setPicture] = useState('')

    useEffect(() => {
        if(Object.keys(item).length) {
            setTitle(item.title)
            setItemAuthor(item.author)
            setItemDate(item.year)
            setPicture(item.picture)
        }
    }, [item])

    async function saveItem() {
        try {
            dispatch(clearErrorAll())
            dispatch({type: START_LOADING_COLLECTION})
            dispatch(setNotify(true))

            await Axios.post(`${API_URL}/api/item/edit`, {
                picture,
                title,
                author: itemAuthor,
                tags: tagifyRef.current.value,
                date: itemDate,
                id: item._id,
                collection_id: collection._id
            }, {
                headers: {
                    'x-auth-token': userData.token
                }
            })

            dispatch(getCollection(collection._id))
        } catch (error) {
            dispatch(setError(error))
        }
        finally {
            dispatch({type: END_LOADING_COLLECTION})
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
        <div className="modal fade" id="editItem" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{position: 'relative'}}>
                    <>
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{lang.EditItemModal.itemSettings[userData.user.lang]}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">{lang.EditItemModal.title[userData.user.lang]}</span>
                                </div>
                                <input 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)}
                                type="text" 
                                className="form-control" 
                                placeholder={lang.EditItemModal.title[userData.user.lang]} 
                                />
                            </div>
                            <div className="input-group mb-3">
                                <FileInput picture={picture} setPicture={setPicture}/>
                            </div>
                            {collection.author && 
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">{lang.EditItemModal.author[userData.user.lang]}</span>
                                </div>
                                <input 
                                value={itemAuthor}
                                onChange={(e) => setItemAuthor(e.target.value)}
                                type="text" 
                                className="form-control" 
                                placeholder={lang.EditItemModal.author[userData.user.lang]} 
                                aria-label="Author" 
                                aria-describedby="basic-addon1"/>
                            </div>
                            }
                            {collection.year &&
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">{lang.EditItemModal.date[userData.user.lang]}</span>
                                </div>
                                <input 
                                onChange={(e) => setItemDate(e.target.valueAsNumber)} 
                                type="date" 
                                className="form-control" 
                                placeholder={lang.EditItemModal.date[userData.user.lang]} 
                                aria-label="Date"
                                value={itemDate ? new Date(itemDate).toISOString().substr(0, 10) : ''}/>
                            </div>
                            }
                            <div className="input-group mb-3">
                                <Tags
                                tagifyRef={tagifyRef}
                                settings={settings}
                                {...tagifyProps}
                                placeholder={lang.EditItemModal.tags['en']}
                                value={item.tags}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">{lang.AddItemModal.close[userData.user.lang]}</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={saveItem}>{lang.EditItemModal.saveItem[userData.user.lang]}</button>
                        </div> 
                    </>
                </div>
            </div>
        </div>
    )
}

export default EditItemModal
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'

import FileInput from '../fileInput/FileInput'
import { API_URL } from '../../config'
import { setError, endLoadingPage, startLoadingPage, setNotify, clearErrorAll, getAllCollections } from '../../redux/actions'
import lang from '../../lang.json'

import './AddCollectionModal.css'
import { START_LOADING_COLLECTION, END_LOADING_COLLECTION } from '../../redux/types'


function AddCollectionModal(params) {
    const { userData } = useSelector(state => state.userData)

    const location = useLocation()

    const dispatch = useDispatch()

    const [title, setTitle] = useState('')
    const [topic, setTopic] = useState('Books')
    const [description, setDescription] = useState('')
    const [author, setAuthor] = useState(false)
    const [comments, setComments] = useState(true)
    const [year, setYear] = useState(false)
    const [picture, setPicture] = useState('')
 
    console.log('Add: ' + author);

    const id = new URLSearchParams(location.search).get('id')

    async function addCollection() {
        dispatch(clearErrorAll())
        dispatch({
            type: START_LOADING_COLLECTION
        })
        dispatch(setNotify(true))
        try {  
            await Axios.post(`${API_URL}/api/collections/upload`, {
                owner: id,
                title,
                topic,
                description,
                author,
                comments,
                year,
                picture
            }, {
                headers: {
                    'x-auth-token': userData.token
                }
            })  
            
            setPicture('')
            setAuthor(false)
            setComments(true)
            setTopic('Books')
            setTitle('')
            setYear(false)
            setDescription('')

            dispatch(getAllCollections(id))
        } catch (error) {
            dispatch(setError(error))
        }
        finally {
            dispatch({
                type: END_LOADING_COLLECTION
            })
        }
    }

    return (
        <>  
            <div className="modal fade" id="addCollection" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{position: 'relative'}}>   
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{lang.AddCollectionModal.collectionSettings[userData.user.lang]}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">{lang.AddCollectionModal.title[userData.user.lang]}</span>
                                    </div>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" placeholder={lang.AddCollectionModal.title[userData.user.lang]} aria-label="Title" aria-describedby="basic-addon1"/>
                                </div>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <label className="input-group-text" htmlFor="inputGroupSelect01">{lang.AddCollectionModal.topic[userData.user.lang]}</label>
                                    </div>
                                    <select className="custom-select" value={topic} id="inputGroupSelect01" onChange={(e) => setTopic(e.target.value)}>
                                        <option value="Books">Books</option>
                                        <option value="Alcohol">Alcohol</option>
                                        <option value="CS:GO Skins">CS:GO Skins</option>
                                    </select>
                                </div>
                                <div className="input-group mb-3">
                                    <FileInput picture={picture} setPicture={setPicture}/>
                                </div>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">{lang.AddCollectionModal.description[userData.user.lang]}</span>
                                    </div>
                                    <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} aria-label="With textarea"></textarea>
                                </div>
                                <div className="input-group mb-3">
                                    <div className="custom-control custom-switch mr-2">
                                        <input defaultChecked={comments} onChange={(e) => setComments(e.target.checked)} type="checkbox" className="custom-control-input" id="commentsCheck"/>
                                        <label className="custom-control-label" htmlFor="commentsCheck">{lang.AddCollectionModal.comments[userData.user.lang]}</label>
                                    </div>
                                    <div className="custom-control custom-switch mr-2">
                                        <input defaultChecked={author} onChange={(e) => setAuthor(e.target.checked)} type="checkbox" className="custom-control-input" id="authorCheck"/>
                                        <label className="custom-control-label" htmlFor="authorCheck">{lang.AddCollectionModal.author[userData.user.lang]}</label>
                                    </div>
                                    <div className="custom-control custom-switch">
                                        <input defaultChecked={year} onChange={(e) => setYear(e.target.checked)} type="checkbox" className="custom-control-input" id="yearCheck"/>
                                        <label className="custom-control-label" htmlFor="yearCheck">{lang.AddCollectionModal.date[userData.user.lang]}</label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">{lang.AddCollectionModal.close[userData.user.lang]}</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={addCollection}>{lang.AddCollectionModal.save[userData.user.lang]}</button>
                            </div> 
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddCollectionModal
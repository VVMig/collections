import React, { createRef, useEffect, useState } from 'react'
import Axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'

import FileInput from '../fileInput/FileInput'
import { API_URL } from '../../config'
import './AddCollectionModal.css'

import lang from '../../lang.json'
import { getAllCollections } from '../../redux/actions'

function AddCollectionModal({ id }) {
    const closeModal = createRef()

    const { userData } = useSelector(state => state.userData)
    const { collection } = useSelector(state => state.collection.collection)

    const dispatch = useDispatch()

    const [title, setTitle] = useState('')
    const [topic, setTopic] = useState('Books')
    const [description, setDescription] = useState('')
    const [author, setAuthor] = useState(false)
    const [comments, setComments] = useState(true)
    const [year, setYear] = useState(false)
    const [picture, setPicture] = useState('')

    useEffect(() => {
        if(collection){
            setTitle(collection.title)
            setTopic(collection.topic)
            setDescription(collection.description)
            setAuthor(collection.author)
            setComments(collection.comments)
            setYear(collection.year)
            setPicture(collection.picture)
        }
    }, [collection])

    async function editCollection() {
        try {
            await Axios.post(`${API_URL}/api/collections/edit`, {
                picture,
                topic,
                author,
                comments,
                year,
                description,
                title,
                id: collection._id
            }, {
                headers: {
                    'x-auth-token': userData.token
                }
            })

            dispatch(getAllCollections(id))
            closeModal.current.click()
        } catch (error) {
            
        }        
    }

    return (
        <>           
            <div className="modal fade" id="editCollection" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                        <input defaultChecked={year} onChange={(e) => console.log(e.target.checked)} type="checkbox" className="custom-control-input" id="yearCheck"/>
                                        <label className="custom-control-label" htmlFor="yearCheck">{lang.AddCollectionModal.date[userData.user.lang]}</label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" ref={closeModal}>{lang.AddCollectionModal.close[userData.user.lang]}</button>
                                <button type="button" className="btn btn-primary" onClick={editCollection}>{lang.AddCollectionModal.save[userData.user.lang]}</button>
                            </div> 
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddCollectionModal
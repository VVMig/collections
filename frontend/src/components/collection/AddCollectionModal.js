import React, { createRef, useState } from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux'

import Spinner from '../spinner/Spinner'
import FileInput from '../fileInput/FileInput'

import './AddCollectionModal.css'

function AddCollectionModal(params) {
    const closeModal = createRef()

    const userData = useSelector(state => state.userData)

    const [title, setTitle] = useState('')
    const [topic, setTopic] = useState('Books')
    const [description, setDescription] = useState('')
    const [author, setAuthor] = useState(false)
    const [comments, setComments] = useState(true)
    const [year, setYear] = useState(false)
    const [picture, setPicture] = useState('')
    const [errorLoading, setErrorLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [uploading, setUploading] = useState(false)

 

    function startLoad() {
        setUploading(true)
        setErrorLoading(false)
        setErrorMessage('')
    }

    function endLoad() {
        setUploading(false)
        setErrorLoading(false)
        setErrorMessage('')

        setTitle('')
        setPicture('')
        setAuthor('')
        setDescription('')
        setYear('')
        setComments(true)
    }

    async function addCollection() {
        const close = closeModal.current

        try {  
            startLoad()

            await Axios.post('/collections/upload', {
                owner: userData.user.id,
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

            endLoad()
            close.click()        
        } catch (error) {
            setErrorLoading(true)
            setErrorMessage('')
            console.log(error)
            setErrorMessage(error.response ? error.response.data.message : 'Connection error. Please try again later:(')
        }
    }

    return (
        <>
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#addCollection">
                Add collection
            </button>

            
            <div className="modal fade" id="addCollection" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                {uploading && <Spinner errorMessage={errorMessage} errorLoading={errorLoading}/>}

                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{position: 'relative'}}>   
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Collection settings</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">Title</span>
                                    </div>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" placeholder="Title" aria-label="Title" aria-describedby="basic-addon1"/>
                                </div>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <label className="input-group-text" htmlFor="inputGroupSelect01">Topic</label>
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
                                        <span className="input-group-text">Description</span>
                                    </div>
                                    <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} aria-label="With textarea"></textarea>
                                </div>
                                <div className="input-group mb-3">
                                    <div className="custom-control custom-switch mr-2">
                                        <input defaultChecked={comments} onChange={(e) => setComments(e.target.checked)} type="checkbox" className="custom-control-input" id="commentsCheck"/>
                                        <label className="custom-control-label" htmlFor="commentsCheck">Comments</label>
                                    </div>
                                    <div className="custom-control custom-switch mr-2">
                                        <input defaultChecked={author} onChange={(e) => setAuthor(e.target.checked)} type="checkbox" className="custom-control-input" id="authorCheck"/>
                                        <label className="custom-control-label" htmlFor="authorCheck">Author</label>
                                    </div>
                                    <div className="custom-control custom-switch">
                                        <input defaultChecked={year} onChange={(e) => setYear(e.target.checked)} type="checkbox" className="custom-control-input" id="yearCheck"/>
                                        <label className="custom-control-label" htmlFor="yearCheck">Year</label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" ref={closeModal}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={addCollection}>Save changes</button>
                            </div> 
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddCollectionModal
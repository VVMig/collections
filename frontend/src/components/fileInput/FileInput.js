import React, { useCallback } from 'react';
import {useDropzone} from 'react-dropzone';
import * as Icon from 'react-bootstrap-icons'

import './FileInput.css'

function FileInput({ picture, setPicture }) {
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()          

            reader.readAsDataURL(file)

            reader.onload = () => {
                setPicture(reader.result)
            }
        })
        
    }, [setPicture])

    const {acceptedFiles, getRootProps, getInputProps, isDragActive} = useDropzone({maxFiles: 1, accept: 'image/jpeg, image/png', onDrop});
    
    const fileSettings = acceptedFiles.map(file => (
        <span key={file.path}>
            {file.path} - {file.size} bytes<br/>
        </span>
    ));

    return (
        <div className="d-flex flex-column w-100">   
            <div {...getRootProps()} 
            className="d-flex justify-content-center align-items-center border border-primary w-100 p-3 rounded  drag-zone"
            style={{height: `${isDragActive ? 70 : 50}px`}}>
                <input {...getInputProps()} />
                <span className="text-primary">{isDragActive ? 
                <Icon.Upload size={30}/> :
                "Drag 'n' drop picture here, or click to select"}</span>
            </div>
            {picture && 
            <aside className="mt-1">
                <h5>Preview</h5>
                {fileSettings}
                <img src={picture} className="img-fluid rounded" width="100" alt="example"/>
            </aside>}
        </div>
    );
}

export default FileInput
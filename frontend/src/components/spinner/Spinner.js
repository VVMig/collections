import React from 'react'
import './Spinner.scss'

function Spinner(){
    return (
        <div className="spinner d-flex w-100 justify-content-center align-items-center">
            <div className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

export default Spinner
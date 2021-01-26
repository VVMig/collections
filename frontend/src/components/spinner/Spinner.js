import React from 'react'
import './Spinner.css'

function Spinner({ errorLoading, errorMessage }){
    return (
        <>
        {!errorLoading ? <div className="text-center">
            <div className="spinner-border text-primary spinner-grow-lg" role="status">
                <span className="sr-only">Loading...</span>
           </div>
        </div> : <div className="alert alert-danger fade-in" role="alert">
                    {errorMessage}
                </div>
        }
        </>        
    )
}

export default Spinner
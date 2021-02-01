import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrorAll } from '../../redux/actions'

import './AlertError.scss'

function AlertError() {
    const { error, loading } = useSelector(state => state.error)

    const dispatch = useDispatch()

    return (
        <>
            {!loading && error && <div className="alert alert-warning alert-danger fade-in show mt-1" role="alert">
                {error}
                <button type="button" className="close" aria-label="Close" data-dismiss="alert" onClick={() => dispatch(clearErrorAll())}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>}
        </>
    )
}

export default AlertError
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { clearErrorAll } from '../../redux/actions'
import SpinnerComponent from '../spinner/SpinnerComponent'

import './AlertError.scss'

function AlertStatus() {
    const { loading, error, notify } = useSelector(state => state.error)
    const { loadingCollection } = useSelector(state => state.collection)
    const dispatch = useDispatch()

    return (
        <>
            {notify && !error &&
                <div className="alert alert-primary fade-in" role="alert">
                    {loading || loadingCollection ?
                    <SpinnerComponent/>   
                    : <span>Successfully uploaded</span>}
                    <button type="button" className="close" aria-label="Close" onClick={() => dispatch(clearErrorAll())}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            }
        </>
    )
}

export default AlertStatus
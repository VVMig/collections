import React, { useCallback, useEffect } from 'react'

import SpinnerComponent from '../spinner/SpinnerComponent'
import CardCollection from './CardCollection'
import './CollectionsItems.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCollections } from '../../redux/actions'
import EditModal from './EditCollectionModal'

function CollectionsItems(props) {
    const { id } = props 
    const dispatch = useDispatch()

    const { collections, loading } = useSelector(state => state.allCollections)

    useEffect(() => {
        dispatch(getAllCollections(id))    
    }, [dispatch, id])

    return (
        <>
            {loading && 
            <div className="text-center mt-2">
                <SpinnerComponent/>
            </div>
            }
            {collections.length && !loading && 
            <div className="d-flex collections-container flex-wrap justify-content-center  mt-3">
                {collections.map((e) => (
                    <CardCollection key={e._id} {...e}/>
                ))}
                <EditModal id={id}/>
            </div>}
        </>
    )
}

export default CollectionsItems
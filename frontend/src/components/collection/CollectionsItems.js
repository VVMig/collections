import React, { useEffect, useState } from 'react'
import Axios from 'axios'

import Spinner from '../spinner/Spinner'
import Card from './CollectionCard'

import './CollectionsItems.css'

function CollectionsItems(props) {
    const { id } = props 
    const [collections, setCollections] = useState([])
    const [errorLoading, setErrorLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const getCollections = async () => {
            try {
                const response = await Axios.get('/collections/', {
                    params: {
                        id
                    }
                })

                setCollections(response.data)
            } catch (error) {
                setErrorMessage(error.response ? error.response.data.message : 'Connection error. Please try again later:(')
                setErrorLoading(true)
            }
        }

        getCollections()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    return (
        <>
            {!collections.length ? <Spinner errorLoading={errorLoading} errorMessage={errorMessage}/>
            :
            <div className="d-flex collections-container flex-wrap justify-content-center justify-content-md-start">
                {collections.map((e) => (
                    <Card key={e._id} {...e}/>
                ))}
            </div>}
        </>
    )
}

export default CollectionsItems
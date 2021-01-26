import React from 'react'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'

import CollectionsItems from '../collection/CollectionsItems'

function Collections(props){
    // const userData = useSelector(state => state.userData)
    const location = useLocation()
    const id = new URLSearchParams(location.search).get('id')

    return (
        <>
            <CollectionsItems id={id}/>
        </>
    )
}

const mapStateToProps = state => state.userData;

export default connect(mapStateToProps, null)(Collections)
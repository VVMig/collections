import React from 'react'
import { useSelector, connect } from 'react-redux'

import Users from '../users/Users'

function Admin(props){
    const userData = useSelector(state => state.userData)

    return (
        <>
            {userData.token && userData.user.userRole !== 'admin' ? 
            <h1>You don't have permissions for this page :(</h1> :
            <Users/>} 
        </>
    )
}

const mapStateToProps = state => state.userData;

export default connect(mapStateToProps, null)(Admin)
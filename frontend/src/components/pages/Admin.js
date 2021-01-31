import React from 'react'
import { connect } from 'react-redux'

import Users from '../users/Users'

import lang from '../../lang.json'

function Admin(props){
    return (
        <>
            {props.userData.token && props.userData.user.userRole !== 'admin' ? 
            <h1>{lang.Admin.permission[props.userData.user.lang]} :(</h1> :
            <Users/>} 
        </>
    )
}

const mapStateToProps = state => state.userData;

export default connect(mapStateToProps, null)(Admin)
import React from 'react'
import { connect } from 'react-redux'

function Dashboard(props){
    return (
        <h1>It's Dashboard</h1>
    )
}

const mapStateToProps = state => state.userData;

export default connect(mapStateToProps, null)(Dashboard)
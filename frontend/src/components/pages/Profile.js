import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Axios from 'axios'
import { useSelector, connect } from 'react-redux'

import Spinner from '../spinner/Spinner'
import AddCollection from '../collection/AddCollectionModal'

function Profile() {
    const userData = useSelector(state => state.userData)
    const [userProfile, setUserProfile] = useState({});  
    const [errorLoading, setErrorLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const location = useLocation();
    const id = new URLSearchParams(location.search).get('id')

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const response = await Axios.get('/user/profile', {
                    params: {
                        id 
                    }
                })
                
                setUserProfile(response.data)
            } catch (error) {
                setErrorMessage(error.response ? error.response.data.message : 'Connection error. Please try again later:(')
                setErrorLoading(true)
            }
        };

        getProfileData()
    }, [id])

    return (
        <>
            {!userProfile.user ? 
            <Spinner errorLoading={errorLoading} errorMessage={errorMessage}/> :
            userProfile.user ?
                <div className="d-flex">
                    <div className="card col-md-6">
                        <div className="card-body">
                            <h5 className="card-title">{userProfile.user.displayName}</h5>
                            <div className="card-body">
                                {!userProfile.user.blocked ?
                                <>
                                    <div className="card-header">Info</div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Email: {userProfile.user.email}</li>
                                        <li className="list-group-item">Register date: {userProfile.user.registerDate}</li>
                                        <li className="list-group-item">Role: {userProfile.user.userRole}</li>
                                        <li className="list-group-item">
                                            <Link to={`/collections?id=${userProfile.user.id}`}>Collections</Link>
                                        </li>
                                    </ul>
                                </> :
                                <h5 className="text-danger">User has been blocked</h5>}
                                {userData.user && userData.user.id === id && !userData.user.blocked && userData.user.userRole === 'admin'
                                && <Link to="/admin" className="btn btn-primary">Admin panel</Link>}
                            </div>
                        </div>
                    </div>
                    {(userData.user && (userData.user['id'] === id || userData.user['userRole'] === 'admin')) && <div className="col-md-6">
                        <AddCollection/>
                    </div>}
            </div>: <h2>No user with this id :(</h2>}
            
        </>
    )
}

const mapStateToProps = state => state.userData;

export default connect(mapStateToProps, null)(Profile)
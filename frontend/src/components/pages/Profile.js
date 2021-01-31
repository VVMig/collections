import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Axios from 'axios'
import { useSelector, connect, useDispatch } from 'react-redux'

import Spinner from '../spinner/Spinner'
import { API_URL } from '../../config'
import UserPicture from '../userPicture/UserPicture' 
import AddBtn from '../collection/BtnAddCollection'
import AddModal from '../collection/AddCollectionModal'


import './Profile.scss'

import lang from '../../lang.json'
import { clearErrorAll, endLoadingPage, setError, startLoadingPage } from '../../redux/actions'
import CollectionsItems from '../collection/CollectionsItems'

function Profile({ userData }) {
    const { loading } = useSelector(state => state.error)
    const { collections } = useSelector(state => state.allCollections) 
    const [userProfile, setUserProfile] = useState({});  
    const location = useLocation();
    const id = new URLSearchParams(location.search).get('id')
    const dispatch = useDispatch()

    useEffect(() => {
        const getProfileData = async () => {
            dispatch(clearErrorAll())
            dispatch(startLoadingPage())
            console.log(id)

            try {
                const response = await Axios.get(`${API_URL}/api/user/profile`, {
                    params: {
                        id 
                    }
                })
                setUserProfile(response.data)
            } catch (error) {
                dispatch(setError(error))
            }
            finally {
                dispatch(endLoadingPage())
            }
        };

        getProfileData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    return (
        <>
            {loading && !userProfile.user && <Spinner/>}
            {userProfile.user && 
            <>
                <div className="d-flex mt-3 align-items-center flex-md-row flex-column" style={{gap: '3rem'}}>
                    <div className="d-flex flex-column">
                        <div className="bg-light text-center p-3" style={{borderRadius: 10}}>
                            <UserPicture picture={userProfile.user.userPhoto} name={userProfile.user.displayName} styles={{width: 180, height: 180, fontSize: '5rem'}}/>
                            <h4>{userProfile.user.displayName}</h4>
                            <span>{userProfile.user.userRole}</span>
                        </div>
                        {userData.user.userRole === 'admin' && <div className="bg-light text-center p-3 mt-1" style={{borderRadius: 10}}>
                            <Link to="/admin" className="btn btn-primary">Admin panel</Link>
                        </div>}
                    </div>
                    <div className="bg-light p-3 w-100" style={{borderRadius: 10}}>
                        <h2>About</h2>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">Email: {userProfile.user.email}</li>
                            <li className="list-group-item">Register date: {new Date(parseFloat(userProfile.user.registerDate)).toLocaleDateString()}</li>
                            <li className="list-group-item">Number of collections: {collections.length}</li>
                        </ul>
                    </div>
                </div>
                {(userData.user.userRole === 'admin' || userData.user.id === id) &&
                <div className="text-center mt-2">
                    <AddBtn styles={{width: '100%'}}/>
                    <AddModal/>
                </div>
                }
                <CollectionsItems id={id}/>
            </>
            }    
        </>
    )
}

const mapStateToProps = state => state.userData

export default connect(mapStateToProps, null)(Profile)
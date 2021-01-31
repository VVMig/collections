import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios'
import * as Icon from 'react-bootstrap-icons';
import { connect, useDispatch, useSelector } from 'react-redux';

import Spinner from '../spinner/Spinner'
import { deleteUser, setAdmin, removeAdmin, blockUser, unblockUser } from '../../redux/actions';
import { API_URL } from '../../config'

function Users() {
    const [users, setUsers] = useState([])
    const [flack, setFlack] = useState(false)
    const [actionsUsers, setActionsUsers] = useState([])
    const [errorLoading, setErrorLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { userData } = useSelector(state => state.userData)
    const error = useSelector(state => state.error)
    const dispatch = useDispatch()
    const keys = ['displayName', 'email', 'registerDate', 'userRole']

    useEffect(() => {
        const getUsers = async () => {
            if(!userData.token)
                return;
            try {
                const response = await Axios.get(`${API_URL}/api/user/users`, {
                    headers: {
                        'x-auth-token': userData.token 
                    }
                })
      
                if(response.data) {
                    setUsers(response.data)
                }
    
            } catch (error) {
                setErrorMessage(error.response ? error.response.data.message : 'Connection error. Please try again later:(')
                setErrorLoading(true)
            }
        }

        getUsers()
    }, [userData, users.length])

    useEffect(() => {
        setErrorMessage(error.error.message)
        error.error.message && setErrorLoading(true)
    }, [error])

    function compare(a, b, key, flack) {
        if (a[key] === b[key]) return 0;
        if (a[key] > b[key]) return flack ? 1 : -1; 
        if (a[key] < b[key]) return flack ? -1 : 1;
    }

    function sort(e, key) {
        setFlack(!flack)
        setUsers(users.sort((a, b) => compare(a, b, key, flack)).slice())
        setTimeout(() => {
            e.target.blur()
        }, 100)
    }

    function userForAction(e, id) {
        if(e.target.checked)
            setActionsUsers([...actionsUsers, id])
        else setActionsUsers(actionsUsers.filter(e => e !== id))
    }

    function action(title) {
        switch (title) {
            case 'delete':
                dispatch(deleteUser(userData.token, actionsUsers))
                break;
            case 'setAdmin':
                dispatch(setAdmin(userData.token, actionsUsers))
                break;
            case 'removeAdmin':
                dispatch(removeAdmin(userData.token, actionsUsers, error))
                break; 
            case 'block':
                dispatch(blockUser(userData.token, actionsUsers))
                break;
            case 'unblock':  
                dispatch(unblockUser(userData.token, actionsUsers))
                break;  
            default:
                break;
        }       

        setUsers([])
    }

    return (
        <>
        {(!users.length || errorMessage) && <Spinner errorLoading={errorLoading} errorMessage={errorMessage}/>}

        {users.length ? 
        <>
            <div className="d-flex flex-column w-100 mb-2">
                <div className="d-flex flex-xl-row flex-column align-items-center">
                    <div className="btn-group btn-group-sm-sm mr-xl-auto mb-xl-0 mb-1" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-secondary" onClick={(e) => sort(e, 'displayName')}>Name</button>
                        <button type="button" className="btn btn-secondary" onClick={(e) => sort(e, 'email')}>Email</button>
                        <button type="button" className="btn btn-secondary" onClick={(e) => sort(e, 'registerDate')}>Register date</button>
                        <button type="button" className="btn btn-secondary" onClick={(e) => sort(e, 'userRole')}>User role</button>
                    </div>
                    <div className="btn-group btn-group-sm-sm" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-secondary btn-danger" disabled={!actionsUsers.length} onClick={() => action('delete')}>Delete <Icon.TrashFill/></button>
                        <button type="button" className="btn btn-secondary btn-danger" disabled={!actionsUsers.length} onClick={() => action('block')}>Blocked <Icon.LockFill style={{marginBottom: 4}}/></button>
                        <button type="button" className="btn btn-secondary btn-danger" disabled={!actionsUsers.length} onClick={() => action('unblock')}>Unblocked <Icon.UnlockFill style={{marginBottom: 4}}/></button>
                        <button type="button" className="btn btn-secondary btn-danger" disabled={!actionsUsers.length} onClick={() => action('setAdmin')}>Set admin <Icon.PersonPlusFill style={{marginBottom: 3}}/></button>
                        <button type="button" className="btn btn-secondary btn-danger" disabled={!actionsUsers.length} onClick={() => action('removeAdmin')}>Remove admin <Icon.PersonXFill style={{marginBottom: 3}}/></button>
                    </div>
                </div>
            </div>
            <table className="table table-bordered table-hover table-responsive-md">
                <caption>List of users</caption>
                <thead className="thead-dark">
                    <tr>
                        <th>Select</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Regiser Date</th>
                        <th>User role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((e, i) => {
                        return (
                        <tr key={i} className={`${e['blocked'] && 'table-danger'}${actionsUsers.findIndex(user => user === e['_id']) > -1 ? ' table-primary' : ''}`}>
                            <td>
                                <div className="text-center">
                                    <input id={e['_id']} type="checkbox" readOnly checked={actionsUsers.findIndex(user => user === e['_id']) > -1} className="form-check-label" onClick={(event) => userForAction(event, e['_id'])}/>
                                </div>
                            </td>
                            {keys.map((key, ind) => (
                                <td key={ind}>{key === 'displayName' ?
                                <Link className="text-decoration-none" to={`/profile?id=${e['_id']}`}>{e['blocked'] ? 
                                    <> {e[key]} <Icon.LockFill style={{marginBottom: 4}}/> </> : 
                                    e[key]}</Link> :
                                e[key]}</td>
                            ))}            
                        </tr>
                        )
                    })}
                </tbody>
            </table>
        </>:<></>}
        </>
    )
}

const mapStateToProps = state => state.userData;

export default connect(mapStateToProps, null)(Users)
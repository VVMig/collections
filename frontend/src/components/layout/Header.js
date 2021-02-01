import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector, connect } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import * as Icon from 'react-bootstrap-icons'

import UserPicture from '../userPicture/UserPicture'
import { isLogin, resetUser, setSearch } from '../../redux/actions'

import './Header.scss'

import lang from '../../lang.json'

function Header(props){
    const { userData } = props
    const { searchText } = useSelector(state => state.search)
    const dispatch = useDispatch()
    const history = useHistory()

    const [searchTextInput, setSearchTextInput] = useState(searchText)

    useEffect(() => {
        setSearchTextInput(searchText)
    }, [searchText])

    const logout = () => {
        dispatch(resetUser())    

        localStorage.removeItem('token')
        sessionStorage.removeItem('token')

        window.location.reload()
    }

    const onSearch = (e) => {
        e.preventDefault()

        if(searchTextInput.trim()) {
            dispatch(setSearch(searchTextInput))
        }

        history.push('/search')
    }

    return (
        <header>
            <nav className="navbar navbar-expand-md navbar-light bg-light">
                <Link className="navbar-brand" to="/">{lang.Header.collections[userData.user.lang]}</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample02" aria-controls="navbarsExample02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarsExample02">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/">{lang.Header.home[userData.user.lang]}</Link>
                        </li>
                    </ul>
                    <form className="form-inline" id="item-search" onSubmit={onSearch}>
                        <input className="form-control w-100" value={searchTextInput} onChange={(e) => setSearchTextInput(e.target.value)} type="text" placeholder="Search"/>
                        <span onClick={onSearch}><Icon.Search/></span>
                    </form>
                    {!dispatch(isLogin) && !userData.token?
                    <div className="d-flex flex-column ml-md-3 align-items-md-center">
                        <Link to="/login">{lang.Header.logIn[userData.user.lang]}</Link>
                        <Link to="/register">{lang.Header.register[userData.user.lang]}</Link>
                    </div> :
                    <div className="flex-column ml-md-3 mt-1 mt-md-0 avatar">
                        <div className="btn-group">
                            {userData.token ? <button type="button" className={`btn dropdown-toggle bg-dark${!userData.user.userPhoto && ' text-light'}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <UserPicture picture={userData.user.userPhoto} name={userData.user.displayName}/>
                            </button> :
                            <button type="button" className={`btn dropdown-toggle`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <div style={{background: 'grey'}}></div>
                            </button>}
                            <div className="dropdown-menu dropdown-menu-md-right">
                                {userData.user && <button className="dropdown-item" onClick={() => history.push(`/profile?id=${userData.user.id}`)}>{userData.user.displayName}</button>}
                                <button className="dropdown-item" onClick={() => logout()}>{lang.Header.logOut[userData.user.lang]}</button>
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </nav>
        </header>
    )
}

const mapStateToProps = state => state.userData;

export default connect(mapStateToProps, null)(Header)
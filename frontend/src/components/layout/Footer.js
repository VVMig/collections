import React from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { switchLang } from '../../redux/actions'

import './Footer.scss'

function Footer(props) {
    const dispatch = useDispatch()

    const { userData } = useSelector(state => state.userData)

    return (
        <footer className={`footer py-3 bg-${userData.user.darkMode ? 'dark' : 'light'} mt-3`}>
            <div className="container d-flex justify-content-end">
                <select className="form-control select-lang" value={props.userData.user.lang} onChange={(e) => dispatch(switchLang(e.target.value))}>
                    <option value="ru">ru</option>
                    <option value="en">en</option>
                </select>
            </div>
        </footer>
    )
}

const mapStateToProps = state => state.userData;

export default connect(mapStateToProps, null)(Footer)
import React, { createRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Axios from 'axios'
import { connect, useDispatch, useSelector } from 'react-redux'
import { GoogleLogin } from 'react-google-login'

import useInputValue from '../../helpers/useInputValue'

import VkAuth from './VkAuth';
import { setUser, setError } from '../../redux/actions'
import { API_URL } from '../../config'

import lang from '../../lang.json'

function Login(props) {
    const { userData } = useSelector(state => state.userData)

    const email = useInputValue('email', 'Email adress')
    const password = useInputValue('password')
    const remember = createRef(false)
    const dispatch = useDispatch()
    const history = useHistory()

    if(userData.token) 
        history.push('/')

    async function login(e, resGoogle, resVk) {
        if(e)
            e.preventDefault()

        const idToken = resGoogle && resGoogle.tokenId
        const checked = false;
        const vkId = resVk && resVk.session && {
            email: resVk.session.user.id,
            displayName: `${resVk.session.user.first_name} ${resVk.session.user.last_name}`
        }
        
        try {
            const response = await Axios.post(`${API_URL}/api/user/login`, {email: email.value(), password: password.value(), idToken, vkId})
             dispatch(setUser((response.data))) 
             if(checked){
                localStorage.setItem('token', response.data.token)
            }
            else sessionStorage.setItem('token', response.data.token)
            history.push('/')
            window.location.reload()
        } catch (error) {
            dispatch(setError(error))
        }     
    }

    return (
        <>
            <div className="d-flex justify-content-center">      
                <div className="text-center w-50">
                    <form className="form-signin" onSubmit={(e) => login(e)}>
                        <h1 className="h3 mb-3 font-weight-normal">{lang.logIn.signIn[userData.user.lang]}</h1>
                        <label htmlFor="emailInput" className="sr-only">{lang.logIn.emailAdress[userData.user.lang]}</label>
                        <input {...email.bind} autoFocus/>
                        <label htmlFor="passwordInput" className="sr-only">{lang.logIn.password[userData.user.lang]}</label>
                        <input {...password.bind}/>
                        <div className="checkbox mb-3">
                            <label>
                                <input type="checkbox" value="remember-me" ref={remember}/> {lang.logIn.rememberMe[userData.user.lang]}
                            </label>
                        </div>
                        <button className="btn btn-lg btn-primary btn-block" type="submit">{lang.logIn.signIn[userData.user.lang]}</button>
                    </form>       
                    <div className="d-flex mt-3">
                        <div className="mr-1">
                            <GoogleLogin 
                                clientId="327702379277-a035t5hfkakgfb0dt3111c7eiio2458p.apps.googleusercontent.com"
                                buttonText="Login"
                                onSuccess={(e) => login(null, e)}
                            />
                        </div>
                        <div>
                            <VkAuth apiId="7722772" callback={(e) => login(null, null, e)}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => state.userData;

export default connect(mapStateToProps, null)(Login);
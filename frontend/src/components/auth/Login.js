import React, { createRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Axios from 'axios'
import { connect, useDispatch, useSelector } from 'react-redux'
import { GoogleLogin } from 'react-google-login'

import useInputValue from '../../helpers/useInputValue'

import VkAuth from './VkAuth';
import { setUser } from '../../redux/actions'
import Spinner from '../spinner/Spinner'


function Login(props) {
    const email = useInputValue('email', 'Email adress')
    const password = useInputValue('password')
    const remember = createRef(false)
    const dispatch = useDispatch()
    const history = useHistory()
    const userData = useSelector(state => state.userData)
    const [errorLoading, setErrorLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    if(userData.token) 
        history.push('/')

    async function login(e, resGoogle, resVk) {
        if(e)
            e.preventDefault()

        setErrorLoading(false)
        setErrorMessage('Loading...')

        const idToken = resGoogle && resGoogle.tokenId
        const checked = false;
        const vkId = resVk && resVk.session && {
            email: resVk.session.user.id,
            displayName: `${resVk.session.user.first_name} ${resVk.session.user.last_name}`
        }
        
        try {
            const response = await Axios.post('/user/login', {email: email.value(), password: password.value(), idToken, vkId})
             dispatch(setUser((response.data))) 
             if(checked){
                localStorage.setItem('token', response.data.token)
            }
            else sessionStorage.setItem('token', response.data.token)
             history.push('/')
        } catch (error) {
            setErrorLoading(true)
            setErrorMessage('')
            setErrorMessage(error.response ? error.response.data.error.message : 'Connection error. Please try again later:(')
        }     
    }

    return (
        <>
            {errorMessage && <Spinner errorLoading={errorLoading} errorMessage={errorMessage}/>}
            <div className="d-flex justify-content-center">      
                <div className="text-center w-50">
                    <form className="form-signin" onSubmit={(e) => login(e)}>
                        <h1 className="h3 mb-3 font-weight-normal">Sign in</h1>
                        <label htmlFor="emailInput" className="sr-only">Email address</label>
                        <input {...email.bind} autoFocus/>
                        <label htmlFor="passwordInput" className="sr-only">Password</label>
                        <input {...password.bind}/>
                        <div className="checkbox mb-3">
                            <label>
                                <input type="checkbox" value="remember-me" ref={remember}/> Remember me
                            </label>
                        </div>
                        <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
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
import React, { useState } from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login'
import { connect, useDispatch, useSelector } from 'react-redux'

import useInputValue from '../../helpers/useInputValue'
import { setUser } from '../../redux/actions'
import VkAuth from './VkAuth'
import Spinner from '../spinner/Spinner'
import { API_URL } from '../../config'

import lang from '../../lang.json'

function Register(props) {
    const email = useInputValue('email', 'Email adress')
    const password = useInputValue('password', 'Password')
    const passwordCheck = useInputValue('password', 'Confirm password', 'passwordCheck')
    const name = useInputValue('text', 'Name', 'displayName')
    const history = useHistory();
    const { userData } = useSelector(state => state.userData)
    const dispatch = useDispatch()
    const [errorLoading, setErrorLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    if(userData.token)
        history.push('/')

    async function register(e) {
        e.preventDefault();
        
        try {
            await Axios.post(`${API_URL}/api/user/register`, {
                displayName: name.value(),
                email: email.value(), 
                password: password.value(),
                passwordCheck: passwordCheck.value(),
            })
    
            history.push('/login')        
        } catch (error) {
            setErrorLoading(true)
            setErrorMessage('')
            setErrorMessage(error.response.data.error.message)
        }
    }

    async function login(e, resGoogle, resVk) {
        if(e)
            e.preventDefault()

        setErrorLoading(false)
        setErrorMessage('Loading...')

        const idToken = resGoogle && resGoogle.tokenId
        const checked = false;
        const vkId = resVk && {
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
                    <form className="needs-validation" onSubmit={register}>
                        <h1 className="h3 mb-3 font-weight-normal">{lang.Register.signUp[userData.user.lang]}</h1>
                        <div>
                            <label htmlFor="namelInput" className="sr-only">{lang.Register.name[userData.user.lang]}</label>
                            <input {...name.bind} autoFocus/>
                        </div>
                        <label htmlFor="emailInput" className="sr-only">{lang.Register.emailAddress[userData.user.lang]}</label>
                        <input {...email.bind}/>
                        <label htmlFor="passwordInput" className="sr-only">{lang.Register.password[userData.user.lang]}</label>
                        <input {...password.bind}/>
                        <label htmlFor="passwordCheckInput" className="sr-only">{lang.Register.passwordConfirm[userData.user.lang]}</label>
                        <input {...passwordCheck.bind}/>
                        <button className="btn btn-lg btn-primary btn-block" type="submit">{lang.Register.signUp[userData.user.lang]}</button>
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

export default connect(mapStateToProps, null)(Register);
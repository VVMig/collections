import './App.scss';
import { useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'
import $ from 'jquery'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/pages/Home'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Profile from './components/pages/Profile'
import PrivateRoute from './components/routes/PrivateRoute'
import Admin from './components/pages/Admin'
import Collection from './components/pages/Collection'
import Search from './components/pages/Search'

import { getUser } from './redux/actions';
import AlertError from './components/alerts/AlertError';
import AlertStatus from './components/alerts/AlertStatus';

function App({ userData }) {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  useEffect(() => {
    if(userData.user.darkMode)
      $('#root').addClass('dark')
    else $('#root').removeClass('dark')  
  }, [userData])

  return (
      <BrowserRouter>
          <Header/>         
          <div className="container">
            <AlertError/>
            <AlertStatus/>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
                <Route path="/profile:id?" component={Profile}/>
                <Route path="/collection:collection_id?" exact component={Collection}/>
                <Route path="/search" exact component={Search}/>
                <PrivateRoute path="/admin" component={Admin}/>
            </Switch>
          </div>
          <Footer/>
      </BrowserRouter>
  );
}

const mapStateToProps = state => state.userData

export default connect(mapStateToProps, null)(App);

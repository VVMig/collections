import './App.css';
import { useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'

import Header from './components/layout/Header'
import Home from './components/pages/Home'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Profile from './components/pages/Profile'
import Dashboard from './components/pages/Dashboard'
import PrivateRoute from './components/routes/PrivateRoute'
import Admin from './components/pages/Admin'
import AllCollections from './components/pages/AllCollections'
import Collection from './components/pages/Collection'
import Search from './components/pages/Search'

import { getUser } from './redux/actions';

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  return (
    <div className="App">
      <BrowserRouter>
          <Header/>         
          <div className="container pt-2">
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
                <Route path="/profile:id?" component={Profile}/>
                <Route path="/collections:id?" exact component={AllCollections}/>
                <Route path="/collections/collection:collection_id?" exact component={Collection}/>
                <Route path="/search" exact component={Search}/>
                <PrivateRoute path="/dashboard" component={Dashboard}/>
                <PrivateRoute path="/admin" component={Admin}/>
            </Switch>
          </div>
      </BrowserRouter>
    </div>
  );
}

const mapStateToProps = state => state.userData

export default connect(mapStateToProps, null)(App);

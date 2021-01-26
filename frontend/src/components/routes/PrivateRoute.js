import React from 'react';
import { useDispatch, connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { isLogin } from '../../redux/actions';

const PrivateRoute = ({component: Component, ...rest}) => {
    const dispatch = useDispatch();

    return (
        <Route {...rest} render={props => (
            dispatch(isLogin) ?
                <Component {...props} />
            : <Redirect to={{pathname: "/login", state: {nextPathname: props.location.pathname}}}/>
        )} />
    );
};

const mapStateToProps = state => state.userData;

export default connect(mapStateToProps, null)(PrivateRoute)
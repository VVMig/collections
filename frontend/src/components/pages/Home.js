import React, { useCallback, useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { clearErrorAll, getHome, startLoading } from '../../redux/actions'

import LastAdded from '../homeSections/LastAdded'
import Tags from '../homeSections/Tags'
import MostLike from '../homeSections/MostLike'

import lang from '../../lang.json'
import Spinner from '../spinner/Spinner'

function Home(props){
    const { loading } = useSelector(state => state.error)
    const home = useSelector(state => state.home)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(clearErrorAll())
        dispatch(getHome(true))
    }, [dispatch])

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(getHome())
        }, 2000)
        
        return () => clearInterval(interval)
    }, [dispatch])

    return (
        <>
            {loading && <Spinner/>}
            {!loading &&
            <>
                <Tags/>
                <div className="row text-center">
                    <div className="col-12">
                        <LastAdded/>
                    </div>
                    <div className="col-12 most-like">
                        <MostLike/>
                    </div>
                </div>
            </>
            }
        </>
    )
}

const mapStateToProps = state => state.userData;

export default connect(mapStateToProps, null)(Home)
import React, { useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { getHome } from '../../redux/actions'

import LastAdded from '../homeSections/LastAdded'
import Tags from '../homeSections/Tags'
import MostLike from '../homeSections/MostLike'

function Home(props){
    const dispatch = useDispatch()

    dispatch(getHome())

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(getHome())
        }, 2000)
        
        return () => clearInterval(interval)
    }, [dispatch])

    return (
        <>
            <Tags/>
            <div className="row text-center">
                <div className="col-8">
                    <h2>Recently added</h2>
                    <LastAdded/>
                </div>
                <div className="col-4">
                    <h2>Most like</h2>
                    <MostLike/>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => state.userData;

export default connect(mapStateToProps, null)(Home)
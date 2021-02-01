import React from 'react'
import { connect, useSelector } from 'react-redux'
import Item from '../items/Item';

import './Search.scss'

import lang from '../../lang.json'
import Spinner from '../spinner/Spinner';

function Search(props){
    const { items, searchText } = props
    const { loading } = useSelector(state => state.error)
    

    return (
        <>
            {loading && <Spinner/>}
            {!loading && <div className="d-flex flex-wrap search-items-container">
                {items.length ?
                <div className="d-flex flex-column">
                    <h4>Here's what we found for {searchText}</h4>
                    <div className="d-flex flex-wrap" style={{gap: '2rem'}}>
                        {items.map((e) => <Item itemProps={e} key={e._id}/>)}
                    </div>
                </div>
                :
                'Nothing was found for your request :('}
            </div>}
        </>
    )
}

const mapStateToProps = state => state.search;

export default connect(mapStateToProps, null)(Search)
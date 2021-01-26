import React from 'react'
import { connect } from 'react-redux'
import Item from '../items/Item';

import './Search.scss'

function Home(props){
    const { items } = props

    return (
        <>
            <div className="d-flex flex-wrap search-items-container">
                {items.length ?
                items.map((e) => <Item itemProps={e} key={e._id}/>):
                'No items with that query'}
            </div>
        </>
    )
}

const mapStateToProps = state => state.search;

export default connect(mapStateToProps, null)(Home)
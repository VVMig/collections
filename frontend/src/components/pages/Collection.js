import React, { useEffect, useState } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { useLocation, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

import AddItem from '../items/AddItem'
import Item from '../items/Item'
import Modal from '../items/ModalItem'
import Sort from '../collection/Sort'
import Filter from '../collection/Filter'

import { getCollection } from '../../redux/actions'

function Collection(props){
    const [filter, setFilter] = useState({
        apply: false
    })

    const userData = useSelector(state => state.userData)
    const { collection, items } = useSelector(state => state.collection.collection)
    const { sortOptions } = useSelector(state => state.collection)

    const dispatch = useDispatch()

    const location = useLocation()
    const id = new URLSearchParams(location.search).get('collection_id')

    useEffect(() => {
        dispatch(getCollection(id))
    }, [id, dispatch])

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(getCollection(id))
        }, 2000)

        return () => clearInterval(interval)
    }, [id, dispatch])

    function filterOptions(e) {
        if(!filter.apply) {
            return true
        }

        if(filter.title && filter.title.trim()) {
            const ref = new RegExp(`${filter.title}`, 'gi')
            if(!e.title.match(ref)) {
                return false
            }
        }

        if(filter.author && filter.author.trim()) {
            const ref = new RegExp(`${filter.author}`, 'gi')

            if(!e.author.match(ref)) {
                return false
            }
        }

        if(filter.dateFrom && filter.dateTo) {
            const current = new Date(e.year)

            if(current < filter.dateFrom || current > filter.dateTo) {
                return false
            }
        } 

        if(filter.picture && !e.picture) {
            return false
        }

        return true
    }

    function compare(a, b) {
        switch (sortOptions.key) {
            case 'likes':
                if (a.likes.number > b.likes.number) return sortOptions.ascending ? 1 : -1; 
                if (a.likes.number === b.likes.number) return 0; 
                if (a.likes.number < b.likes.number) return sortOptions.ascending ? -1 : 1;
                break
            case 'date':
                if (a['year'] > b['year']) return sortOptions.ascending ? 1 : -1; 
                if (a['year'] === b['year']) return 0; 
                if (a['year'] < b['year']) return sortOptions.ascending ? -1 : 1;
                break
            case 'comments':
                if (a['comments'].length > b['comments'].length) return sortOptions.ascending ? 1 : -1; 
                if (a['comments'].length === b['comments'].length) return 0; 
                if (a['comments'].length < b['comments'].length) return sortOptions.ascending ? -1 : 1;
                break
            default:
                if (a[sortOptions.key] > b[sortOptions.key]) return sortOptions.ascending ? 1 : -1; 
                if (a[sortOptions.key] === b[sortOptions.key]) return 0; 
                if (a[sortOptions.key] < b[sortOptions.key]) return sortOptions.ascending ? -1 : 1;
        }
    }

    return (
        <>
            {collection &&
            <>
                <Link to={`/collections?id=${collection.owner}`}>All collections</Link>

                <div className="d-flex flex-column align-items-center">
                    <h2>{collection.title}</h2>
                    <h3 className="badge badge-primary">{collection.topic}</h3>
                    <ReactMarkdown source={collection.description}/>
                </div>
                <div className="row">
                    <Sort/>
                    <Filter filter={filter} setFilter={setFilter}/>
                </div>
                <div className="d-flex justify-content-around flex-wrap">
                    {items.filter(filterOptions).sort(compare).map((e) => <Item key={e._id} itemProps={e} collectionId={id}/>)}
                    {userData.user && (userData.user.id === collection.owner || userData.user.userRole === 'admin') 
                    && <AddItem comments={collection.comments} author={collection.author} year={collection.year} id={id}/>}
                    <Modal />
                </div>
            </>
            }
        </>
    )
}

const mapStateToProps = state => state.userData;

export default connect(mapStateToProps, null)(Collection)
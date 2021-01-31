import React from 'react'
import * as Icon from 'react-bootstrap-icons'

import Modal from './AddCollectionModal'

import './BtnAddCollection.scss'

function BtnAddCollection({ styles }) {
    return (
        <>
            <div className="card add-collection bg-light text-primary" data-toggle="modal" data-target="#addCollection" style={{width: '12rem', ...styles}}>
                <div className="card-body d-flex justify-content-center align-items-center" style={{height: '15rem'}}>
                    <span><Icon.PlusCircle height={'50px'} width={'50px'}/></span>
                </div>
            </div>

            <Modal/>
        </>
    )
}

export default BtnAddCollection
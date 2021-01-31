import React, { useRef } from 'react'
import * as Icon from 'react-bootstrap-icons'

import AddModal from './AddItemModal'

import './AddItem.scss'

function AddItem(props) {
    const card = useRef()

    return (
        <>
            <div ref={card} className="card add-item bg-light" data-toggle="modal" data-target="#addItem" style={{width: '12rem'}}>
                <div className="card-body d-flex justify-content-center align-items-center" style={{height: '15rem'}}>
                    <span><Icon.PlusCircle height={'50px'} width={'50px'}/></span>
                </div>
            </div>

            <AddModal {...props}/>
        </>
    )
}

export default AddItem
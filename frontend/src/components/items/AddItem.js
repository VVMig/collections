import React, { useRef } from 'react'
import * as Icon from 'react-bootstrap-icons'
import $ from 'jquery'

import Modal from './AddItemModal'

import './AddItem.css'

function AddItem(props) {
    const card = useRef()

    function hover() {
        $(card.current).toggleClass('border-primary')
    }

    return (
        <>
            <div ref={card} className="card add-item bg-light" data-toggle="modal" data-target="#addItem" onMouseEnter={hover} onMouseLeave={hover} style={{width: '12rem'}}>
                <div className="card-body d-flex justify-content-center align-items-center" style={{height: '15rem'}}>
                    <span><Icon.PlusCircle height={'50px'} width={'50px'}/></span>
                </div>
            </div>

            <Modal {...props}/>
        </>
    )
}

export default AddItem
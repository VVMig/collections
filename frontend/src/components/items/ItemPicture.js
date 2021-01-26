import React from 'react'
import * as Icon from 'react-bootstrap-icons'

import './ItemPicture.css'

function ItemPicture({ picture, className, styles }) {
    return (
        <div className={className}>
            {picture ? 
            <div className="item-picture" style={{backgroundImage: `url(${picture})`, ...styles}}>
            </div>:
            <div className="item-picture"  style={styles}>
                <Icon.Image size={30}/>
            </div>
            }
        </div>
    )
}

export default ItemPicture
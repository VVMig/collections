import React from 'react'
import * as Icon from 'react-bootstrap-icons'

import './MainPicture.scss'

function MainPicture({ picture, className, styles }) {
    return (
        <div className={className}>
            {picture ? 
            <div className="main-picture" style={{backgroundImage: `url(${picture})`, ...styles}}>
            </div>:
            <div className="main-picture"  style={styles}>
                <Icon.Image size={30}/>
            </div>
            }
        </div>
    )
}

export default MainPicture
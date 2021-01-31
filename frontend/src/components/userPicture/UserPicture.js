import React from 'react'

import './UserPicture.css'

function UserPicture({ picture, name, styles }) {

    return (
        <>
            {picture ? 
                <div className="user-picture" style={{backgroundImage: `url(${picture})`, ...styles}}></div> :
                name && <div className="user-picture text-uppercase" style={{...styles}}>{name[0]}</div>
            } 
        </>                                   
    )
}

export default UserPicture
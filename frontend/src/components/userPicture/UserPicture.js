import React from 'react'

import './UserPicture.css'

function UserPicture({ picture, name }) {

    return (
        <>
            {picture ? 
                <div className="user-picture" style={{backgroundImage: `url(${picture})`}}></div>:
                <div className="user-picture text-uppercase">{name[0]}</div>
            } 
        </>                                   
    )
}

export default UserPicture
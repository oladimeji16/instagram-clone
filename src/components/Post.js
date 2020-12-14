import React from 'react'
import Avatar from '@material-ui/core/Avatar';

import './Post.css'

function Post({ imgUrl, username, caption }) {
    return (
        <div className='post'>
            <div className="post__header">
                <Avatar
                    className='post__avatar'
                    alt='Dee11'
                    src='/static/images/avatar/1.jpg'
                />
                <h3>{username}</h3>
            </div>

            <img className='post__image'
                src={imgUrl}
                alt="" />
            {/* image */}

            <h4 className='post__text'><strong>{username}</strong>  {caption}</h4>
            {/* username + caption */}
        </div>
    )
}

export default Post

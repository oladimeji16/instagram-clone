import React, { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar';

import './Post.css'
import { db } from '../firebase';
import firebase from 'firebase'

function Post({ imgUrl, userCommented, username, caption, postId }) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "desc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                })
        }
        return () => {
            unsubscribe()
        }
    }, [postId])

    const postComment = (e) => {
        e.preventDefault()

        db.collection('posts').doc(postId)
            .collection('comments')
            .add({
                text: comment,
                username: userCommented.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })

        setComment('')
    }

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

            <h4 className='post__text'><strong>{username}</strong>  {caption}</h4>

            <div className="posts__comments">
                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }
            </div>

            {
                userCommented && (
                    <form className="post__commentBox">
                        <input type="text"
                            className='post__input'
                            placeholder='Comment'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            className='post__button'
                            type="submit"
                            disabled={!comment}
                            onClick={postComment}>
                            Post
                        </button>
                    </form>
                )
            }

        </div>
    )
}

export default Post

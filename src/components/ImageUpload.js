import React, { useState } from 'react'

import firebase from 'firebase'

import Button from '@material-ui/core/Button'
import { db, storage } from '../firebase'

function ImageUpload({username}) {
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState('')

    const handleChange = e => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                //progress frunction...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },
            (err) => {
                //error function here
                console.log(err.message);
                alert(err.message);
            },
            () => {
                // complete function here
                storage.ref('images')
                .child(image.name)
                .getDownloadURL()
                .then( url => {
                    //post img into db
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    })

                    setProgress(0)
                    setCaption('')
                    setImage(null)
                })
            }
        )
    }

    return (
        <div>
            <h1>Create a Post</h1>
            <progress value={progress} max='100'/>
            <input type="text"
                placeholder='Enter a Caption'
                onChange={e => setCaption(e.target.value)}
                value={caption} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}> 
                Upload
            </Button>

        </div>
    )
}

export default ImageUpload

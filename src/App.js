import { Button, Input, makeStyles, Modal } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import ImageUpload from './components/ImageUpload'

import './App.css';

import Post from './components/Post';
import { auth, db } from './firebase'

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`

  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxshadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

function App() {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle);
  const [openSignIn, setOpenSignIn] = useState(false)
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser)
      } else {
        setUser(null)
      }
    })
    return () => {
      //perform clean up action 
      unsubscribe();
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })


  }, [])

  const signUp = (event) => {
    event.preventDefault()

    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((err) => alert(err.message))

    setOpen(false)


  }
  const signIn = (e) => {
    e.preventDefault()

    auth.signInWithEmailAndPassword(email, password)
      .catch(err => alert(err.message))
    setOpenSignIn(false)
  }
  return (
    <div className="App">
      {/* caption input */}
      {/* file picker */}
      {/* Post Button */}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
            <center>
              <img
                className='app__headerImage'
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder='Username'
              value={username}
              type='text'
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder='E-mail'
              value={email}
              type='text'
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='Password'
              value={password}
              type='password'
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type='submit' onClick={signUp}>Sign up</Button>
          </form>

        </div>

      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
            <center>
              <img
                className='app__headerImage'
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder='E-mail'
              value={email}
              type='text'
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='Password'
              value={password}
              type='password'
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type='submit' onClick={signIn}>Sign In</Button>
          </form>

        </div>

      </Modal>

      <div className="app__header">
        <img
          className='app__headerImage'
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />

        {
          user ? (
            <Button
              onClick={() => auth.signOut()}
            >Log Out</Button>
          ) : (
              <div className="app__loginContainer">
                <Button
                  onClick={() => setOpenSignIn(true)}
                >Sign In</Button>
                <Button
                  onClick={() => setOpen(true)}
                >Sign Up</Button>
              </div>
            )
        }
      </div>
      {
        posts.map(({ id, post }) => (
          <Post
            key={id}
            username={post.username}
            caption={post.caption}
            imgUrl={post.imgUrl}
          />
        ))
      }

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
          <h3>Sorry you need to log In to upload</h3>
        )}
    </div>
  );
}

export default App;

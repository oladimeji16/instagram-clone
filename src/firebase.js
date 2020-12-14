import firebase from 'firebase'

const firebaseApp = firebase.initializeApp ({
    apiKey: "AIzaSyD0nU19QsststQFDbKkgZMG6xYyr7Dx3ME",
    authDomain: "instagram-clone-a6d88.firebaseapp.com",
    projectId: "instagram-clone-a6d88",
    storageBucket: "instagram-clone-a6d88.appspot.com",
    messagingSenderId: "472376501181",
    appId: "1:472376501181:web:6b0b95fcd4e0f289a128d4",
    measurementId: "G-CTX30J1WH5"
});

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()



export { db, auth, storage }

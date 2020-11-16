const functions = require('firebase-functions');
const admin  = require('firebase-admin');
const app = require('express')();

admin.initializeApp(); 

const firebaseConfig = {
    apiKey: "AIzaSyA_mqKru6CVVUrj5-3gyNnlAYXGW9C0y-Q",
    authDomain: "socialape-a4f9a.firebaseapp.com",
    databaseURL: "https://socialape-a4f9a.firebaseio.com",
    projectId: "socialape-a4f9a",
    storageBucket: "socialape-a4f9a.appspot.com",
    messagingSenderId: "247009183041",
    appId: "1:247009183041:web:35892ac09001c6b4144dc0",
    measurementId: "G-ZNLJ5511WP"
  };


const firebase = require('firebase');
firebase.initializeApp(firebaseConfig); 

const db = admin.firestore(); 

app.get('/screams', (req, res) => {
    db
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
        let screams = [];
        data.forEach ((doc) => {
            screams.push({
                screamId: doc.id,
                body: doc.data().body, 
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt
            }); 
        });
        return res.json(screams);
    })
    .catch((err) => console(err));
});

app.post('/scream', (req, res) =>{
    
    const newScream = {
        body: req.body.body, 
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

    db
    .collection('screams')
    .add(newScream)
    .then(doc => {
        res.json({message: `document ${doc.id} created successfully` });

    })
    .catch(err => {
        res.status(500).json({error: 'something went wrong!!'});
        console.error(err)
    });
});

// Sign up Route 

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email, 
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.password,
    }

// Validate data 

db.doc(`/users/${newUser.handle}`).get()
.then(doc => {
    if(doc.exists){
        return res.status(400).json({ handle: 'this handle is already taken'});
    } else{
      return firebase
       .auth()
       .createUserWithEmailAndPassword(newUser.email, newUser.password) 
    }
})
.then(data => { 
    return data.user.getIdToken()
})
.then(token => {
    return res.status(201).json({token}); 
})
.catch(err => {
    console.error(err); 
    return res.status(500).json({error: err.code}); 
    });
});

exports.api = functions.https.onRequest(app); 

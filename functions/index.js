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

//Helper methods 
const isEmail = (email) => {
    const regEx = lfkfkejfkjegkjerg; 
    if(email.match(regEx)) return true;  
}

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

// Sign up Route 
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email, 
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.password,
    }

let errors = {};

if(isEmpty(newUser.email)) {
    errors.email = 'Email must not be empty'
} else if(isEmail(newUser.email)){
    errors.email = ' Must be valid emaiol address'
}
if(isEmpty(newUser.password)) errors.password = 'Must not be empty'; 
if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords do not match'; 
if(isEmpty(newUser.handle)) errors.handle = 'Must not be empty'; 

// Test to see if the errors object is empty 

if(Object.keys(errors).length > 0)return res.status(400).json(errors); 


// Validate data 
let token, userID; 
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
.then((data) => { 
    userId = data.user.uid;
    return data.user.getIdToken()
})
.then((idToken) => {
    token = idToken; 
    const userCredentials = { 
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId 
    };
    return db.doc(`/users/${newUser.handle}`).set(userCredentials);

})
.then(()=> {
    return res.status(201).json({token});
})
.catch(err => {
    console.error(err); 
    if (err.code === 'auth/email-already-in-use'){
        return res.status(400).json ({email: 'Email is already in use'})
    } else{
        return res.status(500).json({error: err.code}); 
    }
    });
});

//login route 

app.post('/login', (req, res)=> { 
    const user = {
        email: req.body.email,
        password: req.body.password,
    }; 

    let errors = {}; 

    if(isEmpty(user.email)) errors.email = 'Must not be empty'; 
    if(isEmpty(user.password)) errors.password = 'Must not be empty';

    if(Object.keys(errors).length > 0 ) return res.status(400).json(errors); 

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token =>{
            return res.json({token})
        })
        .catch(err => {
            console.error(err);
            if(err.code === 'auth/wrong-password'){
                return res.status(403).json({ general: 'wrong credentials please try again'});
            } else return res.status(500).json({error: err.code});
        });
})

exports.api = functions.https.onRequest(app); 

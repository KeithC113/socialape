const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth'); 

const { getAllScreams, postOneScream } = require('./handlers/screams'); 

const { signUp, login, uploadImage } = require('./handlers/users'); 


// Scream routes
app.get('/screams',getAllScreams);
app.post('/scream', FBAuth, postOneScream); 

// Users routes 
app.post('/signup', signUp);
app.post('/login', login)
app.post('/user/imgae', FBAuth, uploadImage)




const functions = require('firebase-functions');

const app = require('express')();

const fbAuth = require('./util/fbAuth'); 

const { getAllScreams, postOneScream } = require('./handlers/screams'); 

const { signUp, login} = require('./handlers/users'); 


// Scream routes
app.get('/screams',getAllScreams);
app.post('/scream', fbAuth, postOneScream); 

// Users routes 
app.post('/signup', signUp);
app.post('/login', login)


exports.api = functions.https.onRequest(app); 

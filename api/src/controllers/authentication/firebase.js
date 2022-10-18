
// ####################################
// ###### USELESS FOR THE MOMENT ######
// ####################################

// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const { 
    FB_API_KEY,
    FB_AUTH_DOMAIN,
    FB_PROJECT_ID,
    FB_STORAGE_BUCKET,
    FB_MESSAGING_SENDER_ID,
    FB_APP_ID 
} = process.env

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FB_API_KEY,
  authDomain: FB_AUTH_DOMAIN,
  projectId: FB_PROJECT_ID,
  storageBucket: FB_STORAGE_BUCKET,
  messagingSenderId: FB_MESSAGING_SENDER_ID,
  appId: FB_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const emailVerify = async() => {
    let actionCodeSettings = {
        url: 'https://www.example.com/?email=' + firebase.auth().currentUser.email,
        iOS: {
          bundleId: 'com.example.ios'
        },
        android: {
          packageName: 'com.example.android',
          installApp: true,
          minimumVersion: '12'
        },
        handleCodeInApp: true,
        dynamicLinkDomain: "example.page.link"
    };
    
    firebase.auth().currentUser.sendEmailVerification(actionCodeSettings)
        .then(function() {
            // Verification email sent.
            console.log('\u2705 email sent with Firebase to: ', firebase.auth().currentUser.email)
        })
        .catch(function(error) {
            // Error occurred. Inspect error.code.
            console.log('\u274C error at Firebase:', error)
        });
}

module.exports = { emailVerify }
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "firebase/app";

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
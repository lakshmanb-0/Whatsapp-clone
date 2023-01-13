import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBDdFLZalFYzXwkfpwIq-4mXLxN75ZQgsQ",
    authDomain: "whatsapp-91.firebaseapp.com",
    projectId: "whatsapp-91",
    storageBucket: "whatsapp-91.appspot.com",
    messagingSenderId: "794116941268",
    appId: "1:794116941268:web:8b69133ff20d40f252e241",
    measurementId: "G-G5Q9WE4YD9"
};

const app = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
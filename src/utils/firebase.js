import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyD5CNpL44AIPPeeaOxpFoTvVkynYxUEjj0",
  authDomain: "vibe-base.firebaseapp.com",
  projectId: "vibe-base",
  storageBucket: "vibe-base.appspot.com",
  messagingSenderId: "55440394405",
  appId: "1:55440394405:web:125b96d665f216ed75a54c",
  measurementId: "G-8BE91RDCRC",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };

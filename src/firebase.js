import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

var firebaseConfig = {
  "apiKey": "AIzaSyA6U4d_vZcmWLpxDIsrd_dlfSnFRhuUAkE",
  "authDomain": "reactgram-8e945.firebaseapp.com",
  "projectId": "reactgram-8e945",
  "storageBucket": "reactgram-8e945.appspot.com",
  "messagingSenderId": "671946630551",
  "appId": "1:671946630551:web:17c3059698600aab7610d2"
};

// Get a Firestore instance
export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.firestore()
export const auth = firebaseApp.auth()
export const storage = firebaseApp.storage()

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { Timestamp, GeoPoint, FieldValue } = firebase.firestore
export { Timestamp, GeoPoint, FieldValue }

// if using Firebase JS SDK < 5.8.0
// db.settings({ timestampsInSnapshots: true })
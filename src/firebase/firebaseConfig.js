// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {getFirestore, setDoc, doc} from 'firebase/firestore';
import {getStorage, ref} from 'firebase/storage';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA1GUnGfFb4hhkZm831WsPZ4NxU0f0uaYw',
  authDomain: 'school-system-c02e8.firebaseapp.com',
  databaseURL: 'https://school-system-c02e8-default-rtdb.firebaseio.com',
  projectId: 'school-system-c02e8',
  storageBucket: 'school-system-c02e8.appspot.com',
  messagingSenderId: '205349103086',
  appId: '1:205349103086:web:88b280053788b79e711aff',
  measurementId: 'G-YGWVL3Y83Q',
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

const storage = getStorage(FIREBASE_APP);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export {storage, firestore, firebase};
//create a second app
const secondaryApp = initializeApp(firebaseConfig, 'secondary');
// const analytics = getAnalytics(app);

export const signUp = async (email, password, role) => {
  console.log('sssssssssssssssss', email, password, role);
  try {
    secondaryApp
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async function (firebaseUser) {
        console.log('User ' + firebaseUser.uid + ' created successfully!');
        await setDoc(doc(FIREBASE_DB, 'users', firebaseUser.uid), {
          email,
          role,
        });
        //I don't know if the next statement is necessary
        secondaryApp.auth().signOut();
      });
    // const userCredential = await createUserWithEmailAndPassword(
    //   email,
    //   password,
    // );
    // const user = userCredential.user;
    // console.log('User signed up:', user);

    // Save the user role in Firestore
    console.log('User signed up and role assigned:', role);
  } catch (error) {
    console.error('Error signing up:', error);
  }
};

// import {handleUpdateMarks} from '../utils/updateMarks';
// handleUpdateMarks(
//   'Class 5',
//   1122,
//   2023,
//   {
//     English: {
//       firstTerm: 0,
//       midTerm: 0,
//       finalTerm: 0,
//     },
//     'Computer (Part 1)': {
//       firstTerm: 50,
//       midTerm: 100,
//       finalTerm: 10,
//     },
//     'Computer (Part 2)': {
//       firstTerm: 50,
//       midTerm: 100,
//       finalTerm: 10,
//     },
//     Islamiat: {
//       firstTerm: 50,
//       midTerm: 100,
//       finalTerm: 10,
//     },
//     Math: {
//       firstTerm: 50,
//       midTerm: 100,
//       finalTerm: 10,
//     },
//     'Social Study': {
//       firstTerm: 50,
//       midTerm: 100,
//       finalTerm: 10,
//     },
//     Urdu: {
//       firstTerm: 50,
//       midTerm: 100,
//       finalTerm: 10,
//     },
//     'General Knowledge': {
//       firstTerm: 50,
//       midTerm: 100,
//       finalTerm: 10,
//     },
//   },
//   'average performance',
// );

// // Example usage
// signUp('admin@admin.com', 'admin123', 'admin');

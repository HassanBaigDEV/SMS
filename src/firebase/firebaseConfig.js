// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {getFirestore, setDoc, doc} from 'firebase/firestore';

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
// const analytics = getAnalytics(app);

// async function signUp(email, password, role) {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(
//       FIREBASE_AUTH,
//       email,
//       password,
//     );
//     const user = userCredential.user;
//     console.log('User signed up:', user);

//     // Save the user role in Firestore
//     await setDoc(doc(FIREBASE_DB, 'users', user.uid), {email, role});
//     console.log('User signed up and role assigned:', role);
//   } catch (error) {
//     console.error('Error signing up:', error);
//   }
// }

// // Example usage
// signUp('admin@admin.com', 'admin123', 'admin');

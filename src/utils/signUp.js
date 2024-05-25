// Import the functions you need from the SDKs you need

import {createUserWithEmailAndPassword} from 'firebase/auth';
import {setDoc, doc} from 'firebase/firestore';
import {FIREBASE_AUTH, FIREBASE_DB} from '../firebase/firebaseConfig';

export const signUp = async (email, password, role) => {
  console.log('sssssss-----------s');
  try {
    const userCredential = await createUserWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password,
    );
    const user = userCredential.user;
    console.log('User signed up:', user);

    // Save the user role in Firestore
    await setDoc(doc(FIREBASE_DB, 'users', user.uid), {email, role});
    console.log('User signed up and role assigned:', role);
  } catch (error) {
    console.error('Error signing up:', error);
  }
};

// Example usage

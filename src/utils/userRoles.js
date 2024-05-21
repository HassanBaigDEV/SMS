import {FIREBASE_AUTH, FIREBASE_DB} from '../firebaseConfig';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';

const createUserWithRole = async (email, password, role) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password,
    );
    const user = userCredential.user;
    await setDoc(doc(FIREBASE_DB, 'users', user.uid), {
      email: email,
      role: role,
    });
    console.log('User created with role:', role);
  } catch (error) {
    console.error('Error creating user with role:', error);
  }
};

export default createUserWithRole;

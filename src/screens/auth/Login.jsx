// screens/AdminLogin.js
import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {FIREBASE_AUTH, FIREBASE_DB} from '../../firebase/firebaseConfig';
import {signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore';
import 'firebase/firestore';

const Login = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, user => {
      console.log('USER IS STILL LOGGED IN: ', user);
      if (user) {
        setUser(user);
      }
    });
  }, [user]);

  // useEffect(() => {
  //   const adminData = {
  //     name: 'Admin Name',
  //     email: 'admin@example.com',
  //     role: 'admin',
  //   };

  //   firebase
  //     .firestore()
  //     .collection('admins')
  //     .doc('admin1')
  //     .set(adminData)
  //     .then(() => {
  //       console.log('Admin data added successfully.');
  //     })
  //     .catch(error => {
  //       console.error('Error adding admin data: ', error);
  //     });
  // }, []);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password,
      );
      setUser(userCredential.user);
      const uid = userCredential.user.uid;
      console.log('User signed in:', user);
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', uid));

      const userData = userDoc.data();
      if (userDoc.exists()) {
        // navigation.navigate('AdminDashboard');

        console.log('userRole:', userData);
        if (userData.role === 'admin') {
          // Admin-specific logic
          console.log('Welcome, Admin!');
          navigation.navigate('AdminDashboard');
        } else {
          // Normal user logic
          console.log('Welcome, User!');
        }
      } else {
        alert('user not found');
      }
      // const user = userCredential.user;

      // // Check user role in Firestore
      // const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
      // console.log(userDoc);
      // if (userDoc.exists()) {
      //   const userData = userDoc.data();
      //   // if (userData.role === 'admin') {
      //   navigation.navigate('AdminDashboard');
      //   // } else {
      //   //   alert('Access denied: You do not have admin privileges.');
      //   // }
      // } else {
      //   alert('User does not exist.');
      // }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default Login;

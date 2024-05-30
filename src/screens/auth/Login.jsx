import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ToastAndroid,
} from 'react-native';
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

  const handleLogin = async () => {
    ToastAndroid.show('Logging in...', ToastAndroid.SHORT);
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
        console.log('userRole:', userData);
        if (userData.role === 'admin') {
          console.log('Welcome, Admin!');
          ToastAndroid.show('Welcome!', ToastAndroid.SHORT);
          navigation.navigate('AdminDashboard');
        } else if (userData.role === 'student') {
          Alert.alert("You don't have permission to access this page");
        } else if (userData.role === 'teacher') {
          Alert.alert("You don't have permission to access this page");
        }
      } else {
        // Alert.alert('Error', 'User not found');
        // console.error('User not found');
        ToastAndroid.show('User not found', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Login Error:', error);
      // Alert.alert('Error', 'Login failed. Please check your credentials.');
      ToastAndroid.show(
        'Login failed. Please check your credentials.',
        ToastAndroid.SHORT,
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  loginBox: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333',
  },
  input: {
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Login;

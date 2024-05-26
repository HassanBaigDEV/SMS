import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView, Image } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import schoolIcon1 from '../../images/image2-nobg.png';

const StudentLogin = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [registrationNumberFocused, setRegistrationNumberFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, user => {
      if (user) {
        setUser(user);
      }
    });
  }, [user]);

  const handleLogin = async () => {
    try {
      console.log('Attempting to sign in with:', registrationNumber + '@school.com', password);
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        registrationNumber + '@student.com',
        password
      );
      setUser(userCredential.user);
      const user = userCredential.user;
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(FIREBASE_DB, 'students', registrationNumber));
      const studentRole = await getDoc(doc(FIREBASE_DB, 'users', uid));
      // console.log(studentRole.data().role);
      // console.log(userDoc.data());
      // console.log(studentRole.data());
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('userData:', userData);
        // Update user object with additional properties
        // user.userData = userData;
        // user.studentName = userData.studentName;
        // user.registrationNumber = userData.registrationNumber;
        if (studentRole.data().role === 'student') {
          navigation.navigate('StudentDashboard', { user: userData });
        } else {
          Alert.alert('Access denied', 'You do not have student privileges.');
        }
      } else {
        Alert.alert('Error', 'User not found.');
      }
    } catch (error) {
      console.log('Error signing in:', error.message);
      Alert.alert('Login failed', 'Please check your credentials.');
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.topContainer}>
        <Image
          source={schoolIcon1}
          style={styles.icon}
        />
        <Text style={styles.appTitle}>SCHOOL MANAGEMENT APP</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>STUDENT LOGIN</Text>
        <TextInput
          style={[styles.input, registrationNumberFocused && styles.inputFocused]}
          placeholder="Registration Number"
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
          keyboardType="default"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          onFocus={() => setRegistrationNumberFocused(true)}
          onBlur={() => setRegistrationNumberFocused(false)}
        />
        <TextInput
          style={[styles.input, passwordFocused && styles.inputFocused]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#aaa"
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000000', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333', 
    marginTop: 20,
    textAlign: 'center',
    textShadowColor: '#aaa',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: '20%',
  },  
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    padding: 20,
    marginBottom: 50,
    borderRadius: 10,
    backgroundColor: 'rgba(211, 211, 211, 0.9)',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50, 
  },
  icon: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  container: {
    width: '80%',
    backgroundColor: 'rgba(211, 211, 211, 0.9)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 50, 
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333', 
    marginTop: 20,
    textAlign: 'center',
    textShadowColor: '#aaa',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  inputFocused: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: '5%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default StudentLogin;

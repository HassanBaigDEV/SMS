import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground, Image } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase/firebaseConfig';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import 'firebase/firestore';
import schoolIcon from '../../images/image1.png';

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
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        registrationNumber + '@school.com', // assuming the registration number is used as part of the email
        password
      );
      setUser(userCredential.user);
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', uid));

      const userData = userDoc.data();
      if (userDoc.exists()) {
        if (userData.role === 'student') {
          navigation.navigate('StudentDashboard');
        } else {
          Alert.alert('Access denied', 'You do not have student privileges.');
        }
      } else {
        Alert.alert('Error', 'User not found.');
      }
    } catch (error) {
      Alert.alert('Login failed', 'Please check your credentials.');
    }
  };

  return (
    <ImageBackground
      source={schoolIcon}
      style={styles.background}
    >
      <View style={styles.iconContainer}>
        <Image
          source={schoolIcon}
          style={styles.icon}
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Student Login</Text>
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50, // Adjust as needed
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
    marginBottom: 50, // Adjust as needed
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default StudentLogin;

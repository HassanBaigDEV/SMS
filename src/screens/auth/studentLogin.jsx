import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {FIREBASE_AUTH, FIREBASE_DB} from '../../firebase/firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import schoolIcon1 from '../../images/image2-nobg.png';

const StudentLogin = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [registrationNumberFocused, setRegistrationNumberFocused] =
    useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, user => {
      if (user) {
        setUser(user);
      }
    });
  }, [user]);


  

  const handleLogin = async () => {
    try {
      console.log('Attempting to sign in with:', registrationNumber + '@student.com', password);
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        registrationNumber + '@student.com',
        password,
      );
      setUser(userCredential.user);
      const user = userCredential.user;
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(
        doc(FIREBASE_DB, 'students', registrationNumber),
      );
      const studentRole = await getDoc(doc(FIREBASE_DB, 'users', uid));
      // console.log(studentRole.data().role);
      // console.log(userDoc.data());
      // console.log(studentRole.data());
      var userData = userDoc.data();

      if (userDoc.exists()) {
        console.log('userData:', userData);
        if (studentRole.data().role === 'student') {
          setShowLogoutModal(true);
        } else {
          Alert.alert('Access denied', 'You do not have student privileges.');
        }
      } else {
        Alert.alert('Error', 'User not found.');
      }
    } 
    
    
    
    catch (error) {
      console.log('Error signing in:', error.message);
      Alert.alert('Login failed', 'Please check your credentials.');
    } finally {
      setTimeout(() => {
        setShowLogoutModal(false);
        navigation.navigate('StudentDashboard', {user: userData});
      }, 2000);
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.topContainer}>
        <Image source={schoolIcon1} style={styles.icon} />
        <Text style={styles.appTitle}>STELLAR TACTFUL EDU</Text>
        <Text style={styles.tagline}>
          Navigating Brilliance, Building Futures
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>STUDENT LOGIN</Text>
        <TextInput
          style={[
            styles.input,
            registrationNumberFocused && styles.inputFocused,
          ]}
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

      {/* Loading Modal */}
      <Modal visible={showLogoutModal} transparent={false} animationType="fade">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>LOGGING IN...</Text>
        </View>
      </Modal>
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
    flex: 0.5,
    alignItems: 'center',
    fontFamily: 'Arial',
  },
  tagline: {
    fontSize: 16,
    color: '#ddd', // Light gray
    textAlign: 'center',
    fontFamily: 'serif',
    fontStyle: 'italic', // Apply italic style
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff', // White
    textAlign: 'center',
    textShadowColor: '#aaa',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
    marginBottom: 10,
  },
  bottomContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    padding: 20,
    marginTop: '25%',
    marginBottom: '10%',
    borderRadius: 10,
    backgroundColor: 'rgba(211, 211, 211, 0.9)',
  },
  icon: {
    width: 250,
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
    textShadowOffset: {width: 2, height: 2},
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '100%',
  },
  loadingText: {
    marginTop: 10,
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default StudentLogin;

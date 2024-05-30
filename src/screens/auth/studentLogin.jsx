import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ToastAndroid,
  Image,
  Modal,
  Animated,
} from 'react-native';
import {FIREBASE_AUTH, FIREBASE_DB} from '../../firebase/firebaseConfig';
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import schoolIcon1 from '../../images/image2-nobg.png';
import 'firebase/firestore';

const StudentLogin = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registrationNumberFocused, setRegistrationNumberFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;
  const emailPlaceholderAnim = useRef(new Animated.Value(0)).current;
  const passwordPlaceholderAnim = useRef(new Animated.Value(0)).current;


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
      setEmail(registrationNumber+'@student.com');
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

  const handleFocus = (anim, placeholderAnim) => {
    Animated.parallel([
      Animated.timing(anim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(placeholderAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleBlur = (anim, placeholderAnim, value) => {
    if (!value) {
      Animated.parallel([
        Animated.timing(anim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(placeholderAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const borderColor = anim =>
    anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#cccccc', '#007bff'],
    });

  const placeholderTranslateY = anim =>
    anim.interpolate({
      inputRange: [0, 1],
      outputRange: [22, -10],
    });

  const placeholderFontSize = anim =>
    anim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    });




  return (
    // 
    <View style={styles.container}>
      <Image
        source={require('../../images/image2-nobg.png')}
        style={styles.logo}
      />
      <View style={styles.loginBox}>
        <View style={styles.inputContainer}>
          <Animated.Text
            style={[
              styles.placeholder,
              {
                transform: [
                  {translateY: placeholderTranslateY(emailPlaceholderAnim)},
                ],
                fontSize: placeholderFontSize(emailPlaceholderAnim),
              },
            ]}>
            Email
          </Animated.Text>
          <Animated.View
            style={{
              borderBottomColor: borderColor(emailBorderAnim),
              borderBottomWidth: 2,
            }}>
            <TextInput
              style={styles.input}
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => handleFocus(emailBorderAnim, emailPlaceholderAnim)}
              onBlur={() =>
                handleBlur(emailBorderAnim, emailPlaceholderAnim, email)
              }
            />
          </Animated.View>
        </View>
        <View style={styles.inputContainer}>
          <Animated.Text
            style={[
              styles.placeholder,
              {
                transform: [
                  {translateY: placeholderTranslateY(passwordPlaceholderAnim)},
                ],
                fontSize: placeholderFontSize(passwordPlaceholderAnim),
              },
            ]}>
            Password
          </Animated.Text>
          <Animated.View
            style={{
              borderBottomColor: borderColor(passwordBorderAnim),
              borderBottomWidth: 2,
            }}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() =>
                handleFocus(passwordBorderAnim, passwordPlaceholderAnim)
              }
              onBlur={() =>
                handleBlur(
                  passwordBorderAnim,
                  passwordPlaceholderAnim,
                  password,
                )
              }
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
              onPressOut={() => setShowPassword(false)}>
              <Image
                source={
                  !showPassword
                    ? require('../../assets/icons/pwd_eye.png')
                    : require('../../assets/icons/hide_pwd_eye.png')
                }
                style={styles.eyeIconImage}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
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
  logo: {
    width: 320,
    height: 320,
    justifyContent: 'flex-start',
    alignSelf: 'center',
    resizeMode: 'contain',
    tintColor: '#000',
  },
  loginBox: {
    borderRadius: 10,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    height: 50,
    paddingHorizontal: 12,
    borderRadius: 30,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  placeholder: {
    position: 'absolute',
    left: 16,
    color: '#999',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  eyeIconImage: {
    width: 24,
    height: 24,
    tintColor: '#999',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StudentLogin;

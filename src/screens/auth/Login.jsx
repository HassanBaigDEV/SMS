import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ToastAndroid,
  Image,
  Animated,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {FIREBASE_AUTH, FIREBASE_DB} from '../../firebase/firebaseConfig';
import {signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from 'firebase/firestore';
import 'firebase/firestore';

const Login = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;
  const emailPlaceholderAnim = useRef(new Animated.Value(0)).current;
  const passwordPlaceholderAnim = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   onAuthStateChanged(FIREBASE_AUTH, user => {
  //     console.log('USER IS STILL LOGGED IN: ', user);
  //     if (user) {
  //       setUser(user);
  //     }
  //   });
  // }, [user]);

  const getTeacherIdByEmail = async email => {
    try {
      // Reference to the teachers collection
      const teachersCollectionRef = collection(FIREBASE_DB, 'teachers');

      // Create a query against the collection where the email matches
      const q = query(teachersCollectionRef, where('email', '==', email));

      // Execute the query
      const querySnapshot = await getDocs(q);

      // Check if we got any results
      if (!querySnapshot.empty) {
        // Get the document (there should be only one match if emails are unique)
        const doc = querySnapshot.docs[0];
        const teacherId = doc.id; // This is the ID of the document
        const teacherData = doc.data(); // This is the data within the document

        console.log('Teacher ID:', teacherId);
        console.log('Teacher Data:', teacherData);

        return {teacherId, teacherData};
      } else {
        // No document found with the given email
        console.log('No teacher found with the given email.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching teacher ID by email:', error);
      return null;
    }
  };

  const handleLogin = async () => {
    ToastAndroid.show('Logging in...', ToastAndroid.SHORT);

    try {
      setShowLoginModal(true);
      // Authenticate user with email and password
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password,
      );
      const user = userCredential.user;
      setUser(user);

      // Log the signed-in user
      console.log('User signed in:', user);

      // Get user document from Firestore
      const uid = user.uid;
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', uid));
      const userData = userDoc.data();

      if (userDoc.exists()) {
        console.log('userRole:', userData);

        // Handle admin role
        if (userData.role === 'admin') {
          console.log('Welcome, Admin!');
          ToastAndroid.show('Welcome!', ToastAndroid.SHORT);
          // navigation.navigate('AdminDashboard');
          setShowLoginModal(false);
          navigation.navigate('AdminNavigator', {
            screen: 'AdminDashboard',
            params: {user: userData},
          });
        }
        // Handle student role
        else if (userData.role === 'student') {
          const studentEmailPrefix = email.split('@')[0];
          const studentDoc = await getDoc(
            doc(FIREBASE_DB, 'students', studentEmailPrefix),
          );

          if (studentDoc.exists()) {
            const studentData = studentDoc.data();
            console.log('Welcome, Student:', studentData);

            setShowLoginModal(false);
            ToastAndroid.show('Welcome!', ToastAndroid.SHORT);
            navigation.navigate('StudentNavigator', {
              screen: 'StudentDashboard',
              params: {user: studentData},
            });
          } else {
            setShowLoginModal(false);
            console.error('Student document not found');
            ToastAndroid.show('Student record not found.', ToastAndroid.SHORT);
          }
        }

        // Handle teacher role
        else if (userData.role === 'teacher') {
          const result = await getTeacherIdByEmail(email);
          const {teacherId, teacherData} = result;
          console.log('Teacher ID found:', teacherId);
          // const teacherDoc = await getDoc(
          //   doc(FIREBASE_DB, 'teachers', teacherData),
          // );

          if (teacherId !== null) {
            // const teacherData = teacherDoc.data();
            console.log('Welcome, Teacher:', teacherData);
            setShowLoginModal(false);
            ToastAndroid.show('Welcome!', ToastAndroid.SHORT);
            navigation.navigate('TeacherNavigator', {
              screen: 'TeacherDashboard',
              params: {teacher: teacherData},
            });
          } else {
            setShowLoginModal(false);
            console.error('Teacher document not found');
            ToastAndroid.show('Teacher record not found.', ToastAndroid.SHORT);
          }
        }
      } else {
        setShowLoginModal(false);
        ToastAndroid.show('User not found', ToastAndroid.SHORT);
      }
    } catch (error) {
      setShowLoginModal(false);
      console.error('Login Error:', error);
      ToastAndroid.show(
        'Login failed. Please check your credentials.',
        ToastAndroid.SHORT,
      );
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
      inputRange: [0, 5],
      outputRange: [16, 12],
    });

  return (
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
              value={email}
              onChangeText={setEmail}
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

      {/* Loading Modal */}
      <Modal visible={showLoginModal} transparent={false} animationType="fade">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>LOGGING IN...</Text>
        </View>
      </Modal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
  },
});

export default Login;

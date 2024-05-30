// import * as React from "react";
import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity , Alert, Modal, ActivityIndicator, KeyboardAvoidingView} from "react-native";
import { FontSize, Color, FontFamily, Border } from "../../../GlobalStyles";
import {FIREBASE_AUTH, FIREBASE_DB} from '../../firebase/firebaseConfig';
import {signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
import {doc, getDoc,getDocs, getFirestore, collection, query, where} from 'firebase/firestore';
import 'firebase/firestore';


const getTeacherIdByEmail = async (email) => {
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
      const teacherId = doc.id;  // This is the ID of the document
      const teacherData = doc.data(); // This is the data within the document

      console.log('Teacher ID:', teacherId);
      console.log('Teacher Data:', teacherData);
      
      return { teacherId, teacherData };
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

// Usage example within a React component
const TeacherLogin = ({ navigation }) => {
    const [user, setUser] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teacherId, setTeacherId] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, user => {
      if (user) {
        setUser(user);
      }
    });
  }, [user]);




  const handleLogin = async () => {
    console.log('Attempting to sign in with:', email, password);

    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);


      setUser(userCredential.user);



      //we got uid from the users collection
      const uid = userCredential.user.uid;

      // Fetch teacher ID by email
      const result = await getTeacherIdByEmail(email);

      //main if start
      if (result) {

        const { teacherId, teacherData } = result;
        console.log('Teacher ID found:', teacherId);

        //we got the teacherId from the teachers collection
        setTeacherId(teacherId);


        //getting the full teacher doc by teacherId
        const userDoc = await getDoc(doc(FIREBASE_DB, 'teachers', teacherId));
        //getiing the full user doc by uid
        const teacherRole = await getDoc(doc(FIREBASE_DB, 'users', uid))

        //just putting the teacher data in a variable
        var teacher_Data = userDoc.data();

        //nested if start
        if (userDoc.exists()) {

            //second nested if start
            if (teacherRole.data().role === 'teacher') {
              setShowLogoutModal(true); 
              console.log("login success")

              console.log(teacher_Data)

                setTimeout(() => {
                setShowLogoutModal(false);
                  navigation.navigate('TeacherDashboard', { teacher: teacher_Data });
                    }, 2000); 


            } 
            else 
            {
              Alert.alert('Access denied', 'You do not have student privileges.');
            }



          } //nested if end

          else 
          {
            Alert.alert('Error', 'User not found.');
          }




      //main if end
    } 
    
    
    } 
    catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Login failed', 'Please check your credentials.');
    }
  };



















  // return (
  //   <View style={styles.background}>
  //     <View style={styles.upperContainer}>
  //       <Image
  //         style={styles.graduationCapIcon}
  //         resizeMode="cover"
  //         source={require('../../assets/icons/graduation-cap.png')}
  //       />
  //     <Text style={[styles.aura, styles.auraTypo]}>Aura</Text>

  //     <Text style={[styles.signIn, styles.auraTypo]}>Sign In</Text>
  //       </View>
  //     <View style={[styles.bottomContainer]}>
  //     <Text style={[styles.phoneNumber, styles.textTypo]}>Email</Text>
  //     <View style={[styles.androidLarge1Item, styles.androidLayout]} />
  //      <TextInput
  //       style={[styles.text, styles.textInput]}
  //       placeholder="teacher123@teacher.com"
  //       value={email}
  //       onChangeText={setEmail}
  //       keyboardType="email-address"
  //       autoCapitalize="none"
  //       placeholderTextColor={Color.placeholderTextColor} // Set placeholder text color
  //     />
  //     <Text style={[styles.password, styles.textTypo]}>Password</Text>
  //    <View style={[styles.androidLarge1Inner, styles.androidLayout]} />
  //      <TextInput
  //       style={[styles.text2, styles.textInput]}
  //       placeholder="****"
  //       value={password}
  //       onChangeText={setPassword}
  //       keyboardType="visible-password"
  //       autoCapitalize="none"
  //       placeholderTextColor={Color.placeholderTextColor} // Set placeholder text color
  //     /> 
  //     <TouchableOpacity 
  //       style={styles.button}
  //       onPress={handleLogin}
  //       >
  //       <View style={[styles.rectangleView2, styles.androidLayout]}> 
  //       <Text style={styles.signIn2Typo}>Sign In</Text>  
  //       </View>
  //     </TouchableOpacity>
  //   </View>
  //   </View>
  // );


    return (
     
       
       
      
    <View style={styles.background}>
      <View style={styles.upperContainer}>
        <Image
          style={styles.graduationCapIcon}
          resizeMode="cover"
          source={require('../../assets/icons/graduation-cap.png')}
        />
        <Text style={[styles.aura, styles.auraTypo]}>Aura</Text>
        <Text style={[styles.signIn, styles.auraTypo]}>Sign In</Text>
      </View>
     
      <View style={styles.bottomContainer}>
        <Text style={[styles.phoneNumber, styles.textTypo]}>Email</Text>
        <View style={[styles.androidLarge1Item, styles.androidLayout]} />
        <TextInput
          style={[styles.text, styles.textInput]}
          placeholder="teacher123@teacher.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={Color.placeholderTextColor} // Set placeholder text color
        />
        <Text style={[styles.password, styles.textTypo]}>Password</Text>
        <View style={[styles.androidLarge1Inner, styles.androidLayout]} />
        <TextInput
          style={[styles.text2, styles.textInput]}
          placeholder="****"
          value={password}
          onChangeText={setPassword}
          keyboardType="visible-password"
          autoCapitalize="none"
          placeholderTextColor={Color.placeholderTextColor} // Set placeholder text color
        />

        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
        >
          <View style={[styles.rectangleView2, styles.androidLayout]}> 
            <Text style={styles.signIn2Typo}>Sign In</Text>  
          </View>
        </TouchableOpacity>
      </View>

      <Modal visible={showLogoutModal} transparent={false} animationType="fade">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>LOGGING IN...</Text>
        </View>
      </Modal>


    </View>
  );

};


const styles = StyleSheet.create({
  auraTypo: {
    // textAlign: "left",
    fontSize: FontSize.size_11xl_8,
    // position: "absolute",
  },
  androidLayout: {
    height: 47,
    width: 329,
    position: 'absolute',
  },
  textTypo: {
    color: Color.colorBlack,
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_sm,
    textAlign: 'left',
    position: 'absolute',
  },

  signIn1Typo: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_sm,
    // textAlign: "left",
    // position: "absolute",

  },

  upperContainer: {
  top: 0,
    left: 0,
    borderBottomRightRadius: 33, // Example value
    borderBottomLeftRadius: 33,  // Example value
    backgroundColor: "#473f97",
    width: "100%",
    height: 396,
    position: "absolute",
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection: 'column', // Stack items vertically
  },
  graduationCapIcon: {
    // top: 87,
    // left: 114,
    // width: 132,
    // height: 132,
    // position: "absolute",
     marginTop: -20,
    width: 132,
    height: 132,
  },
  aura: {
    top: 1,
    // left: 132,
    letterSpacing: 9.9,
    fontWeight: '200',
    fontFamily: FontFamily.interExtraLight,
    color: Color.colorCrimson,
  },
  signIn: {
    top: 39,
    // left: 129,
    fontWeight: "600",
    fontFamily: FontFamily.interSemiBold,
    color: Color.colorWhite,
  },

  androidLarge1Item: {
    top: 480,
    backgroundColor: Color.colorWhitesmoke,
    width: 329,
    left: 14,
  },

  androidLarge1Inner: {
    top: 572,
    backgroundColor: Color.colorWhitesmoke,
    width: 329,
    left: 14,
  },

  rectangleView: {
    top: 655,
    left: 15,
    borderRadius: 50,
    backgroundColor: Color.colorCrimson,
      justifyContent: 'center',
    alignItems: 'center',

  },
  
  rectangleView2: {
    top: 555,
    left: 15,
    borderRadius: 50,
    backgroundColor: Color.colorCrimson,
      justifyContent: 'center',
    alignItems: 'center',

  },
  
    signIn2Typo: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_sm,


  },

  text: {
    top: 480,
    left: 30,
    color: Color.colorBlack,
  },
  text2: {
    top: 524,
    left: 30,
    color: Color.colorBlack,
  },
  text1: {
    top: 587,
    left: 30,
    color: Color.colorBlack,
  },
    phoneNumber: {
    top: 456,
    left: 14,
    color: Color.colorBlack,
  },
    password: {
    top: 548,
    left: 14,
    color: Color.colorBlack,
  },
    signIn1: {
    top: 670,
    left: 156,
    color: Color.colorWhite,
  },
    forgetPassword: {
    top: 719,
    left: 123,
    color: Color.colorCrimson,
  },


    bottomContainer: {
    marginLeft:16,
  },
    background: {
    backgroundColor: Color.colorWhite,
    // backgroundColor: Color.colorCrimson,
    flex: 1,
    width: '100%',
    height: 800,
    overflow: "hidden",

  textInput: {
    flex: 1,
    paddingLeft: 10, // Add padding to align placeholder text with existing text
  },

    button: {
    borderRadius: 50,
    backgroundColor: Color.colorCrimson,
      justifyContent: 'center',
    alignItems: 'center',

  },

  },
      loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '100%',
  },
  loadingText: {
    marginTop: 10,
    color: Color.colorCrimson,
    fontSize: 20,
    fontWeight: 'bold',
  }, 
});

export default TeacherLogin;

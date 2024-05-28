// import * as React from "react";
import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity } from "react-native";
import { FontSize, Color, FontFamily, Border } from "../../../GlobalStyles";
import {FIREBASE_AUTH, FIREBASE_DB} from '../../firebase/firebaseConfig';
import {signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore';
import 'firebase/firestore';




const TeacherLogin = ({navigation}) => {
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
      console.log(email)
      console.log(password)
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
        if (userData.role === 'teacher') {
          // Admin-specific logic
          console.log('Welcome, techer!');
          navigation.navigate('TeacherDashboard');
        } else {
          // Normal user logic
          console.log('diffrent role');

        }
      // navigation.navigate('TeacherDashboard');
      } 
      else 
      {
        alert('user not found');
      }
      }   
      catch (error) {
      console.error('Login Error:', error);
      alert('Login failed. Please check your credentials.');
    }
  };
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
      <View style={[styles.bottomContainer]}>
      <Text style={[styles.phoneNumber, styles.textTypo]}>Email</Text>
      <View style={[styles.androidLarge1Item, styles.androidLayout]} />
       <TextInput
        style={[styles.text, styles.textInput]}
        placeholder="teacher123@gmail.com"
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
    position: "absolute",
  },
  textTypo: {
    color: Color.colorBlack,
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_sm,
    textAlign: "left",
    position: "absolute",
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
    fontWeight: "200",
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
    width: "100%",
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
});

export default TeacherLogin;

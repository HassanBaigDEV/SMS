import * as React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { FontSize, Color, FontFamily, Border } from "../../../GlobalStyles";

const teacherLogin = () => {
  return (
    <View style={styles.androidLarge1}>
      <View style={styles.androidLarge1Child} />
      <Image
        style={styles.graduationCapIcon}
        resizeMode="cover"
        // source={require("../assests/icons/graduation-cap.png")}
        source={require('../../assests/icons/graduation-cap.png')}

      />
      <Text style={[styles.aura, styles.auraTypo]}>Aura</Text>
      <Text style={[styles.signIn, styles.auraTypo]}>Sign In</Text>
      <View style={[styles.androidLarge1Item, styles.androidLayout]} />
      <View style={[styles.androidLarge1Inner, styles.androidLayout]} />
      <View style={[styles.rectangleView, styles.androidLayout]} />
      <Text style={[styles.text, styles.textTypo]}>+92</Text>
      <Text style={[styles.text1, styles.textTypo]}>**************</Text>
      <Text style={[styles.phoneNumber, styles.textTypo]}>Phone Number</Text>
      <Text style={[styles.password, styles.textTypo]}>Password</Text>
      <Text style={[styles.signIn1, styles.signIn1Typo]}>Sign In</Text>
      <Text style={[styles.forgetPassword, styles.signIn1Typo]}>
        Forget Password
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  auraTypo: {
    textAlign: "left",
    fontSize: FontSize.size_11xl_8,
    position: "absolute",
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
    textAlign: "left",
    position: "absolute",
  },
  androidLarge1Child: {
    top: 0,
    left: 0,
    borderBottomRightRadius: Border.br_14xl,
    borderBottomLeftRadius: Border.br_14xl,
    backgroundColor: "#473f97",
    width: 360,
    height: 396,
    position: "absolute",
  },
  graduationCapIcon: {
    top: 87,
    left: 114,
    width: 132,
    height: 132,
    position: "absolute",
  },
  aura: {
    top: 219,
    left: 132,
    letterSpacing: 9.9,
    fontWeight: "200",
    fontFamily: FontFamily.interExtraLight,
    color: Color.colorCrimson,
  },
  signIn: {
    top: 300,
    left: 129,
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
  },
  text: {
    top: 495,
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
  androidLarge1: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
    height: 800,
    overflow: "hidden",
  },
});

export default teacherLogin;

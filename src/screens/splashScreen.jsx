import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ImageBackground } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Run fade-in and scale animations in parallel
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Navigate to the next screen after a delay
      setTimeout(() => {
        navigation.replace('RoleSelectionScreen');
      }, 2000); // Show splash screen for 1 second after animations
    });
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <ImageBackground
      source={require('../assets/icons/background.png')} // Replace with your background image path
      style={styles.background}
    >
      <View style={styles.container}>
        <Animated.Image
          source={require('../images/image2-nobg.png')} // Replace with your logo path
          style={[
            styles.logo,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        />
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 400,
    height: 100, // Adjust the logo size as needed
    marginBottom: 20,
  },
});

export default SplashScreen;

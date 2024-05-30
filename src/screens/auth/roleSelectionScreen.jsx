import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const RoleSelectionScreen = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const navigation = useNavigation();

  const handleProceed = () => {
    if (selectedRole === 'student') {
      navigation.navigate('StudentNavigator');
    } else if (selectedRole === 'teacher') {
      navigation.navigate('TeacherNavigator');
    } else if (selectedRole === 'admin') {
      navigation.navigate('AdminNavigator');
    }
  };

  return (
    <ImageBackground source={require('../../assets/icons/background.png')} style={styles.background}>
      <View style={styles.container}>
        <Image source={require('../../images/image2-nobg.png')} style={styles.logo} />
        <Picker
          selectedValue={selectedRole}
          onValueChange={(itemValue) => setSelectedRole(itemValue)}
          style={styles.picker}
        >
          {selectedRole === '' && (
              <Picker.Item label="Select a role" value="" />
          )}
          <Picker.Item label="Student" value="student" />
          <Picker.Item label="Teacher" value="teacher" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
          <Text style={styles.proceedButtonText}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  logo: {
    marginTop: '20%',
    width: '100%',
    height: 100,
    marginBottom: '40%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  picker: {
    width: '80%',
    height: 50,
    color: '#fff',
    backgroundColor: '#444',
    borderRadius: 10,
    marginBottom: 20,
  },
  proceedButton: {
    marginTop: '5%',
    width: '50%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  proceedButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RoleSelectionScreen;

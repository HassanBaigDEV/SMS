import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const StudentDashboard = ({ navigation, route }) => {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.headerText}>HOME</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.userInfo}>
        <View style={styles.greetingContainer}>
          <Text style={styles.smallGreetingText}>GOOD EVENING,</Text>
          <Text style={styles.bigNameText}>{user.studentName ? user.studentName.toUpperCase() : 'STUDENT'}!</Text>
        </View>
        <View style={styles.genderIconContainer}>
          {user.gender === 'male' && <Image source={require('../../images/male.jpg')} style={styles.genderIcon} />}
          {user.gender === 'female' && <Image source={require('../../images/female.jpg')} style={styles.genderIcon} />}
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.separator}></View>
        <Text style={styles.registrationNumberText}>REGISTRATION NUMBER: {user.registrationNumber ? user.registrationNumber : 'N/A'}</Text>
        <View style={styles.separator}></View>
        <TouchableOpacity style={[styles.optionButton, { backgroundColor: '#4CAF50' }]} onPress={() => navigation.navigate('FeeStatus')}>
          <Text style={styles.optionButtonText}>VIEW FEE STATUS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.optionButton, { backgroundColor: '#4CAF50' }]} onPress={() => navigation.navigate('MidTermAcademicRecord')}>
          <Text style={styles.optionButtonText}>VIEW MIDTERM ACADEMIC RECORD</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.optionButton, { backgroundColor: '#4CAF50' }]} onPress={() => navigation.navigate('FinalsAcademicRecord')}>
          <Text style={styles.optionButtonText}>VIEW FINALS ACADEMIC RECORD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#333333',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    textTransform: 'uppercase',
    fontFamily: 'Arial',
    letterSpacing: 1,
  },
  separator: {
    height: 5,
    backgroundColor: '#ccc',
    marginVertical: 20,
    width: '99%', // Adjust width as needed
    alignSelf: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  smallGreetingText: {
    fontSize: 14,
    fontFamily: 'Arial',
    letterSpacing: 1,
    
  },
  bigNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontFamily: 'Arial',
    letterSpacing: 1,
  },
  genderIconContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  genderIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
  },
  content: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
  },
  registrationNumberText: {
    fontSize: 18,
    textTransform: 'uppercase',
    fontFamily: 'Arial',
    letterSpacing: 1,
    // textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 16,
    textTransform: 'uppercase',
    fontFamily: 'Arial',
    letterSpacing: 1,
    textAlign: 'center'
  },
});

export default StudentDashboard;

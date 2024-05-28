import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, FlatList, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { ActivityIndicator } from 'react-native';

const StudentDashboard = ({ navigation, route }) => {
  const { user } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [feeModalVisible, setFeeModalVisible] = useState(false);
  const [years, setYears] = useState([]);
  const [feeStatusYears, setFeestatusYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]);
  const [feeYear, setSelectedFeeYear] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  useEffect(() => {
    const marks = user?.['marks'];
    const feeYears = user?.['feeStatus'];
    if (marks) {
      setYears(Object.keys(marks));
      setFeestatusYears(Object.keys(feeYears));
    }
  }, [user]);

  const handleYearPress = (year) => {
    setSelectedYear(year);
    const totalSubjects = Object.keys(user?.['marks']?.[year]);
    const subjects = totalSubjects.filter(subject => subject !== 'yearlyRemarks'); // Remove the 'yearlyRemarks' key
    setSubjects(subjects);
    setModalVisible(false);
    navigation.navigate('AcademicProfile', { user, selectedYear: year, subjects });
  };

  const handleFeeYearPress = (year) => {
    setSelectedFeeYear(year);
    setFeeModalVisible(false);
    navigation.navigate('ViewFeeStatus', { user, feeYear: year });
  };

  const handleLogout = async () => {
    try {
      setShowLogoutModal(true); 
      await signOut(FIREBASE_AUTH); // Sign out user
    //   Alert.alert('SUCCESSFUL!', 'You have logged out successfully!');
      console.log('Logout Succesful!');
    } catch (error) {
        console.error('Logout Error:', error.message);
    } finally {
        setTimeout(() => {
          setShowLogoutModal(false);
          navigation.navigate('StudentLogin'); 
      }, 3000); // 2 seconds
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('StudentDashboard', { user })}>
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
        <Text style={[styles.boldText, styles.registrationNumberText]}>REGISTRATION NUMBER: <Text style={styles.userInfoText}>{user.registrationNumber ? user.registrationNumber : 'N/A'}</Text></Text>
        <View style={styles.separator}></View>
        <TouchableOpacity style={[styles.optionButton, { backgroundColor: '#8A2BE2' }]} onPress={() => setModalVisible(true)}>
          <Text style={styles.optionButtonText}>VIEW CLASS SYLLABUS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.optionButton, { backgroundColor: '#8A2BE2' }]} onPress={() => setModalVisible(true)}>
          <Text style={styles.optionButtonText}>VIEW ACADEMIC RECORD</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.optionButton, { backgroundColor: '#8A2BE2' }]} onPress={() => setFeeModalVisible(true)}>
          <Text style={styles.optionButtonText}>VIEW FEE STATUS</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.optionButton, { backgroundColor: '#8A2BE2' }]} 
            onPress={() => {
                setShowLogoutModal(true);
                handleLogout(); 
            }}>
            <Text style={styles.optionButtonText}>LOG OUT</Text>
        </TouchableOpacity>

      </View>

      {/* Loading Modal */}
      <Modal visible={showLogoutModal} transparent={false} animationType="fade">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>LOGGING OUT...</Text>
        </View>
      </Modal>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Which year's record would you like to access?</Text>
            <FlatList
              data={years}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalButton} onPress={() => handleYearPress(item)}>
                  <Text style={styles.modalButtonText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={feeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFeeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Please select for which year would you like to view the fee status?</Text>
            <FlatList
              data={feeStatusYears}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalButton} onPress={() => handleFeeYearPress(item)}>
                  <Text style={styles.modalButtonText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setFeeModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 15,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  smallGreetingText: {
    fontSize: 18,
    color: '#555',
  },
  bigNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  genderIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  schoolImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  separator: {
    height: 2,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  registrationNumberText: {
    fontSize: 18,
  },
  userInfoText: {
    fontSize: 18,
    color: 'black',
  },
  optionButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  optionButtonText: {
    fontSize: 18,
    color: '#fff',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  modalButton: {
    width: 250,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#8A2BE2',
    alignItems: 'center',
    marginVertical: 5,
  },
  modalButtonText: {
    fontSize: 19,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ff5c5c',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default StudentDashboard;

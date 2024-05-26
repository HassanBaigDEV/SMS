// screens/AdminDashboard.js
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {signOut} from 'firebase/auth';
// import RoleBasedComponent from '../components/RoleBasedComponent';
import {getDocs, doc, collection} from 'firebase/firestore';
import {FIREBASE_DB, FIREBASE_AUTH} from '../../firebase/firebaseConfig';

const AdminDashboard = ({navigation}) => {
  const [userRole, setUserRole] = useState('');

  // useEffect(() => {
  //   const fetchUserRole = async () => {
  //     const user = FIREBASE_AUTH.currentUser;
  //     if (user) {
  //       const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
  //       if (userDoc.exists()) {
  //         setUserRole(userDoc.data().role);
  //       }
  //     }
  //   };

  //   fetchUserRole();
  // }, []);

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigation.navigate('AdminLogin');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Students')}>
          <Text>Manage Students</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => navigation.navigate('AddClass')}>
          <Text>Add Class</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => navigation.navigate('TeacherList')}>
          <Text>Manage Teachers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ManageFees')}>
          <Text>Manage Fees</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('UploadTimetable')}>
          <Text>Upload Timetable</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('UploadSyllabus')}>
          <Text>Upload Syllabus</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ClassList');
          }}>
          <Text>Classes</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => navigation.navigate('addStudent')}>
          <Text>Add Student</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity onPress={() => navigation.navigate('addTeacher')}>
          <Text>Add Teacher</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('StudentAgeRecord');
          }}>
          <Text>Student Age Record</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('FeeStatus');
          }}>
          <Text>Fee Status</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default AdminDashboard;

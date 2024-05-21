// screens/AdminDashboard.js
import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {signOut} from 'firebase/auth';
import RoleBasedComponent from '../components/RoleBasedComponent';
import {getDoc, doc} from 'firebase/firestore';
import {FIREBASE_DB, FIREBASE_AUTH} from '../firebase/firebaseConfig';

const AdminDashboard = ({navigation}) => {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      }
    };

    fetchUserRole();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigation.navigate('AdminLogin');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <RoleBasedComponent userRole={userRole}>
      <View style={styles.container}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Button
          title="Manage Students"
          onPress={() => navigation.navigate('ManageStudents')}
        />
        <Button
          title="Manage Teachers"
          onPress={() => navigation.navigate('ManageTeachers')}
        />
        <Button
          title="Manage Fees"
          onPress={() => navigation.navigate('ManageFees')}
        />
        <Button
          title="Upload Timetable"
          onPress={() => navigation.navigate('UploadTimetable')}
        />
        <Button
          title="Upload Syllabus"
          onPress={() => navigation.navigate('UploadSyllabus')}
        />
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </RoleBasedComponent>
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

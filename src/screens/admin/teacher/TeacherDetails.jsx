// TeacherDetail.js
import React, {useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet, Alert} from 'react-native';
import {doc, getDoc, deleteDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';

const TeacherDetail = ({route, navigation}) => {
  const {teacherId} = route.params;
  console.log('teacherId', teacherId);
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const teacherDoc = await getDoc(
          doc(FIREBASE_DB, 'teachers', teacherId),
        );
        if (teacherDoc.exists()) {
          setTeacher(teacherDoc.data());
        } else {
          Alert.alert('Error', 'Teacher not found');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error fetching teacher:', error);
      }
    };

    fetchTeacher();
  }, [navigation, teacherId]);

  const handleDeleteTeacher = async () => {
    try {
      await deleteDoc(doc(FIREBASE_DB, 'teachers', teacherId));
      Alert.alert('Success', 'Teacher deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      Alert.alert('Error', 'Error deleting teacher');
    }
  };

  const handleEditTeacher = () => {
    navigation.navigate('EditTeacher', {teacherId});
  };

  if (!teacher) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name: {teacher.teacherName}</Text>
      <Text style={styles.label}>Emcccail: {teacher.email}</Text>
      <Text style={styles.label}>Assigned Class: {teacher.classAssigned}</Text>
      <Text style={styles.label}>Other Details: {teacher.otherDetails}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Edit" onPress={handleEditTeacher} />
        <Button title="Delete" onPress={handleDeleteTeacher} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default TeacherDetail;

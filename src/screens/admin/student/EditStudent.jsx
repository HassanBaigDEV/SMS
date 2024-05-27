// EditStudent.js
import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet} from 'react-native';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import Header from '../../../components/header';

const EditStudent = ({route, navigation}) => {
  const {student} = route.params;

  const [studentData, setStudentData] = useState({
    studentName: '',
    dateOfBirth: '',
    dateOfAdmission: '',
    gender: '',
    fatherName: '',
    occupation: '',
    residence: '',
    email: '',
    remarks: '',
  });

  useEffect(() => {
    if (student) {
      setStudentData(student);
    }
  }, [student]);

  const handleInputChange = (field, value) => {
    setStudentData({
      ...studentData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    try {
      const studentRef = doc(FIREBASE_DB, 'students', student.id);
      await updateDoc(studentRef, studentData);

      Alert.alert('Success', 'Student details updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating student:', error);
      Alert.alert('Error', 'Error updating student details');
    }
  };

  return (
    <>
      <Header title="Edit Student" />
      <View style={styles.container}>
        <Text style={styles.label}>Edit Student Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={studentData.studentName}
          onChangeText={text => handleInputChange('studentName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Date of Birth"
          value={studentData.dateOfBirth}
          onChangeText={text => handleInputChange('dateOfBirth', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Date of Admission"
          value={studentData.dateOfAdmission}
          onChangeText={text => handleInputChange('dateOfAdmission', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={studentData.gender}
          onChangeText={text => handleInputChange('gender', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Father's Name"
          value={studentData.fatherName}
          onChangeText={text => handleInputChange('fatherName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Occupation"
          value={studentData.occupation}
          onChangeText={text => handleInputChange('occupation', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Residence"
          value={studentData.residence}
          onChangeText={text => handleInputChange('residence', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={studentData.email}
          onChangeText={text => handleInputChange('email', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Remarks"
          value={studentData.remarks}
          onChangeText={text => handleInputChange('remarks', text)}
        />
        <View style={styles.buttonContainer}>
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default EditStudent;

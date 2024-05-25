// CreateStudentForm.js
import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {addDoc, collection, doc, setDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../firebase/firebaseConfig';
import {signUp} from '../../utils/signUp';
import {ScrollView} from 'react-native-gesture-handler';

const CreateStudentForm = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [dateOfAdmission, setDateOfAdmission] = useState('');
  const [studentName, setStudentName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [residence, setResidence] = useState('');
  const [admissionClass, setAdmissionClass] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleCreateStudent = async () => {
    try {
      // Add student record to Firestore
      const studentsCollection = collection(FIREBASE_DB, 'students');
      const studentDocRef = doc(
        studentsCollection,
        registrationNumber.toString(),
      );
      await setDoc(studentDocRef, {
        registrationNumber: parseInt(registrationNumber),
        dateOfAdmission,
        studentName,
        dateOfBirth,
        gender,
        fatherName,
        occupation,
        residence,
        admissionClass,
        email,
        password,
        remarks,
      });

      await signUp(email, password, 'student');
      // Clear form fields
      setRegistrationNumber('');
      setDateOfAdmission('');
      setStudentName('');
      setDateOfBirth('');
      setGender('');
      setFatherName('');
      setOccupation('');
      setResidence('');
      setAdmissionClass('');
      setEmail('');
      setPassword('');
      setRemarks('');

      Alert.alert('Success', 'Student account created successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error('Create Student Error:', error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.label}>Registration Number</Text>
        <TextInput
          style={styles.input}
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Date of Admission/Registration</Text>
        <TextInput
          style={styles.input}
          value={dateOfAdmission}
          onChangeText={setDateOfAdmission}
          placeholder="YYYY-MM-DD"
        />

        {/* Add other input fields for student details */}
        <Text style={styles.label}>Student Name</Text>
        <TextInput
          style={styles.input}
          value={studentName}
          onChangeText={setStudentName}
        />
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="YYYY-MM-DD"
        />
        <Text style={styles.label}> Gender </Text>
        <TextInput
          style={styles.input}
          value={gender}
          onChangeText={setGender}
        />
        <Text style={styles.label}>Father's Name</Text>
        <TextInput
          style={styles.input}
          value={fatherName}
          onChangeText={setFatherName}
        />
        <Text style={styles.label}>Occupation</Text>
        <TextInput
          style={styles.input}
          value={occupation}
          onChangeText={setOccupation}
        />
        <Text style={styles.label}>Residence</Text>
        <TextInput
          style={styles.input}
          value={residence}
          onChangeText={setResidence}
        />
        <Text style={styles.label}>Admission Class</Text>
        <TextInput
          style={styles.input}
          value={admissionClass}
          onChangeText={setAdmissionClass}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.label}>Remarks</Text>
        <TextInput
          style={styles.input}
          value={remarks}
          onChangeText={setRemarks}
        />

        <Button title="Create Student Account" onPress={handleCreateStudent} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});

export default CreateStudentForm;

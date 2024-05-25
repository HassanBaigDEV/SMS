// AddTeacherForm.js
import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {setDoc, collection, doc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../firebase/firebaseConfig';
// import {signUp} from '../../firebase/firebaseConfig';
import {signUp} from '../../utils/signUp';

const AddTeacherForm = () => {
  const [idNumber, setIdNumber] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subject, setSubject] = useState('');
  const [classAssigned, setClassAssigned] = useState('');

  const handleAddTeacher = async () => {
    try {
      // Add teacher record to Firestore with id number as document ID
      await signUp(email, password, 'teacher');
      const teachersCollection = collection(FIREBASE_DB, 'teachers');
      const teacherDocRef = doc(teachersCollection, idNumber.toString());
      await setDoc(teacherDocRef, {
        idNumber: parseInt(idNumber),
        teacherName,
        email,
        password,
        subject,
        classAssigned,
      });
      // Clear form fields
      setIdNumber('');
      setTeacherName('');
      setEmail('');
      setPassword('');
      setSubject('');
      setClassAssigned('');

      // Alert.alert('Success', 'Teacher added successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID Number</Text>
      <TextInput
        style={styles.input}
        value={idNumber}
        onChangeText={setIdNumber}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Teacher Name</Text>
      <TextInput
        style={styles.input}
        value={teacherName}
        onChangeText={setTeacherName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Subject</Text>
      <TextInput
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
      />

      <Text style={styles.label}>Class Assigned</Text>
      <TextInput
        style={styles.input}
        value={classAssigned}
        onChangeText={setClassAssigned}
      />

      <Button title="Add Teacher" onPress={handleAddTeacher} />
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

export default AddTeacherForm;

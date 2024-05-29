import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import {
  setDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import {signUp} from '../../../utils/signUp';
import Header from '../../../components/header';

const AddTeacherForm = () => {
  const [idNumber, setIdNumber] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAddTeacher = async () => {
    try {
      // Check for required fields
      ToastAndroid.show('Adding teacher...', ToastAndroid.SHORT);
      const _email = `${idNumber}@teacher.com`;
      if (!idNumber || !teacherName || !_email || !password) {
        console.log(idNumber, teacherName, email, password);
        // Alert.alert('Error', 'Please fill all required fields.');
        ToastAndroid.showWithGravityAndOffset(
          'Please fill all required fields.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          200,
        );
        return;
      }
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters long.');
        ToastAndroid.show(
          'Password must be at least 6 characters long.',
          ToastAndroid.SHORT,
        );
        return;
      }

      // Check if a teacher with the same ID number exists
      const teachersCollection = collection(FIREBASE_DB, 'teachers');
      const querySnapshot = await getDocs(
        query(teachersCollection, where('idNumber', '==', parseInt(idNumber))),
      );
      if (!querySnapshot.empty) {
        Alert.alert('Error', 'Teacher with the same ID number already exists.');
        return;
      }

      await signUp(_email, password, 'teacher');
      const teacherDocRef = doc(teachersCollection, idNumber.toString());
      // Add teacher record to Firestore with ID number as document ID
      await setDoc(teacherDocRef, {
        idNumber: parseInt(idNumber),
        teacherName,
        email,
        password,
      });
      // Clear form fields
      setIdNumber('');
      setTeacherName('');
      setEmail('');
      setPassword('');
      // Show success message
      ToastAndroid.show('Teacher added successfully.', ToastAndroid.SHORT);
    } catch (error) {
      console.log('Error', error.message);
      ToastAndroid.show(
        'An error occurred. Please try again.',
        ToastAndroid.SHORT,
      );
    }
  };

  return (
    <>
      <Header title="Add Teacher" />
      <ScrollView style={styles.container}>
        <Text style={styles.label}>ID Number*</Text>
        <TextInput
          style={styles.input}
          value={idNumber}
          onChangeText={setIdNumber}
          keyboardType="numeric"
          placeholder="Enter ID Number"
        />

        <Text style={styles.label}>Teacher Name*</Text>
        <TextInput
          style={styles.input}
          value={teacherName}
          onChangeText={setTeacherName}
          placeholder="Enter Teacher Name"
          required
        />

        <Text style={styles.label}>Email*</Text>
        <TextInput
          style={styles.input}
          value={email !== '' ? email : `${idNumber}@teacher.com`}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={false}
          placeholder="Auto-generated Email"
          required
        />

        <Text style={styles.label}>Password*</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter Password"
          required
        />
      </ScrollView>
      {/* <Button title="Add Teacher" onPress={handleAddTeacher} />
       */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTeacher}>
        <Text style={styles.addButtonText}>Add Teacher</Text>
      </TouchableOpacity>
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
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddTeacherForm;

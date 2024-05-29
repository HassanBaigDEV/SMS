import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {setDoc, collection, doc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import {signUp} from '../../../utils/signUp';
import {years} from '../../../data/academicYear';
import Header from '../../../components/header';

const AddTeacherForm = () => {
  const [idNumber, setIdNumber] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [academicDetails, setAcademicDetails] = useState(
    years.reduce((acc, year) => {
      acc[year] = {classAssigned: '', subject: ''};
      return acc;
    }, {}),
  );

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
        academicYear: academicDetails,
      });
      // Clear form fields
      setIdNumber('');
      setTeacherName('');
      setEmail('');
      setPassword('');
      setAcademicDetails(
        years.reduce((acc, year) => {
          acc[year] = {classAssigned: '', subject: ''};
          return acc;
        }, {}),
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleInputChange = (year, field, value) => {
    setAcademicDetails(prevState => ({
      ...prevState,
      [year]: {
        ...prevState[year],
        [field]: value,
      },
    }));
  };

  return (
    <>
      <Header title="Add Teacher" />
      <ScrollView style={styles.container}>
        <Text style={styles.label}>ID Number</Text>
        <TextInput
          style={styles.input}
          value={idNumber}
          onChangeText={setIdNumber}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Teacher Name*</Text>
        <TextInput
          style={styles.input}
          value={teacherName}
          onChangeText={setTeacherName}
          required
        />

        <Text style={styles.label}>Email*</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          required
        />

        <Text style={styles.label}>Password*</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          required
        />

        {years.map(year => (
          <View key={year} style={styles.yearSection}>
            <Text style={styles.yearLabel}>{year}</Text>
            <Text style={styles.label}>Class Assigned</Text>
            <TextInput
              style={styles.input}
              value={academicDetails[year].classAssigned}
              placeholder="Format Class 5"
              onChangeText={text =>
                handleInputChange(year, 'classAssigned', text)
              }
            />
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              value={academicDetails[year].subject}
              placeholder="Subject"
              onChangeText={text => handleInputChange(year, 'subject', text)}
            />
          </View>
        ))}
      </ScrollView>
      <Button title="Add Teacher" onPress={handleAddTeacher} />
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
  yearSection: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  yearLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
});

export default AddTeacherForm;

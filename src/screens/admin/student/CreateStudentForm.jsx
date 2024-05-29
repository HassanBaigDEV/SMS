import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {addDoc, collection, doc, setDoc, getDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import {signUp} from '../../../utils/signUp';
// import {ScrollView} from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../../../components/header';

const CreateStudentForm = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [dateOfAdmission, setDateOfAdmission] = useState(new Date());
  const [studentName, setStudentName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [residence, setResidence] = useState('');
  const [admissionClass, setAdmissionClass] = useState('');
  const [password, setPassword] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showDateOfBirthPicker, setShowDateOfBirthPicker] = useState(false);
  const [showDateOfAdmissionPicker, setShowDateOfAdmissionPicker] =
    useState(false);

  const email = `${registrationNumber}@student.com`;

  const handleCreateStudent = async () => {
    if (
      !registrationNumber ||
      !dateOfAdmission ||
      !studentName ||
      !dateOfBirth ||
      !gender ||
      !fatherName ||
      !occupation ||
      !residence ||
      !admissionClass ||
      !password
    ) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      // Check if student with same registration number already exists
      const studentDocRef = doc(
        FIREBASE_DB,
        'students',
        registrationNumber.toString(),
      );
      const studentDoc = await getDoc(studentDocRef);

      if (studentDoc.exists()) {
        Alert.alert(
          'Error',
          'A student with this registration number already exists.',
        );
        return;
      }

      // Add student record to Firestore
      await setDoc(studentDocRef, {
        registrationNumber: parseInt(registrationNumber),
        dateOfAdmission: dateOfAdmission.toISOString().split('T')[0],
        studentName,
        dateOfBirth: dateOfBirth.toISOString().split('T')[0],
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
      setDateOfAdmission(new Date());
      setStudentName('');
      setDateOfBirth(new Date());
      setGender('');
      setFatherName('');
      setOccupation('');
      setResidence('');
      setAdmissionClass('');
      setPassword('');
      setRemarks('');

      Alert.alert('Success', 'Student account created successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error('Create Student Error:', error);
    }
  };

  return (
    <>
      <Header title="Add Student" />
      <ScrollView style={{flex: 1, backgroundColor: '#f9f9f9'}}>
        <View style={styles.container}>
          <Text style={styles.label}>Registration Number</Text>
          <TextInput
            style={styles.input}
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Student Name</Text>
          <TextInput
            style={styles.input}
            value={studentName}
            onChangeText={setStudentName}
          />
          <Text style={styles.label}>Date of Admission/Registration</Text>
          <TouchableOpacity onPress={() => setShowDateOfAdmissionPicker(true)}>
            <TextInput
              style={styles.input}
              value={dateOfAdmission.toISOString().split('T')[0]}
              editable={false}
            />
          </TouchableOpacity>
          {showDateOfAdmissionPicker && (
            <DateTimePicker
              value={dateOfAdmission}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDateOfAdmissionPicker(Platform.OS === 'ios');
                if (date) setDateOfAdmission(date);
              }}
            />
          )}

          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity onPress={() => setShowDateOfBirthPicker(true)}>
            <TextInput
              style={styles.input}
              value={dateOfBirth.toISOString().split('T')[0]}
              editable={false}
            />
          </TouchableOpacity>
          {showDateOfBirthPicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDateOfBirthPicker(Platform.OS === 'ios');
                if (date) setDateOfBirth(date);
              }}
            />
          )}

          <Text style={styles.label}>Gender</Text>
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
          <TextInput style={styles.input} value={email} editable={false} />

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
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={handleCreateStudent}>
        <Text style={styles.addButtonText}>Add Student</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
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

export default CreateStudentForm;

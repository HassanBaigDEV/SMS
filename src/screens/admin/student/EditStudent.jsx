// EditStudent.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import Header from '../../../components/header';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditStudent = ({route, navigation}) => {
  const {student} = route.params;

  const [studentData, setStudentData] = useState({
    studentName: '',
    dateOfBirth: new Date(),
    dateOfAdmission: new Date(),
    gender: '',
    fatherName: '',
    occupation: '',
    residence: '',
    email: '',
    remarks: '',
  });

  const [showDateOfBirthPicker, setShowDateOfBirthPicker] = useState(false);
  const [showDateOfAdmissionPicker, setShowDateOfAdmissionPicker] =
    useState(false);

  useEffect(() => {
    if (student) {
      setStudentData({
        ...student,
        dateOfBirth: new Date(student.dateOfBirth),
        dateOfAdmission: new Date(student.dateOfAdmission),
      });
    }
  }, [student]);

  const handleInputChange = (field, value) => {
    setStudentData({
      ...studentData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    if (
      !studentData.studentName ||
      !studentData.dateOfBirth ||
      !studentData.dateOfAdmission ||
      !studentData.gender ||
      !studentData.fatherName ||
      !studentData.occupation ||
      !studentData.residence
    ) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    ToastAndroid.show('Updating student details...', ToastAndroid.SHORT);
    try {
      const studentRef = doc(FIREBASE_DB, 'students', student.id);
      await updateDoc(studentRef, {
        ...studentData,
        dateOfBirth: studentData.dateOfBirth.toISOString().split('T')[0],
        dateOfAdmission: studentData.dateOfAdmission
          .toISOString()
          .split('T')[0],
      });

      // Alert.alert('Success', 'Student details updated successfully');
      ToastAndroid.show(
        'Student details updated successfully',
        ToastAndroid.SHORT,
      );
      navigation.goBack();
    } catch (error) {
      console.error('Error updating student:', error);
      Alert.alert('Error', 'Error updating student details');
    }
  };

  return (
    <>
      <Header title="Edit Student" />
      <ScrollView style={styles.container}>
        {/* <Text style={styles.label}>Edit Student Details</Text> */}

        <Text style={styles.fieldLabel}>Name</Text>
        <TextInput
          style={styles.input}
          value={studentData.studentName}
          onChangeText={text => handleInputChange('studentName', text)}
        />

        <Text style={styles.fieldLabel}>Date of Birth</Text>
        <TouchableOpacity onPress={() => setShowDateOfBirthPicker(true)}>
          <TextInput
            style={styles.input}
            value={studentData.dateOfBirth.toISOString().split('T')[0]}
            editable={false}
          />
        </TouchableOpacity>
        {showDateOfBirthPicker && (
          <DateTimePicker
            value={studentData.dateOfBirth}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDateOfBirthPicker(Platform.OS === 'ios');
              if (date) handleInputChange('dateOfBirth', date);
            }}
          />
        )}

        <Text style={styles.fieldLabel}>Date of Admission</Text>
        <TouchableOpacity onPress={() => setShowDateOfAdmissionPicker(true)}>
          <TextInput
            style={styles.input}
            value={studentData.dateOfAdmission.toISOString().split('T')[0]}
            editable={false}
          />
        </TouchableOpacity>
        {showDateOfAdmissionPicker && (
          <DateTimePicker
            value={studentData.dateOfAdmission}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDateOfAdmissionPicker(Platform.OS === 'ios');
              if (date) handleInputChange('dateOfAdmission', date);
            }}
          />
        )}

        <Text style={styles.fieldLabel}>Gender</Text>
        <TextInput
          style={styles.input}
          value={studentData.gender}
          onChangeText={text => handleInputChange('gender', text)}
        />

        <Text style={styles.fieldLabel}>Father's Name</Text>
        <TextInput
          style={styles.input}
          value={studentData.fatherName}
          onChangeText={text => handleInputChange('fatherName', text)}
        />

        <Text style={styles.fieldLabel}>Occupation</Text>
        <TextInput
          style={styles.input}
          value={studentData.occupation}
          onChangeText={text => handleInputChange('occupation', text)}
        />

        <Text style={styles.fieldLabel}>Residence</Text>
        <TextInput
          style={styles.input}
          value={studentData.residence}
          onChangeText={text => handleInputChange('residence', text)}
        />

        <Text style={styles.fieldLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={studentData.email}
          editable={false}
        />

        <Text style={styles.fieldLabel}>Remarks</Text>
        <TextInput
          style={styles.input}
          value={studentData.remarks}
          onChangeText={text => handleInputChange('remarks', text)}
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    width: '48%',
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    width: '48%',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditStudent;

// EditTeacher.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {doc, getDoc, setDoc, updateDoc, collection} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import {years} from '../../../data/academicYear';
import Header from '../../../components/header';

const EditTeacher = ({route, navigation}) => {
  const {teacherId, isNew} = route.params;

  const [teacherData, setTeacherData] = useState({
    teacherName: '',
    email: '',
    academicYear: years.reduce((acc, year) => {
      acc[year] = {classAssigned: '', subject: ''};
      return acc;
    }, {}),
  });

  useEffect(() => {
    if (!isNew && teacherId) {
      const fetchTeacher = async () => {
        try {
          const teacherDoc = await getDoc(
            doc(FIREBASE_DB, 'teachers', teacherId),
          );
          if (teacherDoc.exists()) {
            setTeacherData(teacherDoc.data());
          } else {
            Alert.alert('Error', 'Teacher not found');
            navigation.goBack();
          }
        } catch (error) {
          console.error('Error fetching teacher:', error);
        }
      };

      fetchTeacher();
    }
  }, [teacherId, isNew, navigation]);

  const handleInputChange = (field, value) => {
    setTeacherData({
      ...teacherData,
      [field]: value,
    });
  };

  const handleYearInputChange = (year, field, value) => {
    setTeacherData(prevState => ({
      ...prevState,
      academicYear: {
        ...prevState.academicYear,
        [year]: {
          ...prevState.academicYear[year],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    try {
      const teacherRef = isNew
        ? doc(collection(FIREBASE_DB, 'teachers'))
        : doc(FIREBASE_DB, 'teachers', teacherId);
      if (isNew) {
        await setDoc(teacherRef, teacherData);
      } else {
        await updateDoc(teacherRef, teacherData);
      }
      Alert.alert('Success', 'Teacher details saved successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving teacher:', error);
      Alert.alert('Error', 'Error saving teacher details');
    }
  };

  return (
    <>
      <Header title="Edit Teacher" />
      <ScrollView style={styles.container}>
        {/* <Text style={styles.label}>Edit Teacher Details</Text> */}

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={teacherData.teacherName}
          onChangeText={text => handleInputChange('teacherName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={teacherData.email}
          onChangeText={text => handleInputChange('email', text)}
        />

        {years.map(year => (
          <View key={year} style={styles.yearSection}>
            <Text style={styles.yearLabel}>{year}</Text>
            <Text style={styles.yearLabel}>Class Assigned</Text>
            <TextInput
              style={styles.input}
              value={teacherData?.academicYear[year]?.classAssigned || ''}
              placeholder="Format: Class 5"
              onChangeText={text =>
                handleYearInputChange(year, 'classAssigned', text)
              }
            />
            <Text style={styles.yearLabel}>Subject</Text>
            <TextInput
              style={styles.input}
              value={teacherData?.academicYear[year]?.subject || ''}
              placeholder="Subject"
              onChangeText={text =>
                handleYearInputChange(year, 'subject', text)
              }
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
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
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  yearSection: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  yearLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 18,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    backgroundColor: 'trasparent',
    marginHorizontal: 20,
  },
  button: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditTeacher;

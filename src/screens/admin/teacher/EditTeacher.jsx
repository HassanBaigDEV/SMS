// EditTeacher.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {doc, getDoc, setDoc, updateDoc, collection} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import {years} from '../../../data/academicYear';

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
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Edit Teacher Details</Text>

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
          <Text style={styles.label}>Class Assigned</Text>
          <TextInput
            style={styles.input}
            value={teacherData?.academicYear[year]?.classAssigned || ''}
            placeholder="Format Class 5"
            onChangeText={text =>
              handleYearInputChange(year, 'classAssigned', text)
            }
          />
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            value={teacherData?.academicYear[year]?.subject || ''}
            placeholder="Subject"
            onChangeText={text => handleYearInputChange(year, 'subject', text)}
          />
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={handleSave} />
        <Button title="Cancel" onPress={() => navigation.goBack()} />
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default EditTeacher;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {doc, getDoc, deleteDoc, updateDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../firebase/firebaseConfig';
import {ToastAndroid} from 'react-native';
import TeacherHeader from '../../components/teacherheader';

const StudentMarks = ({route, navigation}) => {
  const marksDistribution = {
    subjects: {
      English: {firstTerm: 50, midTerm: 30, finalTerm: 100},
      'Social Study': {firstTerm: 50, midTerm: 30, finalTerm: 100},
      Urdu: {firstTerm: 50, midTerm: 30, finalTerm: 100},
      Math: {firstTerm: 50, midTerm: 30, finalTerm: 100},
      'Nazra-e-Quran': {firstTerm: 50, midTerm: 30, finalTerm: 100},
      'General Knowledge': {firstTerm: 50, midTerm: 30, finalTerm: 100},
      Islamiat: {firstTerm: 50, midTerm: 30, finalTerm: 100},
      'Computer (Part 1)': {firstTerm: 35, midTerm: 30, finalTerm: 70},
      'Computer (Part 2)': {firstTerm: 15, midTerm: 30, finalTerm: 30},
      Quran: {firstTerm: 50, midTerm: 30, finalTerm: 100},
    },
  };

  const {registrationNumber, selectedYear} = route.params;
  const [student, setStudent] = useState(null);
  const [editMode, setEditMode] = useState({
    firstTerm: false,
    midTerm: false,
    finalTerm: false,
  });
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState('firstTerm');

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const studentRef = doc(
        FIREBASE_DB,
        'students',
        registrationNumber.toString(),
      );
      const studentSnapshot = await getDoc(studentRef);

      if (studentSnapshot.exists()) {
        const studentData = studentSnapshot.data();
        setStudent(studentData);

        if (studentData.marks && studentData.marks[selectedYear]) {
          setMarks(studentData.marks[selectedYear]);
        } else {
          setMarks({});
        }
      } else {
        console.error('Student not found');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [registrationNumber, navigation]);

  const handleDeleteStudent = async () => {
    try {
      await deleteDoc(
        doc(FIREBASE_DB, 'students', registrationNumber.toString()),
      );
      ToastAndroid.show('Student deleted successfully', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting student:', error);
      ToastAndroid.show('Error deleting student', ToastAndroid.SHORT);
    }
  };

  const handleEditStudent = () => {
    navigation.navigate('EditStudent', {candidate: student});
  };

  const handleEditToggle = term => {
    setEditMode(prevState => ({...prevState, [term]: !prevState[term]}));
  };

  const handleMarksChange = (subject, term, value) => {
    const total = marksDistribution.subjects[subject][term];
    const numberValue = Number(value);

    if (numberValue <= total) {
      setMarks(prevMarks => ({
        ...prevMarks,
        [subject]: {
          ...prevMarks[subject],
          [term]: numberValue,
        },
      }));
    } else {
      ToastAndroid.show(
        'Marks cannot be greater than total marks',
        ToastAndroid.SHORT,
      );
    }
  };

  const handleSaveMarks = async () => {
    try {
      const studentRef = doc(
        FIREBASE_DB,
        'students',
        student.registrationNumber.toString(),
      );
      await updateDoc(studentRef, {
        marks: {
          ...student.marks,
          [selectedYear]: marks,
        },
      });
      setEditMode({
        firstTerm: false,
        midTerm: false,
        finalTerm: false,
      });
      ToastAndroid.show('Marks updated successfully', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error updating marks:', error);
      ToastAndroid.show('Error updating marks', ToastAndroid.SHORT);
    }
  };

  const renderTable = term => {
    const termLabel = term.charAt(0).toUpperCase() + term.slice(1);

    return (
      <View style={styles.tableContainer}>
        <View style={styles.tableHeaderContainer}>
          <Text style={styles.tableTitle}>{termLabel} Marks</Text>
          <Button
            title={editMode[term] ? 'Save' : 'Edit'}
            onPress={
              editMode[term] ? handleSaveMarks : () => handleEditToggle(term)
            }
          />
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Subject</Text>
          <Text style={styles.tableHeader}>Total Marks</Text>
          <Text style={styles.tableHeader}>Obtained Marks</Text>
        </View>
        {Object.keys(marksDistribution.subjects).map(subject => (
          <View key={subject} style={styles.tableRow}>
            <Text style={styles.tableCell}>{subject}</Text>
            <Text style={styles.tableCell}>
              {marksDistribution.subjects[subject][term]}
            </Text>
            <TextInput
              style={styles.tableCell}
              value={marks[subject]?.[term]?.toString() || ''}
              editable={editMode[term]}
              onChangeText={value => handleMarksChange(subject, term, value)}
              keyboardType="numeric"
            />
          </View>
        ))}
      </View>
    );
  };

  if (!student || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <>
      <TeacherHeader title="Student Marks Details" />
      <ScrollView style={styles.container}>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Registration Number:</Text>
          <Text style={styles.value}>{student.registrationNumber}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{student.studentName}</Text>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Term:</Text>
          <Picker
            selectedValue={selectedTerm}
            onValueChange={itemValue => setSelectedTerm(itemValue)}
            style={styles.picker}>
            <Picker.Item label="First Term" value="firstTerm" />
            <Picker.Item label="Mid Term" value="midTerm" />
            <Picker.Item label="Final Term" value="finalTerm" />
          </Picker>
        </View>
        {renderTable(selectedTerm)}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleEditStudent}>
            <Image
              source={require('../../assets/icons/pen.png')}
              style={styles.trashButton}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteStudent}>
            <Image
              source={require('../../assets/icons/bin.png')}
              style={styles.trashButton}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  trashButton: {
    width: 30,
    height: 30,
  },
  tableContainer: {
    marginVertical: 20,
  },
  tableHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    width: '33%',
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 16,
    width: '33%',
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
});

export default StudentMarks;

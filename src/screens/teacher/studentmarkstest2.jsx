import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { doc, getDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase/firebaseConfig';
import TeacherHeader from '../../components/teacherheader';

const StudentMarks = ({ route, navigation }) => {
  const { registrationNumber, student } = route.params;

  const [candidate, setStudent] = useState(null);
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const studentsCollection = collection(FIREBASE_DB, 'students');
      const studentSnapshot = await getDocs(studentsCollection);
      const studentList = studentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStudents(studentList);

      const foundStudent = studentList.find(
        candidate => candidate.registrationNumber == registrationNumber,
      );
      if (foundStudent) {
        let _date = new Date(foundStudent.dateOfBirth);
        let _date2 = new Date(foundStudent.dateOfAdmission);
        foundStudent.dateOfBirth = _date.toDateString();
        foundStudent.dateOfAdmission = _date2.toDateString();
        setStudent(foundStudent);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [registrationNumber, navigation]);

  const handleDeleteStudent = async () => {
    try {
      const regNo = registrationNumber.toString();
      await deleteDoc(doc(FIREBASE_DB, 'students', regNo));

      Alert.alert('Success', 'Student deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting student:', error);
      Alert.alert('Error', 'Error deleting student');
    }
  };

  const handleEditStudent = () => {
    navigation.navigate('EditStudent', { candidate });
  };

  if (!candidate) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  const renderTable = (term) => {
    return (
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>{term} Marks</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Subject</Text>
          <Text style={styles.tableHeader}>Total Marks</Text>
          <Text style={styles.tableHeader}>Obtained Marks</Text>
        </View>
        {Object.keys(student.marks).map(subject => (
          <View key={subject} style={styles.tableRow}>
            <Text style={styles.tableCell}>{subject}</Text>
            <Text style={styles.tableCell}>{student.marks[subject][`${term}Total`] || 'N/A'}</Text>
            <Text style={styles.tableCell}>{student.marks[subject][term] || 'N/A'}</Text>
          </View>
        ))}
      </View>
    );
  };

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
        {/* Add other student details here */}

        {renderTable('firstTerm')}
        {renderTable('midTerm')}
        {renderTable('finalTerm')}

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
    shadowOffset: { width: 0, height: 2 },
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
    justifyContent: 'space-between',
    marginTop: 20,
  },
  trashButton: {
    width: 30,
    height: 30,
  },
  tableContainer: {
    marginVertical: 20,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
});

export default StudentMarks;

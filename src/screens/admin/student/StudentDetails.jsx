import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import {doc, getDoc, deleteDoc, collection, getDocs} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import Header from '../../../components/header';
import {TouchableOpacity} from 'react-native-gesture-handler';

const StudentDetail = ({route, navigation}) => {
  const {registrationNumber} = route.params;
  const [student, setStudent] = useState(null);
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
        student => student.registrationNumber == registrationNumber,
      );
      if (foundStudent) {
        // let _date = new Date(foundStudent.dateOfBirth);
        // let _date2 = new Date(foundStudent.dateOfAdmission);
        // foundStudent.dateOfBirth = _date.toDateString();
        // foundStudent.dateOfAdmission = _date2.toDateString();
        setStudent(foundStudent);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    navigation.navigate('EditStudent', {student});
  };

  if (!student) {
    return (
      <View style={styles.loadingContainer}>
        {/* <Text style={styles.loadingText}>Loading...</Text> */}
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <>
      <Header title="Student Details" />
      <View style={styles.container}>
        {/* <Text style={styles.title}>Student Details</Text> */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Registration Number:</Text>
          <Text style={styles.value}>{student.registrationNumber}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{student.studentName}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>{student.dateOfBirth}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Date of Admission:</Text>
          <Text style={styles.value}>{student.dateOfAdmission}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{student.gender}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Father's Name:</Text>
          <Text style={styles.value}>{student.fatherName}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Occupation:</Text>
          <Text style={styles.value}>{student.occupation}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Residence:</Text>
          <Text style={styles.value}>{student.residence}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{student.email}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Remarks:</Text>
          <Text style={styles.value}>{student.remarks}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleEditStudent}>
            <Image
              source={require('../../../assets/icons/pen.png')}
              style={styles.trashButton}
            />
          </TouchableOpacity>
          {/* <Button title="Edit" onPress={handleEditStudent} color="#007BFF" /> */}
          <TouchableOpacity onPress={handleDeleteStudent}>
            <Image
              source={require('../../../assets/icons/bin.png')}
              style={styles.trashButton}
            />
          </TouchableOpacity>
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
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
    justifyContent: 'space-between',
    marginTop: 20,
  },
  trashButton: {
    width: 30,
    height: 30,
    // tintColor: '#66a0de',
  },
});

export default StudentDetail;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import {collection, getDocs, doc, deleteDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import Header from '../../../components/header';

const StudentList = ({navigation}) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsCollection = collection(FIREBASE_DB, 'students');
      const studentSnapshot = await getDocs(studentsCollection);
      const studentList = studentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
    };

    fetchStudents();
  }, []);

  const handleDeleteStudent = async studentId => {
    try {
      await deleteDoc(doc(FIREBASE_DB, 'students', studentId));
      setStudents(students.filter(student => student.id !== studentId));
      Alert.alert('Success', 'Student deleted successfully');
    } catch (error) {
      console.error('Error deleting student:', error);
      Alert.alert('Error', 'Error deleting student');
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() =>
        navigation.navigate('StudentDetails', {
          registrationNumber: item.registrationNumber,
        })
      }>
      <View style={styles.listItemTextContainer}>
        <Text style={styles.listItemText}>
          {item.registrationNumber} - {item.studentName}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() =>
          navigation.navigate('StudentDetails', {
            registrationNumber: item.registrationNumber,
          })
        }>
        <Image
          source={require('../../../assets/icons/eye.png')}
          style={styles.editIcon}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <>
      <Header title="Students" />
      <View style={styles.container}>
        <FlatList
          data={students}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.flatListContent}
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate('addStudent')}>
          <Text style={styles.addButtonText}>Add Student</Text>
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
  flatListContent: {
    paddingBottom: 80, // Ensure there is space above the button
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listItemTextContainer: {
    flex: 1,
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  editIcon: {
    width: 23,
    height: 23,
    tintColor: '#007BFF',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  buttonContainer: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    marginVertical: 20,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StudentList;

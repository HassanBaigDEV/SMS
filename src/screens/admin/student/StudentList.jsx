import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import {collection, getDocs, doc, deleteDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import Header from '../../../components/header';
import {ActivityIndicator} from 'react-native-paper';

const StudentList = ({navigation}) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsCollection = collection(FIREBASE_DB, 'students');
      const studentSnapshot = await getDocs(studentsCollection);
      const studentList = studentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
      setFilteredStudents(studentList);
      setLoading(false);
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        student =>
          student?.registrationNumber
            ?.toString()
            .includes(searchQuery.toLowerCase()) ||
          student?.studentName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery]);

  const handleDeleteStudent = async studentId => {
    try {
      await deleteDoc(doc(FIREBASE_DB, 'students', studentId));
      setStudents(students.filter(student => student.id !== studentId));
      setFilteredStudents(
        filteredStudents.filter(student => student.id !== studentId),
      );
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
          source={require('../../../assets/icons/pwd_eye.png')}
          style={styles.editIcon}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <>
      <Header title="Students" />
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Registration Number or Name"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {loading && (
          <ActivityIndicator animating={true} color="#007bff" size="large" />
        )}
        {!loading && students.length === 0 && (
          <Text>No students found. Add a student to get started.</Text>
        )}
        <FlatList
          data={filteredStudents}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          // contentContainerStyle={styles.flatListContent}
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
    tintColor: 'rgb(0, 123, 255)',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  buttonContainer: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    // marginVertical: 20,
    marginTop: 10,
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
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
});

export default StudentList;

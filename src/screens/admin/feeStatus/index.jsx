import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import {getDocs, collection} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import FeeStatusForm from './FeeStatusForm'; // Import the FeeStatusForm component

const FeeStatus = ({navigation}) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [years, setYears] = useState([]);
  const [student, setStudent] = useState({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const studentsCollection = collection(FIREBASE_DB, 'students');
      const studentSnapshot = await getDocs(studentsCollection);
      const studentList = studentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
      //   console.log('students:', studentList);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSearch = () => {
    // fetchStudents();
    // Filter the students based on search term (registration number)
    const filteredStudents = students.filter(student =>
      student.registrationNumber.toString().includes(searchTerm.trim()),
    );
    console.log('filteredStudents:', students);
    setStudents(filteredStudents);
  };

  const handleShowYears = student => {
    setStudent(student);
    if (student.feeStatus) {
      const feeYears = Object.keys(student.feeStatus);
      setYears(feeYears);
      setModalVisible(true);
    } else {
      //   Alert.alert('No fee status available');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => handleShowYears(item)}>
      <View style={styles.item}>
        <Text>{item.studentName}</Text>
        {/* Display fee status details here */}
      </View>
    </TouchableOpacity>
  );

  const openStatusForm = student => {
    // Navigate to FeeStatusForm page with pre-populated fields
    // Pass student details as props to FeeStatusForm component
    // gett the current year
    let _year = new Date().getFullYear().toString();
    console.log('Current Year:', student);
    // console.log('Student:', student);
    navigation.navigate('FeeStatusForm', {
      year: _year,
      newStudent: student,
    });
    // console.log('Student:', student);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search by Student Registration Number"
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Fee Status Years</Text>
            <FlatList
              data={years}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.yearItem}
                  onPress={() =>
                    navigation.navigate('FeeStatusForm', {student, year: item})
                  }>
                  <Text style={styles.yearText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Add Fee Status" onPress={openStatusForm} />
            <Button title="Close" onPress={handleCloseModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  yearItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  yearText: {
    fontSize: 16,
  },
});

export default FeeStatus;

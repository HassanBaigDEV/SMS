import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import {getDocs, collection} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import Header from '../../../components/header';
import {ActivityIndicator} from 'react-native-paper';

const FeeStatus = ({navigation}) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [student, setStudent] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [year, setYear] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchQuery == '') {
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

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const studentsCollection = collection(FIREBASE_DB, 'students');
      const studentSnapshot = await getDocs(studentsCollection);
      const studentList = studentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
      setFilteredStudents(studentList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSearch = async () => {
    await fetchStudents();
    const filteredStudents = students.filter(student =>
      student.registrationNumber.toString().includes(searchTerm.trim()),
    );
    setStudents(filteredStudents);
  };

  const handleShowYears = student => {
    setStudent(student);
    if (student.feeStatus) {
      const feeYears = Object.keys(student.feeStatus);
      setYears(feeYears);
      setMonths([]);
      setModalVisible(true);
    } else {
      setYears([]);
      setMonths([]);
      setModalVisible(true);
    }
  };

  const handleShowMonths = year => {
    if (student.feeStatus && student.feeStatus[year]) {
      const feeMonths = Object.keys(student.feeStatus[year]);
      setMonths(feeMonths);
    } else {
      setMonths([]);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => handleShowYears(item)}>
      <View style={styles.item}>
        <Text style={styles.itemText}>
          {item.registrationNumber} - {item.studentName}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const openStatusForm = (month = null) => {
    // get current month if month is not provided
    if (!month) {
      const currentMonth = new Date().toLocaleString('default', {
        month: 'long',
      });
      month = currentMonth;
      console.log(month);
    }
    if (year == '') {
      // get current year
      let _year = new Date().getFullYear().toString();
      setYear(_year);
    }
    navigation.navigate('FeeStatusForm', {
      year,
      month,
      student: student,
    });
  };

  return (
    <>
      <Header title="Fee Status" />

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search Student"
          placeholderTextColor="#888"
        />
        {/* <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity> */}
        {loading && (
          <ActivityIndicator animating={true} color="#007BFF" size="large" />
        )}
        <FlatList
          data={filteredStudents}
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
              <Text style={styles.modalTitle}>Fee Status</Text>
              {years.length > 0 ? (
                <>
                  <FlatList
                    data={years}
                    keyExtractor={item => item}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={styles.yearItem}
                        onPress={() => {
                          setYear(item);
                          handleShowMonths(item);
                        }}>
                        <Text style={styles.yearText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  {months.length > 0 && (
                    <FlatList
                      data={months}
                      keyExtractor={item => item}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={styles.monthItem}
                          onPress={() => openStatusForm(item)}>
                          <Text style={styles.monthText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </>
              ) : (
                <Text>No fee status available for the selected student</Text>
              )}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  openStatusForm(new Date().getFullYear().toString())
                }>
                <Text style={styles.addButtonText}>Add Fee Status</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 30,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: 'rgba(142, 9, 168, 0.675)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  yearItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  yearText: {
    fontSize: 16,
  },
  monthItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  monthText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FeeStatus;

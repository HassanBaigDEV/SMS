// SectionDetails.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import {collection, getDocs, doc, setDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../firebase/firebaseConfig';

const SectionDetails = ({route}) => {
  const {classId, sectionId} = route.params;
  const [students, setStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStudentRollNo, setNewStudentRollNo] = useState('');
  const [newStudentName, setNewStudentName] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsCollection = collection(
        FIREBASE_DB,
        `classes/${classId}/sections/${sectionId}/students`,
      );
      const studentSnapshot = await getDocs(studentsCollection);
      const studentList = studentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
    };

    fetchStudents();
  }, [classId, sectionId]);

  const handleAddStudent = async () => {
    if (newStudentRollNo.trim() === '' || newStudentName.trim() === '') {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    try {
      const studentRef = doc(
        FIREBASE_DB,
        `classes/${classId}/sections/${sectionId}/students`,
        newStudentRollNo,
      );
      await setDoc(studentRef, {
        rollNo: newStudentRollNo,
        name: newStudentName,
      });
      setModalVisible(false);
      setNewStudentRollNo('');
      setNewStudentName('');
      //   fetchStudents();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.studentItem}>
      <Text>
        {item.rollNo} - {item.name}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Section {sectionId}</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.addStudentButton}>Add Student</Text>
      </TouchableOpacity>
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Student</Text>
            <TextInput
              style={styles.input}
              placeholder="Roll No"
              value={newStudentRollNo}
              onChangeText={setNewStudentRollNo}
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newStudentName}
              onChangeText={setNewStudentName}
            />
            <Button title="Add" onPress={handleAddStudent} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addStudentButton: {
    color: '#007BFF',
    marginBottom: 20,
  },
  studentItem: {
    padding: 15,
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});

export default SectionDetails;

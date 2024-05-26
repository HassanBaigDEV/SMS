import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, Button} from 'react-native';
import {collection, getDocs, doc, deleteDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';

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
      // Implement logic to delete the student record from the class
      console.log('Student deleted successfully');
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('StudentDetails', {
          registrationNumber: item.registrationNumber,
        })
      }>
      <View
        style={{padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
        <Text>
          {item.registrationNumber} - {item.studentName}
        </Text>
      </View>
      {/* <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Button
          title="Delete"
          onPress={() => handleDeleteStudent(item.registrationNumber)}
        />
      </View> */}
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, padding: 20}}>
      <Button
        title="Create New Student"
        onPress={() => navigation.navigate('addStudent')}
      />
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default StudentList;

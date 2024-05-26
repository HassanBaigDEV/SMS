// ManageTeachers.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {collection, getDocs} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';

const ManageTeachers = ({navigation}) => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachersCollection = collection(FIREBASE_DB, 'teachers');
        const teacherSnapshot = await getDocs(teachersCollection);
        const teacherList = teacherSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeachers(teacherList);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  const renderTeacher = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('TeacherDetail', {teacherId: item.id})
      }>
      <View style={styles.teacherItem}>
        <Text style={styles.teacherName}>{item.name}</Text>
        <Text>{item.assignedClass}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={teachers}
        renderItem={renderTeacher}
        keyExtractor={item => item.id}
      />
      <Button
        title="Add Teacher"
        onPress={() => navigation.navigate('EditTeacher', {isNew: true})}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  teacherItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ManageTeachers;

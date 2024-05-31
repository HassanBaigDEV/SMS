import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {collection, getDocs} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import Header from '../../../components/header';
import {ActivityIndicator} from 'react-native-paper';

const TeacherList = ({navigation}) => {
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setFilteredTeachers(teacherList); // Initialize with all teachers
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const results = teachers.filter(
        teacher =>
          teacher.teacherName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          teacher.idNumber.toString().includes(searchQuery.toLowerCase()),
      );
      setFilteredTeachers(results);
    } else {
      setFilteredTeachers(teachers);
    }
  }, [searchQuery, teachers]);

  const renderTeacher = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('TeacherDetails', {teacherId: item.id})
      }
      style={styles.teacherItem}>
      <Text style={styles.teacherIdNumber}>{item.idNumber}</Text>
      <Text style={styles.teacherName}>{item.teacherName}</Text>
      {/* <Text style={styles.teacherClassAssigned}>
        Class Assigned: {item.classAssigned.join(', ')}
      </Text> */}
    </TouchableOpacity>
  );

  return (
    <>
      <Header title="Teachers" />

      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Teachers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {loading && (
          <ActivityIndicator
            animating={true}
            color="rgb(0, 123, 255)"
            size="large"
            style={{
              marginTop: 50,
            }}
          />
        )}
        {!loading && filteredTeachers.length === 0 && (
          <Text style={styles.noTeachersText}>No teachers found</Text>
        )}

        <FlatList
          data={filteredTeachers}
          renderItem={renderTeacher}
          keyExtractor={item => item.id}
          // ListEmptyComponent={
          //   <Text style={styles.noTeachersText}>No teachers found</Text>
          // }
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTeacher')}>
          <Text style={styles.addButtonText}>Add Teacher</Text>
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
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  teacherItem: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  teacherIdNumber: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  teacherClassAssigned: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
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
  noTeachersText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default TeacherList;

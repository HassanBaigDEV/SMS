import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {collection, getDocs} from 'firebase/firestore';
import {FIREBASE_DB} from '../../firebase/firebaseConfig';
import Header from '../../components/header';

const TeacherScreen = ({route, navigation}) => {
  const {teacher} = route.params;

  const [classData, setClassData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClassData, setFilteredClassData] = useState({});

  const academicYearDetails = Object.keys(teacher.academicYear).map(year => ({
    label: year,
    value: year,
  }));

  const getClassesForYear = year => {
    return (
      teacher.academicYear[year]?.classAssigned.map(
        classObj => classObj.classId,
      ) || []
    );
  };

  const fetchStudents = async year => {
    try {
      setLoading(true);
      const classIds = getClassesForYear(year);
      const newClassData = {};

      for (const classId of classIds) {
        const studentsCollectionRef = collection(
          FIREBASE_DB,
          `classes/${classId}/${year}`,
        );
        const studentsSnapshot = await getDocs(studentsCollectionRef);
        newClassData[classId] = studentsSnapshot.docs.map(doc => doc.data());
      }

      setClassData(newClassData);
      setFilteredClassData(newClassData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const [selectedYear, setSelectedYear] = useState(
    academicYearDetails.length > 0 ? academicYearDetails[0].value : null,
  );

  useEffect(() => {
    if (selectedYear) {
      fetchStudents(selectedYear);
    }
  }, [selectedYear]);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredClassData(classData);
    } else {
      const filtered = {};
      Object.keys(classData).forEach(classId => {
        filtered[classId] = classData[classId].filter(
          student =>
            student?.registrationNumber
              ?.toString()
              .includes(searchQuery.toLowerCase()) ||
            student?.studentName
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()),
        );
      });
      setFilteredClassData(filtered);
    }
  }, [searchQuery, classData]);

  const renderStudentItem = ({item, classId}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() =>
        navigation.navigate('StudentMarks', {
          registrationNumber: item.registrationNumber,
          student: item,
          selectedYear: selectedYear,
          classId: classId,
        })
      }>
      <View style={styles.listItemTextContainer}>
        <Text style={styles.listItemText}>
          {item.registrationNumber} - {item.studentName}
        </Text>
      </View>
      <Image
        source={require('../../assets/icons/eye.png')}
        style={styles.editIcon}
      />
    </TouchableOpacity>
  );

  const renderClassSection = (classId, students) => (
    <View key={classId} style={styles.classSection}>
      <Text style={styles.classHeaderText}>Class: {classId}</Text>
      <FlatList
        data={students}
        renderItem={({item}) => renderStudentItem({item, classId})}
        keyExtractor={(item, index) => index.toString()}
        style={styles.flatList}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title={`Welcome, ${teacher.teacherName}`} nav={false} />
      <Text style={styles.classText}>
        Academic Year {selectedYear}:{' '}
        {getClassesForYear(selectedYear).join(', ')}
      </Text>
      <Picker
        selectedValue={selectedYear}
        onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
        style={styles.picker}>
        {academicYearDetails.map((yearDetail, index) => (
          <Picker.Item
            key={index}
            label={yearDetail.label}
            value={yearDetail.value}
          />
        ))}
      </Picker>
      <View style={styles.list}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Registration Number or Name"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <ScrollView>
            {Object.keys(filteredClassData).map(classId =>
              renderClassSection(classId, filteredClassData[classId]),
            )}
          </ScrollView>
        )}
        {!loading && Object.keys(classData).length === 0 && (
          <Text>No students found. Add a student to get started.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  classText: {
    fontSize: 18,
    marginLeft: 20,
    marginTop: 20,
  },
  picker: {
    width: '30%',
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
  },
  classSection: {
    marginBottom: 20,
  },
  classHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  flatList: {
    flex: 1,
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
  list: {
    flex: 1,
    padding: 20,
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

export default TeacherScreen;

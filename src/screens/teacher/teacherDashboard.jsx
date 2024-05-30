import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, ActivityIndicator, Image, FlatList, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase/firebaseConfig';

const TeacherScreen = ({ route, navigation }) => {
  const { teacher } = route.params;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  const academicYearDetails = Object.keys(teacher.academicYear).map(year => ({
    label: year,
    value: year
  }));

  const getClassForYear = (year) => {
    return teacher.academicYear[year]?.classAssigned || '';
  };

  const fetchStudents = async (year) => {
    try {
      setLoading(true);
      const classId = getClassForYear(year);
      const studentsCollectionRef = collection(
        FIREBASE_DB,
        `classes/${classId}/${year}`
      );
      const studentsSnapshot = await getDocs(studentsCollectionRef);
      const studentsList = studentsSnapshot.docs.map(doc => doc.data());
      setStudents(studentsList);
      setFilteredStudents(studentsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };
const [selectedYear, setSelectedYear] = useState(academicYearDetails.length > 5 ? academicYearDetails[5].value : null);

  useEffect(() => {
    if (selectedYear) {
      fetchStudents(selectedYear);
    }
  }, [selectedYear]);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        student =>
          student?.registrationNumber?.toString().includes(searchQuery.toLowerCase()) ||
          student?.studentName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const renderItem = ({ item }) => (
    
    <TouchableOpacity
      style={styles.listItem}
      // console
      onPress={() =>
        navigation.navigate('StudentMarks', {
          registrationNumber: item.registrationNumber,
          student: item,
          selectedYear:selectedYear
        })
        // {console.log("regnum")
        //   console.log(item.registrationNumber)
        // }
      }
    >
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome, {teacher.teacherName}</Text>
        </View>
      </View>
      <Text style={styles.classText}>Academic Year {selectedYear}: {getClassForYear(selectedYear)}</Text>
      <Picker
        selectedValue={selectedYear}
        onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
        style={styles.picker}
      >
        {academicYearDetails.map((yearDetail, index) => (
          <Picker.Item key={index} label={yearDetail.label} value={yearDetail.value} />
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
          <FlatList
            data={filteredStudents}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.flatList}
          />
        )}
        {!loading && students.length === 0 && (
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
  header: {
    backgroundColor: "#473f97",
    width: "100%",
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: 'white',
  },
  classText: {
    fontSize: 18,
    marginLeft: 20,
  },
  picker: {
    width: '30%',
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
  },
  studentName: {
    fontWeight: 'bold',
    fontSize: 16,
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
    shadowOffset: { width: 0, height: 2 },
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

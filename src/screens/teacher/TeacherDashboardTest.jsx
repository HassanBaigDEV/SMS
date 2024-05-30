import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase/firebaseConfig';

const TeacherScreen = ({ route, navigation }) => {
  const { teacher } = route.params;
  const [students, setStudents] = useState([]);
  // const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);

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

  const renderItem = ({ item }) => (
    <Text style={styles.studentName}>{item.studentName}</Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome, {teacher.teacherName}</Text>
        </View>
      </View>
      <Text style={styles.classText}>Class for {selectedYear}: {getClassForYear(selectedYear)}</Text>
      <Picker
        selectedValue={selectedYear}
        onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
        style={styles.picker}
      >
        {academicYearDetails.map((yearDetail, index) => (
          <Picker.Item key={index} label={yearDetail.label} value={yearDetail.value} />
        ))}
      </Picker>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={students}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.flatList}
        />
      )}
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
});

export default TeacherScreen;

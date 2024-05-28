// StudentAgeRecord.js
import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {collection, getDocs} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import moment from 'moment';

const StudentAgeRecord = () => {
  const [students, setStudents] = useState([]);
  const [totalBoys, setTotalBoys] = useState(0);
  const [totalGirls, setTotalGirls] = useState(0);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(FIREBASE_DB, 'students');
        const studentSnapshot = await getDocs(studentsCollection);
        const studentList = studentSnapshot.docs.map(doc => {
          const data = doc.data();
          const dateOfBirth = new Date(data.dateOfBirth); // Convert date string to Date object
          const age = moment().diff(dateOfBirth, 'years', true);
          return {
            id: doc.id,
            ...data,
            ageYears: Math.floor(age),
            ageMonths: Math.round((age - Math.floor(age)) * 12),
          };
        });

        const boys = studentList.filter(
          student => student.gender === 'Male',
        ).length;
        const girls = studentList.filter(
          student => student.gender === 'Female',
        ).length;

        setStudents(studentList);
        setTotalBoys(boys);
        setTotalGirls(girls);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const renderStudent = ({item}) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.registrationNumber}</Text>
      <Text style={styles.cell}>{item.studentName}</Text>
      <Text style={styles.cell}>{item.fatherName}</Text>
      <Text style={styles.cell}>
        {new Date(item.dateOfBirth).toLocaleDateString()}
      </Text>
      <Text style={styles.cell}>
        {item.ageYears} years, {item.ageMonths} months
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Age Record</Text>
      <View style={styles.row}>
        <Text style={styles.header}>Registration No</Text>
        <Text style={styles.header}>Student Name</Text>
        <Text style={styles.header}>Father Name</Text>
        <Text style={styles.header}>Date of Birth</Text>
        <Text style={styles.header}>Age (years & months)</Text>
      </View>
      <FlatList
        data={students}
        renderItem={renderStudent}
        // keyExtractor={item => item.id}
      />
      <Text>Total Boys: {totalBoys}</Text>
      <Text>Total Girls: {totalGirls}</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  header: {
    flex: 1,
    fontWeight: 'bold',
  },
  cell: {
    flex: 1,
  },
});

export default StudentAgeRecord;

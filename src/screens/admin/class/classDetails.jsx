/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import Dropdown from '../../../components/Dropdown';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Button,
  Image,
} from 'react-native';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  doc,
} from 'firebase/firestore';
import Header from '../../../components/header';
import {years} from '../../../data/academicYear';
import {subjectByClass} from '../../../data/classes';

const ClassDetails = ({route, navigation}) => {
  const {classId} = route.params;
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState(subjectByClass[classId] || []);
  const [showStudents, setShowStudents] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [newStudentRollNo, setNewStudentRollNo] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    if (selectedYear) {
      fetchStudents(selectedYear);
      fetchTeachers(selectedYear);
    }
  }, [selectedYear]);

  useEffect(() => {
    const fetchAllStudents = async () => {
      const studentsCollection = collection(FIREBASE_DB, 'students');
      const studentSnapshot = await getDocs(studentsCollection);
      const studentList = studentSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(student =>
          student.registrationNumber.toString().includes(newStudentRollNo),
        );
      setAllStudents(studentList);
    };

    fetchAllStudents();
  }, [newStudentRollNo, modalVisible]);

  const handleAddStudent = async () => {
    if (newStudentRollNo.trim() === '' || newStudentName.trim() === '') {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    try {
      let subjectsArray = subjectByClass[`${classId}`];
      const subjects = subjectsArray || [];
      const marks = subjects.reduce((acc, subject) => {
        acc[subject] = {firstTerm: null, midTerm: null, finalTerm: null};
        return acc;
      }, {});
      await setDoc(
        doc(
          FIREBASE_DB,
          `classes/${classId}/${selectedYear}`,
          newStudentRollNo.toString(),
        ),
        {
          registrationNumber: parseInt(newStudentRollNo),
          studentName: newStudentName,
          marks,
        },
      );
      const studentRef = doc(FIREBASE_DB, `students/${newStudentRollNo}`);
      const studentData = {
        registrationNumber: newStudentRollNo,
        studentName: newStudentName,
        admissionClass: classId,
        classEnrolled: `classes/${classId}/${selectedYear}`,
        marks: {
          [selectedYear]: marks,
        },
        dateOfAdmission: new Date().toISOString(), // Example date field
      };

      await setDoc(studentRef, studentData, {merge: true});
      Alert.alert('Success', 'Student added successfully');
      setNewStudentRollNo('');
      setNewStudentName('');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const fetchStudents = async year => {
    setLoading(true);
    const studentsCollectionRef = collection(
      FIREBASE_DB,
      `classes/${classId}/${year}`,
    );
    const studentsSnapshot = await getDocs(studentsCollectionRef);
    const studentsList = studentsSnapshot.docs.map(doc => doc.data());
    setStudents(studentsList);
    setLoading(false);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fetchTeachers = async year => {
    setLoading(true);
    const teachersCollectionRef = collection(FIREBASE_DB, 'teachers');
    const q = query(
      teachersCollectionRef,
      where(`academicYear.${year}.classAssigned`, '==', classId),
    );
    const teachersSnapshot = await getDocs(q);
    const teachersList = teachersSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTeachers(teachersList);
    setLoading(false);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const renderTab = year => (
    <TouchableOpacity
      key={year}
      style={[styles.tab, selectedYear === year && styles.selectedTab]}
      onPress={() => {
        setSelectedYear(year);
        fadeAnim.setValue(0); // Reset animation
      }}>
      <Text
        style={[
          styles.tabText,
          selectedYear === year && styles.selectedTabText,
        ]}>
        {year}
      </Text>
    </TouchableOpacity>
  );

  const handleEditTeacher = subject => {
    navigation.navigate('EditTeacherAssignment', {
      classId,
      subject,
      year: selectedYear,
    });
  };

  const getTeacherForSubject = subject => {
    const teacher = teachers.find(
      t => t.academicYear[selectedYear]?.subject === subject,
    );
    return teacher ? teacher.teacherName : 'N/A';
  };

  const renderStudent = ({item}) => (
    <View style={styles.studentItem}>
      <Text style={styles.studentName}>{item.studentName}</Text>
      <Text style={styles.studentRollNo}>{item.registrationNumber}</Text>
    </View>
  );

  const handleSelectStudent = rollNo => {
    setNewStudentRollNo(rollNo);
    const foundStudent = allStudents.find(
      student => student.registrationNumber === rollNo,
    );
    if (foundStudent) {
      setNewStudentName(foundStudent.studentName);
    }
  };

  return (
    <>
      <Header title={`${classId}`} />
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {years.map(year => renderTab(year))}
        </ScrollView>
      </View>
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => setShowStudents(true)}>
          <Text
            style={[styles.toggleButton, showStudents && styles.activeToggle]}>
            Students
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowStudents(false)}>
          <Text
            style={[styles.toggleButton, !showStudents && styles.activeToggle]}>
            Subjects
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : showStudents ? (
          students.length === 0 ? (
            <Text style={styles.noRecordText}>No Record found</Text>
          ) : (
            <Animated.View
              style={{...styles.contentContainer, opacity: fadeAnim}}>
              {students.map(student => renderStudent({item: student}))}
            </Animated.View>
          )
        ) : (
          <Animated.View
            style={{...styles.contentContainer, opacity: fadeAnim}}>
            {subjects.map(subject => (
              <View key={subject} style={styles.subjectItem}>
                <Text style={styles.subjectText}>{subject}</Text>
                <Text style={styles.teacherText}>
                  {getTeacherForSubject(subject)}
                </Text>
                <TouchableOpacity onPress={() => handleEditTeacher(subject)}>
                  <Image
                    source={require('../../../assets/icons/pencil.png')}
                    style={styles.editIcon}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </Animated.View>
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add New Student</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Student</Text>
            <TextInput
              style={styles.input}
              placeholder="Roll No"
              value={newStudentRollNo}
              onChangeText={text => setNewStudentRollNo(text)}
            />
            <View style={styles.input}>
              <Dropdown
                label="Select Student"
                data={allStudents.map(student => ({
                  label: student.studentName,
                  value: student.registrationNumber.toString(),
                }))}
                onSelect={handleSelectStudent}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Year"
              value={selectedYear}
              editable={false}
            />
            {/* <TextInput
              style={styles.input}
              placeholder="Student Name"
              value={newStudentName}
              onChangeText={text => setNewStudentName(text)}
            /> */}
            <View style={styles.modalButtons}>
              <Button title="Add" onPress={handleAddStudent} color="#007BFF" />
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                color="#FF0000"
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedTab: {
    backgroundColor: 'rgb(0, 123, 255)',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(0, 123, 255)',
  },
  selectedTabText: {
    color: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(0, 123, 255)',
    marginHorizontal: 5,
  },
  activeToggle: {
    backgroundColor: 'rgb(0, 123, 255)',
    color: '#fff',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  contentContainer: {
    opacity: 1,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
  },
  studentRollNo: {
    fontSize: 16,
    color: '#666',
  },
  subjectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '500',
  },
  teacherText: {
    fontSize: 16,
    color: '#666',
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: '#007BFF',
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    marginVertical: 20,
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
    fontSize: 18,
    fontWeight: 'bold',
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  noRecordText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
});

export default ClassDetails;

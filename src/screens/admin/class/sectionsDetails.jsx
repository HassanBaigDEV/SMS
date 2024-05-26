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
  Animated,
} from 'react-native';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  addDoc,
} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import Dropdown from '../../../components/Dropdown';

const SectionDetails = ({route}) => {
  const {classId, students, year} = route.params;

  // const [students, setStudents] = useState([]);
  const sectionId = null;
  const [modalVisible, setModalVisible] = useState(false);
  const [newStudentRollNo, setNewStudentRollNo] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [allStudents, setAllStudents] = useState([]);
  // const [expandedYears, setExpandedYears] = useState({});
  // useEffect(() => {
  //   const fetchStudents = async () => {
  //     const studentsCollection = collection(
  //       FIREBASE_DB,
  //       `classes/${classId}/sections/${sectionId}/students`,
  //     );
  //     const studentSnapshot = await getDocs(studentsCollection);
  //     const studentList = studentSnapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setStudents(studentList);
  //   };

  //   fetchStudents();
  // }, [classId, sectionId]);

  // const fetchStudents = async () => {
  //   try {
  //     const sectionRef = doc(
  //       FIREBASE_DB,
  //       `classes/${classId}/sections/${sectionId}`,
  //     );

  //     const sectionDoc = await getDoc(sectionRef);
  //     if (sectionDoc.exists()) {
  //       const sectionData = sectionDoc.data();
  //       const years = Object.keys(sectionData).map(key => {
  //         return key;
  //       });

  //       const yearStudents = [];
  //       for (const year of years) {
  //         yearStudents.push({
  //           year: year,
  //           students: sectionData[year] || [],
  //         });
  //       }
  //       // setStudents(yearStudents);
  //       console.log('Fetched students:', sectionData['2019'] || []);
  //     } else {
  //       console.error('Section document does not exist');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching students:', error);
  //   }
  // };
  // useEffect(() => {
  //   // fetchStudents();
  // }, [classId]);

  //   useEffect(() => {
  //     const fetchAllStudents = async () => {
  //       const studentsCollection = collection(FIREBASE_DB, 'students');
  //       const studentSnapshot = await getDocs(studentsCollection);
  //       const studentList = studentSnapshot.docs
  //         .map(doc => ({
  //           id: doc.id,
  //           ...doc.data(),
  //         }))
  //         .filter(
  //           student => student.registrationNumber === Number(newStudentRollNo),
  //         );
  //       setAllStudents(studentList);
  //     };

  //     fetchAllStudents();
  //   }, [newStudentRollNo]);
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
  useEffect(() => {
    fetchAllStudents();
  });

  const handleAddStudent = async () => {
    if (newStudentRollNo.trim() === '' || newStudentName.trim() === '') {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    try {
      // Replace with the actual year
      // const studentsCollection = collection(
      //   FIREBASE_DB,
      //   `classes/${classId}/${year}`,
      // );
      // const studentDocRef = doc(
      //   studentsCollection,
      //   newStudentRollNo.toString(),
      // );
      // console && console.log('studentDocRef', studentDocRef);
      // await setDoc(studentDocRef, {
      //   registrationNumber: parseInt(newStudentRollNo),
      //   studentName: newStudentName,
      //   marks: {
      //     firstTerm: null,
      //     midTerm: null,
      //     finalTerm: null,
      //   },
      // });
      // await addDoc(collection(FIREBASE_DB, `classes/class 5/2019`), {
      //   registrationNumber: parseInt(newStudentRollNo),

      //   // Other student data (name, age, etc.)
      // });
      console.log(`classes/${classId}/${year}`);
      await setDoc(
        doc(
          FIREBASE_DB,
          `classes/${classId}/${year}`,
          newStudentRollNo.toString(),
        ),
        {
          registrationNumber: parseInt(newStudentRollNo),
          studentName: newStudentName,
          marks: {
            firstTerm: null,
            midTerm: null,
            finalTerm: null,
          },
        },
      );
      // await setDoc(studentRef, studentData);
      Alert.alert('Success', 'Student added successfully');
      // Clear the input fields and close the modal
      setNewStudentRollNo('');
      setNewStudentName('');
      setModalVisible(false);
      // Optionally, fetch the updated list of students
      // fetchStudents();
    } catch (error) {
      Alert.alert('Error', error.message);
    }

    // try {
    //   const sectionRef = doc(
    //     FIREBASE_DB,
    //     `classes/${classId}/sections/${sectionId}`,
    //   );

    //   // Get the current data of the section document
    //   const sectionDoc = await getDoc(sectionRef);
    //   if (sectionDoc.exists()) {
    //     const sectionData = sectionDoc.data();

    //     // Create a new section data object with the updated student array under the specified year
    //     const updatedSectionData = {
    //       ...sectionData,
    //       [year]: [
    //         ...(sectionData[year] || []), // Add existing data if any
    //         {
    //           rollNo: newStudentRollNo,
    //           name: newStudentName,
    //           marks: {
    //             firstTerm: null,
    //             midTerm: null,
    //             finalTerm: null,
    //           },
    //         },
    //       ],
    //     };

    //     // Update the section document with the new data
    //     await setDoc(sectionRef, updatedSectionData);
    //     fetchStudents();
    //   } else {
    //     console.error('Section document does not exist');
    //   }
    //   //   //find student by roll no in firestore add the class and section in class enroled

    //   //   const studentDocRef = doc(FIREBASE_DB, 'students', newStudentRollNo);
    //   //   const studentDoc = await getDoc(studentDocRef);
    //   //   const studentData = studentDoc.data();
    //   //   const classEnrolled = studentData.classesEnrolled || [];
    //   //   classEnrolled.push({});
    //   //   classEnrolled.push({classId, sectionId});

    //   //add a refrence of student in section

    //   setModalVisible(false);
    //   setNewStudentRollNo('');
    //   setNewStudentName('');
    //   // fetchStudents();
    // } catch (error) {
    //   Alert.alert('Error', error.message);
    // }
  };

  const handleSelectStudent = rollNo => {
    setNewStudentRollNo(rollNo);
    const foundStudent = allStudents.find(
      student => student.registrationNumber === Number(rollNo),
    );
    if (foundStudent) {
      setNewStudentName(foundStudent.studentName);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.studentItem}>
      <Text>
        {item.registrationNumber} - {item.studentName}
      </Text>
    </View>
  );

  const toggleYearExpansion = year => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year],
    }));
  };
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

      {/* {students.map(yearData => (
        <View key={yearData.year}>
          <TouchableOpacity
            style={styles.yearHeader}
            onPress={() => toggleYearExpansion(yearData.year)}>
            <Text style={styles.yearHeaderText}>Year {yearData.year}</Text>
          </TouchableOpacity>
          <Animated.View
            style={[
              styles.animatedContainer,
              {
                maxHeight: expandedYears[yearData.year] ? '100%' : 0,
              },
            ]}> */}
      {/* <FlatList
              data={yearData.students}
              renderItem={renderItem}
              keyExtractor={item => item.rollNo}
            />
          </Animated.View> */}
      {/* </View>
      ))} */}

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
              style={{display: 'none'}}
              placeholder="Name"
              value={newStudentName}
              editable={false}
            />
            {/* an year field with value of current year that is fetched from Date in a string */}
            <TextInput
              style={styles.input}
              placeholder="Year"
              value={year}
              editable={false}
            />

            <Button
              title="Add"
              style={{
                marginTop: 10,
                color: '#007BFF',
              }}
              onPress={handleAddStudent}
            />
            <Button
              title="Cancel"
              style={{marginTop: 10, color: 'red'}}
              onPress={() => {
                setModalVisible(false);
                setNewStudentRollNo('');
                setNewStudentName('');
              }}
            />
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
    marginTop: 20,
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
    backgroundColor: '#fff',
    margin: 20,
    width: '80%',
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

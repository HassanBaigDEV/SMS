import React, {useState, useEffect} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import {
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  arrayRemove,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import {years} from '../../../data/academicYear';

const StudentDetail = ({route, navigation}) => {
  const {registrationNumber} = route.params;

  const [student, setStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const classIds = ['class 1', 'class 2', 'class 5'];
  const currentYear = new Date().getFullYear().toString();

  const fetchStudents = async () => {
    try {
      const studentsCollection = collection(FIREBASE_DB, 'students');
      const studentSnapshot = await getDocs(studentsCollection);
      const studentList = studentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // console.log('Fetched students:', studentList); // Log the fetched students
      setStudents(studentList);

      studentList.map(student => {
        if (student.registrationNumber == registrationNumber) {
          setStudent(student);
        }
      });
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationNumber, navigation]);

  //   const handleDeleteStudent = async () => {
  //     try {
  //       // Delete the student document from the students collection
  //       const regNo = registrationNumber.toString();

  //       //   await deleteDoc(doc(FIREBASE_DB, 'students', regNo));

  //       // Delete references in classes and sections
  //       const classesCollection = collection(FIREBASE_DB, 'classes');
  //       const classSnapshot = await getDocs(classesCollection);
  //       const classList = classSnapshot.docs.map(doc => doc.id);

  //       for (const classId of classList) {
  //         const sectionsCollection = collection(
  //           FIREBASE_DB,
  //           `classes/${classId}/sections`,
  //         );
  //         const sectionSnapshot = await getDocs(sectionsCollection);
  //         const sectionList = sectionSnapshot.docs.map(doc => doc.id);

  //         for (const sectionId of sectionList) {
  //           const sectionDocRef = doc(
  //             FIREBASE_DB,
  //             `classes/${classId}/sections/${sectionId}`,
  //           );

  //           // Remove the student from the section's students array
  //           await updateDoc(sectionDocRef, {
  //             students: arrayRemove(regNo), // Remove the student by registration number
  //           });
  //         }
  //       }

  //       //   // Update the local students state
  //       const updatedStudents = students.filter(
  //         student => student.id != registrationNumber,
  //       );
  //       setStudents(updatedStudents);

  //       Alert.alert('Success', 'Student deleted successfully');
  //       navigation.goBack();
  //     } catch (error) {
  //       console.error('Error deleting student:', error);
  //       Alert.alert('Error', 'Error deleting student');
  //     }
  //   };

  const handleDeleteStudent = async () => {
    try {
      // Delete the student document from the students collection
      const regNo = registrationNumber.toString();
      await deleteDoc(doc(FIREBASE_DB, 'students', regNo));

      // Delete references in all class/year documents
      //   for (const classId of classIds) {
      //     const path = `classes/${classId}/${currentYear}`;
      //     const classDocRef = doc(FIREBASE_DB, path, regNo);
      //     const classDoc = await getDoc(classDocRef);

      //     const collectionRef = collection(FIREBASE_DB, path);
      //     console.log(collectionRef.listDocuments());

      //     if (classDoc) {
      //       await deleteDoc(classDocRef);
      //       console.log(`Deleted document: ${classDocRef.id}`);
      //     } else {
      //       console.log(`Document does not exist: ${classDocRef.id}`);
      //     }
      //   }

      //   Alert.alert('Success', 'Student deleted successfully');
      //   navigation.goBack();
      //   const reg = '1234';
      //   const collectionRef = collection(FIREBASE_DB, `classes/class 5/2024`);

      //   // Create a query against the collection.
      //   const q = query(collectionRef, where('registrationNumber', '==', reg));

      //   const querySnapshot = await getDocs(q);
      //   querySnapshot.forEach(doc => {
      //     console.log(doc.id, ' => ', doc.data());
      //   });

      Alert.alert('Success', 'Student deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting student:', error);
      Alert.alert('Error', 'Error deleting student');
    }
  };

  const handleEditStudent = () => {
    navigation.navigate('EditStudent', {student});
  };

  if (!student) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Registration Number: {student.registrationNumber}
      </Text>
      <Text style={styles.label}>Name: {student.studentName}</Text>
      <Text style={styles.label}>Date of Birth: {student.dateOfBirth}</Text>
      <Text style={styles.label}>
        Date of Admission: {student.dateOfAdmission}
      </Text>
      <Text style={styles.label}>Gender: {student.gender}</Text>
      <Text style={styles.label}>Father's Name: {student.fatherName}</Text>
      <Text style={styles.label}>Occupation: {student.occupation}</Text>
      <Text style={styles.label}>Residence: {student.residence}</Text>
      <Text style={styles.label}>Email: {student.email}</Text>
      <Text style={styles.label}>Remarks: {student.remarks}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Edit" onPress={handleEditStudent} />
        <Button title="Delete" onPress={handleDeleteStudent} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default StudentDetail;

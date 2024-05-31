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
  ToastAndroid,
  Platform,
} from 'react-native';

import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  doc,
  arrayUnion,
  updateDoc,
  arrayRemove,
  getDoc,
} from 'firebase/firestore';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import Header from '../../../components/header';
import {years} from '../../../data/academicYear';
import {subjectByClass} from '../../../data/classes';
import {launchImageLibrary} from 'react-native-image-picker';
import {get, set} from 'firebase/database';

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
  const [image, setImage] = useState(null);
  const [transferred, setTransferred] = useState(0);
  const [subjectModalVisible, setSubjectModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newTeacher, setNewTeacher] = useState('');
  const [allTeachers, setAllTeachers] = useState([]);
  const [syllabus, setSyllabus] = useState(null);

  const _storage = getStorage();

  useEffect(() => {
    const fetchSyllabus = async () => {
      // console.log('sseees');
      const syllabusRef = doc(FIREBASE_DB, 'syllabus', `${classId}`);
      // console.log('syllabusRef', syllabusRef);
      const syllabusSnapshot = await getDoc(syllabusRef);
      console.log('syllabusSnapshot', syllabusSnapshot);
      const syllabusData = syllabusSnapshot.data();
      console.log('syllabusData', syllabusData.syllabus);
      setSyllabus(syllabusData.syllabus);
    };
    fetchSyllabus();
  }, []);

  useEffect(() => {
    fetchAllTeachers();
  }, [navigation]);

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

  useEffect(() => {
    const fetchMatchingTeachers = async () => {
      setLoading(true);
      try {
        const teachersCollectionRef = collection(FIREBASE_DB, 'teachers');
        const teachersSnapshot = await getDocs(teachersCollectionRef);
        const teachersList = teachersSnapshot.docs
          .map(doc => ({
            ...doc.data(),
            id: doc.id,
          }))
          .filter(teacher => teacher.idNumber.toString().includes(newTeacher));
        setAllTeachers(teachersList);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatchingTeachers();
  }, [newTeacher, subjectModalVisible]);

  const fetchAllTeachers = async () => {
    setLoading(true);
    try {
      const teachersCollectionRef = collection(FIREBASE_DB, 'teachers');
      const teachersSnapshot = await getDocs(teachersCollectionRef);
      const teachersList = teachersSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAllTeachers(teachersList);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const chooseImage = async () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // const source = {uri: response.assets[0].uri};

        // console.log('-----------------------', response);
        // const _response = await fetch(response.assets[0].uri);
        // const blob = await _response.blob();
        // console.log('blob', blob);
        // await uploadImage(source.uri);
        const source = {uri: response.assets[0].uri};
        console.log(source);
        await uploadImage(source.uri);
      }
    });
    // launchImageLibrary({noData: true}, response => {
    //   if (response) {
    //     console.log(response);
    //     // setPhoto(response);
    //   }
    // });
  };
  // const uploadImage = async uri => {
  //   const filename = uri.substring(uri.lastIndexOf('/') + 1);
  //   console.log('filename', filename);
  //   console.log('uploadUri', uri);
  //   const storageRef = ref(_storage, `images/${filename}`);
  //   console.log('storageRef', storageRef);
  //   const metadata = {
  //     contentType: 'image/jpeg',
  //   };
  //   uploadBytes(storageRef, uri).then(snapshot => {
  //     console.log('Uploaded a blob or file!', snapshot);
  //     getDownloadURL(storageRef).then(url => {
  //       console.log('url', url);
  //       saveImageURLToFirestore(url);
  //       setImageUrl(url);
  //       setImage(filename);
  //       // show a loading toast
  //       ToastAndroid.show('Uploading', ToastAndroid.SHORT);
  //     });
  //   });
  //   // uploadTask.on(
  //   //   'state_changed',
  //   //   snapshot => {
  //   //     const progress =
  //   //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //   //     console.log('Upload is ' + progress + '% done');
  //   //     ToastAndroid.show(`Uploading ${progress}`, ToastAndroid.SHORT);
  //   //     switch (snapshot.state) {
  //   //       case 'paused':
  //   //         console.log('Upload is paused');
  //   //         break;
  //   //       case 'running':
  //   //         ToastAndroid.show('Uploading', ToastAndroid.SHORT);
  //   //         console.log('Upload is running');
  //   //         break;
  //   //     }
  //   //   },
  //   //   error => {
  //   //     console.log(error);
  //   //     ToastAndroid.show('Error uploading image', ToastAndroid.SHORT);
  //   //   },
  //   // );
  // };

  const uploadImage = async uri => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    console.log('filename', filename);
    console.log('uploadUri', uri);

    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(_storage, `images/${filename}`);
      console.log('storageRef', storageRef);

      const snapshot = await uploadBytes(storageRef, blob);
      console.log('Uploaded a blob or file!', snapshot);

      const url = await getDownloadURL(storageRef);
      console.log('url', url);

      saveImageURLToFirestore(url);
      setImageUrl(url);
      setImage(filename);

      ToastAndroid.show('Uploading', ToastAndroid.LONG);
    } catch (error) {
      console.error('Error uploading image: ', error);
      ToastAndroid.show('Error uploading image', ToastAndroid.SHORT);
    }
  };

  const saveImageURLToFirestore = async url => {
    try {
      setDoc(
        doc(FIREBASE_DB, 'syllabus', `${classId}`),
        {
          syllabus: url,
        },
        {merge: true},
      );
      console.log('Image URL saved to Firestore!');
      // Alert.alert('Success', 'Syllabus uploaded successfully');
      // show a toast message
      ToastAndroid.show('Syllabus uploaded successfully', ToastAndroid.SHORT);
      setSyllabus(url);
    } catch (e) {
      console.error('Error saving image URL to Firestore: ', e);
    }
  };

  const handleAddStudent = async () => {
    if (newStudentRollNo.trim() === '' || newStudentName.trim() === '') {
      // Alert.alert('Error', 'Please fill all fields.');
      ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
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
      // Alert.alert('Success', 'Student added successfully');
      ToastAndroid.show('Student added successfully', ToastAndroid.SHORT);
      setNewStudentRollNo('');
      setNewStudentName('');
      setModalVisible(false);
    } catch (error) {
      // Alert.alert('Error', error.message);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
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

  // const fetchTeachers = async year => {
  //   setLoading(true);

  //   try {
  //     const teachersCollectionRef = collection(FIREBASE_DB, 'teachers');
  //     const teachersSnapshot = await getDocs(teachersCollectionRef);
  //     const teachersList = teachersSnapshot.docs
  //       .map(doc => ({...doc.data(), id: doc.id}))
  //       .filter(teacher => {
  //         const classAssigned = teacher.academicYear?.[year]?.classAssigned;
  //         console.log('classass', classAssigned);
  //         // return classesAssigned.some(
  //         //   classInfo => classInfo.classId === classId,
  //         // );
  //         // let _teachers = classesAssigned.map(elm => {
  //         //   if (elm.classId == classId) {
  //         //     return elm;
  //         //   }
  //         // });
  //         // console.log('_teachers', _teachers);
  //         // console.log('classesAssigned', classesAssigned);
  //       });
  //     console.log('teachersList', teachersList);
  //     setTeachers(teachersList);
  //   } catch (error) {
  //     console.error('Error fetching teachers:', error);
  //   } finally {
  //     setLoading(false);
  //     Animated.timing(fadeAnim, {
  //       toValue: 1,
  //       duration: 500,
  //       useNativeDriver: true,
  //     }).start();
  //   }
  // };

  const fetchTeachers = async year => {
    setLoading(true);

    try {
      const teachersCollectionRef = collection(FIREBASE_DB, 'teachers');
      const teachersSnapshot = await getDocs(teachersCollectionRef);
      const teachersList = teachersSnapshot.docs
        .map(doc => ({...doc.data(), id: doc.id}))
        .filter(teacher => {
          const classesAssigned =
            teacher.academicYear?.[year]?.classAssigned || [];
          return (
            Array.isArray(classesAssigned) &&
            classesAssigned.some(classInfo => classInfo.classId === classId)
          );
        });

      setTeachers(teachersList);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
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

  const handleEditSubject = subject => {
    setSelectedSubject(subject);
    setNewTeacher(getTeacherIdForSubject(subject));
    console.log('teacherID', newTeacher);
    setSubjectModalVisible(true);
    // navigation.navigate('EditTeacherAssignment', {
    //   classId,
    //   subject,
    //   year: selectedYear,
    // });
  };

  const getTeacherIdForSubject = subject => {
    const teacher = teachers.find(t => {
      const classesAssigned = t.academicYear[selectedYear]?.classAssigned || [];
      return classesAssigned.some(classInfo => classInfo.subject === subject);
    });

    return teacher ? teacher.idNumber.toString() : 'N/A';
  };

  const getTeacherForSubject = subject => {
    // console.log('subject', subject);
    const teacher = teachers.find(t => {
      const classesAssigned = t.academicYear[selectedYear]?.classAssigned || [];

      return classesAssigned.some(
        classInfo =>
          classInfo.classId == classId && classInfo.subject === subject,
      );
    });

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

  // const assignTeacher = async () => {
  //   if (newTeacher.trim() === '') {
  //     Alert.alert('Error', 'Please enter teacher name');
  //     return;
  //   }

  //   try {
  //     //check if new teacher exists in teachers collection in firebase
  //     const teachersCollectionRef = collection(FIREBASE_DB, 'teachers');
  //     const teachersSnapshot = await getDocs(teachersCollectionRef);
  //     const _teachers = teachersSnapshot.docs.map(doc => doc.data());
  //     console.log('teachers', _teachers);
  //     let teacher;
  //     _teachers.map(t => {
  //       if (t.idNumber == newTeacher) {
  //         teacher = t;
  //         console.log('xsss', t);
  //       }
  //     });

  //     // const teacher = teachers.find(t => t.teacherName === newTeacher);
  //     if (teacher) {
  //       const teacherRef = doc(FIREBASE_DB, 'teachers', newTeacher);

  //       // const teacherData = {
  //       //   teacherName: teacher.teacherName,
  //       //   academicYear: {
  //       //     [selectedYear]: {
  //       //       ...teacher?.academicYear[selectedYear],
  //       //       classAssigned: arrayUnion({classId, subject: selectedSubject}),
  //       //     },
  //       //   },
  //       // };

  //       await updateDoc(teacherRef, {
  //         [`academicYear.${selectedYear}.classAssigned`]: arrayUnion({
  //           classId,
  //           subject: selectedSubject,
  //         }),
  //       });
  //       console.log('Teacher data updated successfully.');
  //       Alert.alert('Success', 'Teacher assigned successfully');
  //       setNewTeacher('');
  //     } else {
  //       Alert.alert('Error', 'Teacher does not exist');
  //     }
  //     setSubjectModalVisible(false);
  //   } catch (error) {
  //     Alert.alert('Error', error.message);
  //   }
  // };

  const assignTeacher = async () => {
    if (newTeacher.trim() === '') {
      // Alert.alert('Error', 'Please enter teacher ID number');
      ToastAndroid.show('Please enter teacher ID number', ToastAndroid.SHORT);
      return;
    }

    try {
      // Fetch all teachers from the collection
      const teachersCollectionRef = collection(FIREBASE_DB, 'teachers');
      const teachersSnapshot = await getDocs(teachersCollectionRef);
      const _teachers = teachersSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Check if the new teacher exists
      let teacher;
      _teachers.map(t => {
        if (t.idNumber == newTeacher) {
          teacher = t;
        }
      });

      if (teacher) {
        const teacherRef = doc(FIREBASE_DB, 'teachers', teacher.id);

        // Remove the class assignment from any other teacher who has this class assigned in the same academic year
        const otherTeacherWithClassAssigned = _teachers.find(t => {
          const classesAssigned =
            t.academicYear?.[selectedYear]?.classAssigned || [];
          return (
            Array.isArray(classesAssigned) &&
            classesAssigned.some(
              classInfo =>
                classInfo.classId == classId &&
                classInfo.subject === selectedSubject,
            )
          );
        });

        if (otherTeacherWithClassAssigned) {
          // console.log(
          //   'Other teacher with class assigned:',
          //   otherTeacherWithClassAssigned,
          // );
          const otherTeacherRef = doc(
            FIREBASE_DB,
            'teachers',
            otherTeacherWithClassAssigned.id,
          );
          const updatedClassesAssigned =
            otherTeacherWithClassAssigned.academicYear[
              selectedYear
            ].classAssigned.filter(classInfo => classInfo.classId !== classId);
          await updateDoc(otherTeacherRef, {
            [`academicYear.${selectedYear}.classAssigned`]:
              updatedClassesAssigned,
          });
        }

        // Assign the class to the new teacher
        await updateDoc(teacherRef, {
          [`academicYear.${selectedYear}.classAssigned`]: arrayUnion({
            classId,
            subject: selectedSubject,
          }),
        });

        // Alert.alert('Success', 'Teacher assigned successfully');
        ToastAndroid.show('Teacher assigned successfully', ToastAndroid.SHORT);
        setNewTeacher('');
      } else {
        // Alert.alert('Error', 'Teacher does not exist');
        ToastAndroid.show('Teacher does not exist', ToastAndroid.SHORT);
      }

      setSubjectModalVisible(false);
    } catch (error) {
      // Alert.alert('Error', error.message);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };

  const handleSelectTeacher = idNumber => {
    setNewTeacher(idNumber);
    const foundTeacher = allTeachers.find(
      teacher => teacher.idNumber === idNumber,
    );
    if (foundTeacher) {
      setNewTeacher(foundTeacher.teacherName);
    }
  };
  const handleSyllabusDlt = async () => {
    try {
      ToastAndroid.show('Deleting Syllabus', ToastAndroid.SHORT);
      await setDoc(
        doc(FIREBASE_DB, 'syllabus', `${classId}`),
        {
          syllabus: '',
        },
        {merge: true},
      );
      // Alert.alert('Success', 'Syllabus deleted successfully');
      // show a toast message
      ToastAndroid.show('Syllabus deleted successfully', ToastAndroid.SHORT);
      setSyllabus(null);
    } catch (e) {
      console.error('Error deleting syllabus:', e);
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
                <View style={styles.subjectSubContainer}>
                  <Text style={styles.teacherText}>
                    {getTeacherForSubject(subject)}
                  </Text>
                  <TouchableOpacity onPress={() => handleEditSubject(subject)}>
                    <Image
                      source={require('../../../assets/icons/pencil.png')}
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </Animated.View>
        )}
      </ScrollView>
      {!showStudents && (
        <>
          {syllabus && (
            <View style={styles.syllabusImageContainer}>
              {/* <View style={styles.syllabusImageSubContainer}> */}
              {/* <Text style={styles.syllabusText}>Syllabus:</Text> */}
              <Image source={{uri: syllabus}} style={styles.syllabusImage} />
              {/* </View> */}
              <TouchableOpacity onPress={handleSyllabusDlt}>
                <Image
                  source={require('../../../assets/icons/bin.png')}
                  style={styles.syllabusImageDlt}
                />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.addButton} onPress={chooseImage}>
            <Text style={styles.addButtonText}>Upload Syllabus</Text>
          </TouchableOpacity>
        </>
      )}
      {showStudents && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Add New Student</Text>
        </TouchableOpacity>
      )}
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
      {/* modal for uploading image and assigning teacher */}
      <Modal
        visible={subjectModalVisible}
        transparent={true}
        animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Assign Teacher</Text>
            <TextInput
              style={styles.input}
              placeholder="TeacherID"
              value={newTeacher}
              onChangeText={text => setNewTeacher(text)}
              editable={true}
            />
            {/* <View style={styles.input}>
              <Dropdown
                label="Select Teacher"
                data={allTeachers.map(teacher => ({
                  label: teacher.teacherName,
                  value: teacher.idNumber.toString(),
                }))}
                onSelect={handleSelectTeacher}
              />
            </View> */}
            <TextInput
              style={styles.input}
              placeholder="Subject"
              value={selectedSubject}
              onChangeText={text => setSelectedSubject(text)}
              editable={false}
            />

            <View style={styles.modalButtons}>
              <Button title="Assign" onPress={assignTeacher} color="#007BFF" />
              <Button
                title="Cancel"
                onPress={() => setSubjectModalVisible(false)}
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
  subjectSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    // alignItems: 'flex-end',
    textAlign: 'left',
    marginRight: 20,
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
  syllabusImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 30,
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,

    // marginVertical: 20,
  },
  syllabusImageSubContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  syllabusText: {
    fontSize: 16,
    fontWeight: '500',
    paddingTop: 20,
    color: '#666',
  },
  syllabusImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    paddingVertical: 0,
  },
  syllabusImageDlt: {
    width: 20,
    height: 20,
    tintColor: '#FF0000',
    marginLeft: 10,
  },
});

export default ClassDetails;

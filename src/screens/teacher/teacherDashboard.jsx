import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator,ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FIREBASE_AUTH ,FIREBASE_DB} from '../../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import {doc, getDoc,getDocs, getFirestore, collection, query, where} from 'firebase/firestore';
import 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontSize, Color, FontFamily, Border } from "../../../GlobalStyles";
import RNPickerSelect from 'react-native-picker-select';
import TeacherHeader from '../../components/teacherheader';









  const TeacherScreen = ({route, navigation}) => {
  const { teacher } = route.params;
  const [students, setStudents] = useState([]);


  const [academicYearDetailss, setacademicYearDetails] = useState();

  // const [classId, setClassid] = useState('');
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [name, setName] = useState('');
  const [firstTerm, setFirstTerm] = useState('');
  const [midTerm, setMidTerm] = useState('');
  const [finalTerm, setFinalTerm] = useState('');
  const [search, setSearch] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);














  

if(teacher){
const getAcademicYearDetails = (teacher) => {
  const academicYears = teacher.academicYear;
  const years = Object.keys(academicYears); // Get all years
  const details = years.map(year => {
    return {
      year: year,
      classAssigned: academicYears[year].classAssigned,
      subject: academicYears[year].subject
    };
  });
  return details;
};

// Usage
const academicYears = getAcademicYearDetails(teacher);
console.log("academicYears");
console.log(academicYears);

}



  const academicYearDetails = Object.keys(teacher.academicYear).map(year => ({
    label: year,
    value: year
  }));

  




const getClassForYear = (year) => {
  const a =teacher.academicYear[year]?.classAssigned || '';
console.log("*******************************")
console.log(a)
// setClassid(a);
return a;

};

const [selectedYear, setSelectedYear] = useState(academicYearDetails.length > 5 ? academicYearDetails[5].value : null);




const classId = getClassForYear(selectedYear);

const fetchStudents = async (year) => {
  try {
    // setLoading(true);
    const studentsCollectionRef = collection(
      FIREBASE_DB,
      `classes/${classId}/${year}`
    );
    const studentsSnapshot = await getDocs(studentsCollectionRef);
    const studentsList = studentsSnapshot.docs.map(doc => doc.data());
    setStudents(studentsList);
    // setLoading(false);
    console.log("students");
    console.log(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    setLoading(false); // Make sure to stop loading even if an error occurs.j.
  }
};

useEffect(() => {
  if (classId && selectedYear) {
    fetchStudents(selectedYear);
  }
}, [classId, selectedYear]);




// const handleLogout = async () => {
//     try {
//       // setShowLogoutModal(true);
//       await signOut(FIREBASE_AUTH);
//       console.log('Logout Successful!');
//     } catch (error) {
//       console.error('Logout Error:', error.message);
//     } finally {
//       setTimeout(() => {
//         setShowLogoutModal(false);
//         navigation.navigate('TeacherLogin');
//       }, 3000);
//     }
//   };



return (
  <ScrollView style={styles.container}>
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

    <ScrollView>
      <Text>Hi</Text>
    
    </ScrollView>


  </ScrollView>
);






};

const styles = StyleSheet.create({
    container: {
    // flex: 1,
    // padding: 16,
  },
  header: {
    backgroundColor: "#473f97",
    width: "100%",
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
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
  },
  classText: {
    fontSize: 18,
    marginLeft: 20,
  },



  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    marginTop: 16,
    backgroundColor: 'blue',
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
  },
   picker: {
    width: '30%',
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
  },
});



const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 10,
    paddingHorizontal: 2,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});


export default TeacherScreen;

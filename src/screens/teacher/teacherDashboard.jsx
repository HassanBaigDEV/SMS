import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FIREBASE_AUTH ,FIREBASE_DB} from '../../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import {doc, getDoc,getDocs, getFirestore, collection, query, where} from 'firebase/firestore';
import 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontSize, Color, FontFamily, Border } from "../../../GlobalStyles";
import RNPickerSelect from 'react-native-picker-select';





const initialData = [
  { id: '1', name: 'John Doe', firstTerm: 85, midTerm: 88, finalTerm: 90 },
  { id: '2', name: 'Jane Smith', firstTerm: 78, midTerm: 82, finalTerm: 85 },
];






  const TeacherScreen = ({route, navigation}) => {
  const { teacher } = route.params;


  const [academicYearDetailss, setacademicYearDetails] = useState();
  const [students, setStudents] = useState(initialData);
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
return a;

};


























  // const [year, setYear] = useState([]);







  const [selectedYear, setSelectedYear] = useState(Object.keys(teacher.academicYear)[0]);



//  useEffect(() => {
//     if (teacher) {


//       console.log('Teacher Data:', teacher);

//       const years = Object.keys(teacher.academicYear);

      

//     }
//   }, [teacher]);


//   useEffect(() => {
//     if (selectedYear && teacher.academicYear[selectedYear]) {
//       setStudents(teacher.academicYear[selectedYear]);
//     }
//   }, [selectedYear, teacher]);


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




  return(
  
    
    
  <View style={styles.container}>


   <View style={styles.header}>
        <Text style={styles.headerText}>Teacher Dashboard</Text>
      </View>



      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome, {teacher.teacherName}</Text>

          
        <RNPickerSelect
          onValueChange={(value) => setSelectedYear(value)}
          items={academicYearDetails}
          style={pickerSelectStyles}
          value={selectedYear}
          placeholder={{}}

  />

      </View>
       <Text style={styles.classText}>Class for {selectedYear}: {getClassForYear(selectedYear)}</Text> 
    



 
    </View>
   

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
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});


export default TeacherScreen;

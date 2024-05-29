import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
const initialData = [
  { id: '1', name: 'John Doe', firstTerm: 85, midTerm: 88, finalTerm: 90 },
  { id: '2', name: 'Jane Smith', firstTerm: 78, midTerm: 82, finalTerm: 85 },
];




  const TeacherScreen = ({route, navigation}) => {
  const { teacher } = route.params;




  const [students, setStudents] = useState(initialData);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [name, setName] = useState('');
  const [firstTerm, setFirstTerm] = useState('');
  const [midTerm, setMidTerm] = useState('');
  const [finalTerm, setFinalTerm] = useState('');
  const [search, setSearch] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);


  const [selectedYear, setSelectedYear] = useState(null);



 useEffect(() => {
    if (teacher) {
      console.log('Teacher Data:', teacher);
    }
  }, [teacher]);


  useEffect(() => {
    if (selectedYear && teacher.academicYear[selectedYear]) {
      setStudents(teacher.academicYear[selectedYear]);
    }
  }, [selectedYear, teacher]);


const handleLogout = async () => {
    try {
      // setShowLogoutModal(true);
      await signOut(FIREBASE_AUTH);
      console.log('Logout Successful!');
    } catch (error) {
      console.error('Logout Error:', error.message);
    } finally {
      setTimeout(() => {
        setShowLogoutModal(false);
        navigation.navigate('TeacherLogin');
      }, 3000);
    }
  };

  const handleSave = () => {
    const newStudent = {
      id: selectedStudent ? selectedStudent.id : Date.now().toString(),
      name,
      firstTerm: parseInt(firstTerm),
      midTerm: parseInt(midTerm),
      finalTerm: parseInt(finalTerm),
    };

    if (selectedStudent) {
      setStudents(students.map(student =>
        student.id === selectedStudent.id ? newStudent : student
      ));
    } else {
      setStudents([...students, newStudent]);
    }

    clearForm();
    setIsFormVisible(false);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setName(student.name);
    setFirstTerm(student.firstTerm.toString());
    setMidTerm(student.midTerm.toString());
    setFinalTerm(student.finalTerm.toString());
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const clearForm = () => {
    setSelectedStudent(null);
    setName('');
    setFirstTerm('');
    setMidTerm('');
    setFinalTerm('');
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );



  if (isFormVisible) {


    return (
      <View style={styles.container}>
        <Text style={styles.title}>{selectedStudent ? 'Edit Student' : 'Add Student'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="First Term Marks"
          value={firstTerm}
          onChangeText={setFirstTerm}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Mid Term Marks"
          value={midTerm}
          onChangeText={setMidTerm}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Final Term Marks"
          value={finalTerm}
          onChangeText={setFinalTerm}
          keyboardType="numeric"
        />
        <Button title="Save" onPress={handleSave} />
        <Button title="Cancel" onPress={() => setIsFormVisible(false)} />


      </View>
    );
  }














  return(
  <View style={styles.container}>
      <Text style={styles.title}>Welcome, {teacher.teacherName}</Text>
      <Picker
        selectedValue={selectedYear}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedYear(itemValue)}
      >
        {Object.keys(teacher.academicYear).map(year => (
          <Picker.Item label={year} value={year} key={year} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Search by name"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredStudents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentItem}>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{item.name}</Text>
              <Text>First Term: {item.firstTerm}</Text>
              <Text>Mid Term: {item.midTerm}</Text>
              <Text>Final Term: {item.finalTerm}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <Button title="Edit" onPress={() => handleEdit(item)} />
              <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsFormVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Student</Text>
      </TouchableOpacity>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );





















  // return (



  //   <View style={styles.container}>
  //     <Text style={styles.title}>Manage Student Marks</Text>
  //     <TextInput
  //       style={styles.input}
  //       placeholder="Search by name"
  //       value={search}
  //       onChangeText={setSearch}
  //     />
  //     <FlatList
  //       data={filteredStudents}
  //       keyExtractor={item => item.id}
  //       renderItem={({ item }) => (
  //         <View style={styles.studentItem}>
  //           <View style={styles.studentInfo}>
  //             <Text style={styles.studentName}>{item.name}</Text>
  //             <Text>First Term: {item.firstTerm}</Text>
  //             <Text>Mid Term: {item.midTerm}</Text>
  //             <Text>Final Term: {item.finalTerm}</Text>
  //           </View>
  //           <View style={styles.buttonsContainer}>
  //             <Button title="Edit" onPress={() => handleEdit(item)} />
  //             <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
  //           </View>
  //         </View>
  //       )}
  //     />
  //     <TouchableOpacity
  //       style={styles.addButton}
  //       onPress={() => setIsFormVisible(true)}
  //     >
  //       <Text style={styles.addButtonText}>Add Student</Text>
  //     </TouchableOpacity>
  //   </View>
  // );



};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
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

export default TeacherScreen;

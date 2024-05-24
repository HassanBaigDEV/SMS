// AddClassForm.js
import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {getFirestore, doc, setDoc, getDoc} from 'firebase/firestore';
import {FIREBASE_DB} from './firebase';
import {classes} from '../../data/classes';

const AddClassForm = () => {
  const [selectedClass, setSelectedClass] = useState(classes[0].class);
  const [subjects, setSubjects] = useState(classes[0].subjects.join(', '));
  const [section, setSection] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddClass = async () => {
    if (
      selectedClass.trim() === '' ||
      subjects.trim() === '' ||
      section.trim() === ''
    ) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    const subjectsArray = subjects.split(',').map(subject => subject.trim());

    setLoading(true);

    try {
      const classRef = doc(FIREBASE_DB, 'classes', selectedClass);
      const sectionRef = doc(classRef, 'sections', section);

      const sectionDoc = await getDoc(sectionRef);
      if (sectionDoc.exists()) {
        Alert.alert('Error', 'Section already exists!');
        setLoading(false);
      } else {
        await setDoc(sectionRef, {subjects: subjectsArray});
        Alert.alert('Success', 'Class and section added successfully!');
        setSelectedClass(classes[0].class);
        setSubjects(classes[0].subjects.join(', '));
        setSection('');
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  const handleClassChange = itemValue => {
    setSelectedClass(itemValue);
    const classData = classes.find(c => c.class === itemValue);
    if (classData) {
      setSubjects(classData.subjects.join(', '));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Class Name</Text>
      <Picker
        selectedValue={selectedClass}
        onValueChange={itemValue => handleClassChange(itemValue)}
        style={styles.picker}>
        {classes.map((cls, index) => (
          <Picker.Item key={index} label={cls.class} value={cls.class} />
        ))}
      </Picker>
      <Text style={styles.label}>Subjects (comma separated)</Text>
      <TextInput
        style={styles.input}
        value={subjects}
        onChangeText={setSubjects}
        placeholder="e.g., English, Math, Science"
      />
      <Text style={styles.label}>Section</Text>
      <TextInput
        style={styles.input}
        value={section}
        onChangeText={setSection}
        placeholder="e.g., A, B, C"
      />
      <TouchableOpacity onPress={handleAddClass} disabled={loading}>
        <Text>Add Class</Text>
      </TouchableOpacity>
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
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
});

export default AddClassForm;

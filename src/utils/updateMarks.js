import {FIREBASE_DB} from '../firebase/firebaseConfig';
import {Alert} from 'react-native';
import {doc, getDoc, updateDoc} from 'firebase/firestore';

export const handleUpdateMarks = async (
  classId,
  registrationNumber,
  year,
  newMarks,
) => {
  try {
    const studentRef = doc(FIREBASE_DB, `students/${registrationNumber}`);
    const studentDoc = await getDoc(studentRef);

    const classRef = doc(
      FIREBASE_DB,
      `classes/${classId}/${year}/${registrationNumber}`,
    );
    const classDoc = await getDoc(classRef);
    if (classDoc.exists()) {
      const classData = classDoc.data();
      const currentMarks = classData.marks || {};
      const updatedMarks = {
        ...currentMarks,
        ...newMarks,
      };
      await updateDoc(classRef, {marks: updatedMarks});
    }
    if (studentDoc.exists()) {
      const studentData = studentDoc.data();
      const currentMarks = studentData.marks || {};

      const updatedMarks = {
        ...currentMarks,
        [year]: {
          ...currentMarks[year],
          ...newMarks,
        },
      };

      await updateDoc(studentRef, {marks: updatedMarks});
      Alert.alert('Success', 'Marks updated successfully.');
    } else {
      Alert.alert('Error', 'Student not found.');
    }
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};

//example usage
handleUpdateMarks('Class 4', 589, 2020, {
  English: {
    firstterm: 50,
    midTerm: 100,
    finalTerm: 10,
  },
});

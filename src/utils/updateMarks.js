import {FIREBASE_DB} from '../firebase/firebaseConfig';
import {Alert} from 'react-native';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {subjectByClass} from '../data/classes';

export const handleUpdateMarks = async (
  classId,
  registrationNumber,
  year,
  newMarks,
  remarks,
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
        [year]: {
          ...currentMarks[year],
          ...newMarks,
          yearlyRemarks: remarks,
        },
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
          yearlyRemarks: remarks,
        },
      };

      await updateDoc(studentRef, {
        marks: updatedMarks,
      });
      Alert.alert('Success', 'Marks updated successfully.');
    } else {
      Alert.alert('Error', 'Student not found.');
    }
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};

//example usage
// handleUpdateMarks(
//   'Class 4',
//   589,
//   2020,
//   {
//     English: {
//       firstTerm: 50,
//       midTerm: 100,
//       finalTerm: 10,
//     },
//   },
//   'average performance',
// );

// Ensure to import necessary Firestore functions

export const handleUpdateAllMarks = async (
  classId,
  registrationNumber,
  year,
  newMarks,
  remarks,
) => {
  try {
    const studentRef = doc(FIREBASE_DB, `students/${registrationNumber}`);
    const studentDoc = await getDoc(studentRef);

    const classRef = doc(
      FIREBASE_DB,
      `classes/${classId}/${year}/${registrationNumber}`,
    );
    const classDoc = await getDoc(classRef);

    // Fetch the subjects for the specified class
    const subjects = subjectByClass[classId];

    // Initialize the marks for each subject if not provided
    subjects.forEach(subject => {
      if (!newMarks[subject]) {
        newMarks[subject] = {
          firstTerm: 0,
          midTerm: 0,
          finalTerm: 0,
        };
      }
    });

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
          yearlyRemarks: remarks,
        },
      };

      await updateDoc(studentRef, {
        marks: updatedMarks,
      });
      Alert.alert('Success', 'Marks updated successfully.');
    } else {
      Alert.alert('Error', 'Student not found.');
    }
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};

const classId = 'Class 5';
const registrationNumber = '589';
const year = 2023;
const newMarks = {
  English: {
    firstTerm: 50,
    midTerm: 100,
    finalTerm: 90,
  },
  Math: {
    firstTerm: 45,
    midTerm: 85,
    finalTerm: 95,
  },
  // Other subjects will be initialized with default marks (0)
};
const remarks = 'Good progress throughout the year.';

// Update marks
handleUpdateMarks(classId, registrationNumber, year, newMarks, remarks)
  .then(() => console.log('Marks update process completed.'))
  .catch(error => console.error('Error updating marks:', error));

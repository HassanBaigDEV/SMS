// TeacherDetail.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';
import {doc, getDoc, deleteDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';
import Header from '../../../components/header';
import {ActivityIndicator} from 'react-native-paper';

const TeacherDetail = ({route, navigation}) => {
  const {teacherId} = route.params;
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const teacherDoc = await getDoc(
          doc(FIREBASE_DB, 'teachers', teacherId),
        );
        if (teacherDoc.exists()) {
          setTeacher(teacherDoc.data());
        } else {
          Alert.alert('Error', 'Teacher not found');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error fetching teacher:', error);
      }
    };

    fetchTeacher();
  }, [navigation, teacherId]);

  const handleDeleteTeacher = async () => {
    try {
      await deleteDoc(doc(FIREBASE_DB, 'teachers', teacherId));
      // Alert.alert('Success', 'Teacher deleted successfully');
      ToastAndroid.show('Teacher deleted successfully', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      Alert.alert('Error', 'Error deleting teacher');
    }
  };

  const handleEditTeacher = () => {
    navigation.navigate('EditTeacher', {teacherId});
  };

  const renderAssignedClasses = () => {
    const classes = [];
    if (teacher.academicYear) {
      Object.keys(teacher.academicYear).forEach(year => {
        const assigned = teacher.academicYear[year].classAssigned;
        if (assigned) {
          classes.push(
            <View key={year} style={styles.classAssignedContainer}>
              <Text style={styles.classYear}>Year: {year}</Text>
              {assigned.map((cls, index) => (
                <Text key={index} style={styles.classInfo}>
                  {cls.classId}, Subject: {cls.subject}
                </Text>
              ))}
            </View>,
          );
        }
      });
    }
    return classes;
  };

  return (
    <>
      <Header title="Teacher Details" />
      {!teacher ? (
        <ActivityIndicator
          animating={true}
          color="rgb(0, 123, 255)"
          style={styles.loading}
          size="large"
        />
      ) : (
        <View style={styles.container}>
          <Text style={styles.label}>Name: {teacher.teacherName}</Text>
          <Text style={styles.label}>Email: {teacher.email}</Text>
          <Text style={styles.sectionTitle}>Assigned Classes:</Text>
          {renderAssignedClasses()}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleEditTeacher} style={styles.button}>
              <Image
                source={require('../../../assets/icons/pen.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteTeacher}
              style={styles.button}>
              <Image
                source={require('../../../assets/icons/bin.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#333',
    marginVertical: 15,
    fontWeight: 'bold',
  },
  classAssignedContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  classYear: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  classInfo: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 10,
    // backgroundColor: '#007bff',

    borderRadius: 8,
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#007bff',
  },
});

export default TeacherDetail;

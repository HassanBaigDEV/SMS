import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {setDoc, doc, deleteDoc, getDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../firebase/firebaseConfig';
import Header from '../../components/header';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';

const TimeTable = () => {
  const _storage = getStorage();
  const [timetableUrl, setTimetableUrl] = useState('');

  useEffect(() => {
    fetchTimetableUrlFromFirestore();
  }, []);

  const fetchTimetableUrlFromFirestore = async () => {
    try {
      // Fetch timetable URL from Firestore
      const timetableDoc = await getDoc(
        doc(FIREBASE_DB, 'timetables', 'timetable'),
      );
      if (timetableDoc.exists()) {
        const timetableData = timetableDoc.data();
        setTimetableUrl(timetableData.url);
      }
    } catch (error) {
      console.error('Error fetching timetable URL: ', error);
    }
  };

  const uploadTimetable = async uri => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1);

    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(_storage, `timetables/${filename}`);
      const snapshot = await uploadBytes(storageRef, blob);

      const url = await getDownloadURL(storageRef);

      saveTimetableURLToFirestore(url);
      setTimetableUrl(url);

      ToastAndroid.show('Timetable uploaded successfully', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error uploading timetable: ', error);
      ToastAndroid.show('Error uploading timetable', ToastAndroid.SHORT);
    }
  };

  const saveTimetableURLToFirestore = async url => {
    try {
      await setDoc(
        doc(FIREBASE_DB, 'timetables', 'timetable'), // Replace 'classId' with the actual class ID
        {
          url: url,
        },
        {merge: false},
      );

      console.log('Timetable URL saved to Firestore!');
      ToastAndroid.show('Timetable uploaded successfully', ToastAndroid.SHORT);
    } catch (e) {
      console.error('Error saving timetable URL to Firestore: ', e);
      ToastAndroid.show('Error saving timetable URL', ToastAndroid.SHORT);
    }
  };

  const deleteTimetable = async () => {
    try {
      await deleteDoc(doc(FIREBASE_DB, 'timetables', 'timetable'));
      setTimetableUrl('');
      ToastAndroid.show('Timetable deleted successfully', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error deleting timetable: ', error);
      ToastAndroid.show('Error deleting timetable', ToastAndroid.SHORT);
    }
  };

  const handleChooseTimetable = async () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.assets[0].uri};
        await uploadTimetable(source.uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Timetable" />
      <View style={styles.content}>
        {timetableUrl ? (
          <Image source={{uri: timetableUrl}} style={styles.timetableImage} />
        ) : (
          <Text style={styles.noTimetableText}>No timetable available</Text>
        )}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleChooseTimetable}>
            <Text style={styles.buttonText}>Choose</Text>
          </TouchableOpacity>
          {timetableUrl && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={deleteTimetable}>
              <Text style={styles.deleteButtonText}>Delete </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  timetableImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  noTimetableText: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TimeTable;

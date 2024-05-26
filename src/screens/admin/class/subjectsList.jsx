// SubjectsList.js
import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {doc, getDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';

const SubjectsList = ({route, navigation}) => {
  const {classId} = route.params;
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const classRef = doc(FIREBASE_DB, 'classes', classId);
      const classDoc = await getDoc(classRef);
      if (classDoc.exists()) {
        setSubjects(classDoc.data().subjects);
      }
    };

    fetchSubjects();
  }, [classId]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('SubjectDetails', {classId, subject: item})
      }>
      <Text style={styles.item}>{item} </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={subjects}
        renderItem={renderItem}
        keyExtractor={item => item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SubjectsList;

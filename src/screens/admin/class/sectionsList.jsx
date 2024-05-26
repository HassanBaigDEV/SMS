// SectionsList.js
import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {collection, getDocs} from 'firebase/firestore';
import {FIREBASE_DB} from '../../../firebase/firebaseConfig';

const SectionsList = ({route, navigation}) => {
  const {classId, year} = route.params;
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchSections = async () => {
      const sectionsCollection = collection(
        FIREBASE_DB,
        `classes/${classId}/${year}`,
      );
      const sectionSnapshot = await getDocs(sectionsCollection);
      const sectionList = sectionSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSections(sectionList);
    };

    fetchSections();
  });

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('SectionDetails', {classId, sectionId: item.id})
      }>
      <Text style={styles.item}>{item.id} </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        onPress={() => navigation.navigate('AddClass', {classId})}>
        <Text style={styles.addClassButton}>Add New Student</Text>
      </TouchableOpacity> */}
      {/* <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      /> */}
      <TouchableOpacity onPress={() => {}}>
        <Text>Subjects</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SectionDetails', {
            students: sections,
            classId: classId,
            year: year,
          });
        }}>
        <Text>Students</Text>
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
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SectionsList;

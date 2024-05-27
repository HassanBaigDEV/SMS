// ClassDetails.js
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {years} from '../../../data/academicYear';
import {ScrollView} from 'react-native-gesture-handler';
import Header from '../../../components/header';

const ClassDetails = ({route, navigation}) => {
  const {classId} = route.params;

  return (
    <>
      <Header title={`Class ${classId}`} />
      <ScrollView style={styles.container}>
        {/* mapp years in touchable */}
        {years.map(year => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SectionsList', {classId, year})
            }>
            <Text style={styles.item}>{year} </Text>
          </TouchableOpacity>
        ))}

        {/* <TouchableOpacity
        onPress={() => navigation.navigate('SubjectsList', {classId})}>
        <Text style={styles.item}>Subjects </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('SectionsList', {classId})}>
        <Text style={styles.item}>Students </Text>
      </TouchableOpacity> */}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ClassDetails;

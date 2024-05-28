import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../components/header';
import {classes} from '../../../data/classes';

const ClassList = ({navigation}) => {
  return (
    <ScrollView style={styles.scrollView}>
      <Header title="Classes" />
      <View style={styles.container}>
        {classes.map(item => (
          <TouchableOpacity
            key={item.class}
            style={styles.item}
            onPress={() =>
              navigation.navigate('ClassDetails', {classId: item.class})
            }>
            <LinearGradient
              colors={['rgb(64, 172, 194)', 'rgb(131, 15, 147)']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradient}>
              <Text style={styles.classText}>{item.class}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 30,
    paddingTop: 40,
    paddingBottom: 80,
  },
  item: {
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    height: 80,
  },
  gradient: {
    flex: 1,
    borderRadius: 15,
    padding: 15,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  classText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ClassList;

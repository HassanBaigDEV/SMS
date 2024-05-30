import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Header from '../../components/header';

const StudentTimetable = ({ route, navigation }) => {
  const { user } = route.params;
  const [timetableUrl, setTimetableUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const timetableDoc = await firestore()
          .collection('timetables')
          .doc('timetable')
          .get();
        const data = timetableDoc.data();
        const url = data?.url;
        setTimetableUrl(url);
      } catch (error) {
        console.error('Error fetching timetable:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text style={styles.loadingText}>Loading Timetable...</Text>
      </View>
    );
  }

  return (
    <>
    <Header title='Time Table' />
    <ScrollView contentContainerStyle={styles.container}>
      {timetableUrl ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: timetableUrl }} style={styles.timetableImage} />
        </View>
      ) : (
        <Text style={styles.errorText}>Timetable not available</Text>
      )}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  timetableImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#555',
  },
  backButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#8A2BE2',
    alignItems: 'center',
    width: '100%',
  },
  backButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default StudentTimetable;

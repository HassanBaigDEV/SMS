import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ToastAndroid,
} from 'react-native';
import {signOut} from 'firebase/auth';
import {FIREBASE_AUTH} from '../../firebase/firebaseConfig';
import Header from '../../components/header';
import LinearGradient from 'react-native-linear-gradient';

const AdminDashboard = ({navigation}) => {
  const handleLogout = async () => {
    ToastAndroid.show('Logging out...', ToastAndroid.SHORT);
    try {
      await signOut(FIREBASE_AUTH);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <>
      <Header title="Dashboard" nav={false} />
      <View style={styles.container}>
        <View style={styles.logoutButtonContainer}>
          <TouchableOpacity onPress={handleLogout}>
            <Image
              style={styles.logoutButton}
              source={require('../../assets/icons/logout_icon.png')}
            />
            {/* <Text style={styles.logoutButton}>Logout</Text> */}
          </TouchableOpacity>
        </View>
        {/* <LinearGradient
          colors={['rgb(64, 172, 194)', 'rgb(131, 15, 147)']}
          style={styles.gradientContainer}> */}
        <Image
          style={styles.title}
          source={require('../../images/image2-nobg.png')}
        />
        {/* </LinearGradient> */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Students')}>
            <Image
              source={require('../../assets/icons/student_icon.png')}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>Students</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TeacherList')}>
            <Image
              source={require('../../assets/icons/teacher_icon.png')}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>Teachers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TimeTable')}>
            <Image
              source={require('../../assets/icons/timetable_icon.png')}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>Timetable</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ClassList')}>
            <Image
              source={require('../../assets/icons/class_icon.png')}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>Classes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('FeeStatus')}>
            <Image
              source={require('../../assets/icons/fee_status_icon.png')}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>Fee Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('StudentRecord')}>
            <Image
              source={require('../../assets/icons/student_record_icon.png')}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>Reports</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    height: 120,
    width: 370,
    marginBottom: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
    paddingVertical: 0,
    marginVertical: 0,
    tintColor: '#000',
  },
  // gradientContainer: {
  //   flex: 1,
  // },
  logoutButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  logoutButton: {
    fontSize: 18,
    color: '#007BFF',
    height: 35,
    width: 35,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    paddingVertical: 20,
  },
  cardImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminDashboard;

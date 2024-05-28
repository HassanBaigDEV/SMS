import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import maleImage from '../../images/male.jpg';
import femaleImage from '../../images/female.jpg';


const AcademicProfile = ({ route, navigation }) => {
  const { user, selectedYear, subjects } = route.params;
  console.log(subjects);

  const formattedDate = user.dateOfAdmission ? user.dateOfAdmission.substring(0, 10) : '';

  const genderImage = user.gender === 'male' ? maleImage : femaleImage;

  // Extract class name from classEnrolled
  const classEnrolled = user.classEnrolled;
  const parts = classEnrolled.split('/');
  const className = parts[1];

  const renderUserInfoRow = (title, value) => (
    <View style={styles.userInfoRow}>
      <Text style={styles.userInfoTitle}>{title}</Text>
      <Text style={styles.userInfoValue}>{value}</Text>
    </View>
  );

  const capitalizeFirstLetter = (data) => {
    const capitalizedData = {};
    for (const key in data) {
      if (typeof data[key] === 'string') {
        capitalizedData[key] = data[key].charAt(0).toUpperCase() + data[key].slice(1);
      } else {
        capitalizedData[key] = data[key];
      }
    }
    return capitalizedData;
  };

  const capitalizedUser = capitalizeFirstLetter(user);

  const remarks = capitalizedUser.marks[selectedYear].yearlyRemarks;
  const dottedRemarks = remarks.charAt(remarks.length - 1) !== '.' ? remarks + '.' : remarks;
  const capitalizedRemarks = dottedRemarks.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');


  return (
    <FlatList
      data={subjects}
      keyExtractor={(item) => item}
      ListHeaderComponent={
        <>
          <View style={styles.schoolInfoContainer}>
            <Image source={require('../../images/image2.png')} style={styles.schoolImage} />
            <View style={styles.schoolDetails}>
              <Text style={styles.schoolName}>STELLAR TACTFUL EDU</Text>
              <Text style={styles.schoolLocation}>Location: Park Road, Islamabad.</Text>
            </View>
          </View>
          <View>
            <View style={styles.horizontalLine}></View>
            <Text style={styles.performanceProfile}>PERFORMANCE PROFILE</Text>
            <View style={styles.horizontalLine}></View>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.schoolInfoContainer}>
              <Image source={genderImage} style={styles.schoolImage} />
              <View style={styles.schoolDetails}>
                <Text style={styles.userName}>{capitalizedUser.studentName} {capitalizedUser.fatherName}</Text>
                <Text style={styles.userClass}>{className} ({selectedYear})</Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              {renderUserInfoRow('Roll Number:', capitalizedUser.registrationNumber)}
              <View style={styles.minimalSeparator}></View>
              {renderUserInfoRow('Email:', capitalizedUser.email)}
              <View style={styles.minimalSeparator}></View>
              {renderUserInfoRow('Date of Birth:', capitalizedUser.dateOfBirth)}
              <View style={styles.minimalSeparator}></View>
              {renderUserInfoRow('Father Name:', 'Mr. ' + capitalizedUser.fatherName)}
              <View style={styles.minimalSeparator}></View>
              {renderUserInfoRow('Date of Admission:', formattedDate)}
              <View style={styles.minimalSeparator}></View>
              {renderUserInfoRow('Gender:', capitalizedUser.gender)}
              <View style={styles.minimalSeparator}></View>
              {renderUserInfoRow('Admission Class:', user.admissionClass)}
            </View>
          </View>
          <View>
            <View style={styles.horizontalLine}></View>
            <Text style={styles.performanceProfile}>ACADEMIC PERFOMANCE</Text>
            <View style={styles.horizontalLine}></View>
          </View>
        </>
      }
      renderItem={({ item }) => {
        const subjectData = user.marks[selectedYear][item];
        return (
          <View style={styles.subjectContainer}>
            <Text style={styles.subjectText}>Subject: <Text style={styles.boldText}>{ item }</Text></Text>
            <Text style={styles.subjectText}>First Term: {subjectData.firstTerm !== null ? subjectData.firstTerm : '  -  '}</Text>
            <Text style={styles.subjectText}>Mid Term: {subjectData.midTerm !== null ? subjectData.midTerm : '  -  '}</Text>
            <Text style={styles.subjectText}>Final Term: {subjectData.finalTerm !== null ? subjectData.finalTerm : '  -  '}</Text>
          </View>
        );
      }} 
      ListFooterComponent={
        <View style={styles.remarksContainer}>
            <Text style={styles.sectionHeader}>Remarks:</Text>
            <View style={styles.remarksContent}>
                <Text style={styles.remarksText}>{capitalizedRemarks ? capitalizedRemarks : '-'}</Text>
            </View>
        </View>
      }     
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  boldText: {
    fontWeight: 'bold',
  },  
  schoolInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  schoolImage: {
    width: 100,
    height: 100,
    marginRight: 20,
    borderRadius: 10,
    marginTop: '5%',
  },
  schoolDetails: {
    flex: 1,
  },
  schoolName: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  schoolLocation: {
    fontSize: 16,
  },
  userName: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  userClass: {
    fontSize: 16,
  },
  horizontalLine: {
    borderBottomColor: '#00bcd4', // Blue color
    borderBottomWidth: 2,
    marginVertical: 12, // Adjust margin as needed
  },
  performanceProfile: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00bcd4', // Blue color
  },  
  header: {
    backgroundColor: '#333333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    textTransform: 'uppercase',
    fontFamily: 'Arial',
    letterSpacing: 1,
  },
  logo: {
    width: 50,
    height: 50,
  },
  userInfo: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userInfoTitle: {
    fontSize: 18,
    color: 'black', // White text color for better visibility on black background
    fontWeight: 'bold',
  },
  userInfoValue: {
    fontSize: 18,
  },
  userInfoText: {
    fontSize: 18,
    marginBottom: 5,
  },
  minimalSeparator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
  separator: {
    height: 5,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  subjectContainer: {
    padding: 10,
    backgroundColor: '#CCCCCC',
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  subjectText: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  remarksContainer: {
    backgroundColor: '#f0f0f0', // Light gray background
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  remarksContent: {
    padding: 10,
    backgroundColor: '#CCCCCC',
    borderRadius: 5,
    marginBottom: 10,
  },
  remarksText: {
    fontSize: 16,
    color: '#333333', // Dark gray text
  },  
});

export default AcademicProfile;

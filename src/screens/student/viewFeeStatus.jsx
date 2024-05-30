import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../../components/header';

const ViewFeeStatus = ({ route }) => {
  const { user, feeYear } = route.params;
  const [selectedMonth, setSelectedMonth] = useState(''); // Default to January

  // Filter fee details based on the selected month
  const filteredFeeDetails = user.feeStatus[feeYear] ? user.feeStatus[feeYear][selectedMonth] : null;

  const renderFeeDetails = (details) => {
    if (!details) {
      return null;
    }
    return (
      <View style={styles.card} key={selectedMonth}>
        <Text style={styles.yearText}>Fee Status - {selectedMonth} ({feeYear})</Text>
        <View style={styles.horizontalLine}></View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Amount Due:</Text>
          <Text style={styles.value}>{details.amountDue}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Amount Paid:</Text>
          <Text style={styles.value}>{details.amountPaid}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Payable Amount:</Text>
          <Text style={styles.value}>{details.payableAmount}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Payment Date:</Text>
          <Text style={styles.value}>{details.paymentDate}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Remarks:</Text>
          <Text style={styles.value}>{details.remarks}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
    <Header title={`Fee Status (${feeYear})`} />
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../images/image2.png')} // Replace with the path to your image
          style={styles.schoolImage}
        />
      </View>
      <Text style={styles.title}>SCHOOL FEE STATUS</Text>

      {/* Dropdown for selecting month */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>Select Month:</Text>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            mode="dropdown"
            style={styles.dropdown}
          >
            {selectedMonth === '' && (
              <Picker.Item label="Please select a month" value="" />
            )}
            {user.feeStatus[feeYear] &&
              Object.keys(user.feeStatus[feeYear]).map((month) => (
                <Picker.Item
                  key={month}
                  label={month}
                  value={month}
                  style={styles.pickerItem}
                />
              ))}
          </Picker>
      </View>

      {/* Render fee details for the selected month */}
      {renderFeeDetails(filteredFeeDetails)}
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4B0082',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#CCCCCC',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  yearText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 10,
    textAlign: 'center',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  horizontalLine: {
    borderBottomColor: '#4B0082', // Blue color
    borderBottomWidth: 2,
    marginTop: 2, // Adjust margin as needed
    marginBottom: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Adjust margin as needed
    height: 100,
    width: '100%',
    // backgroundColor: 'blue',
  },
  schoolImage: {
    width:
    250, // Adjust width as needed
    height: 100, // Adjust height as needed
    // resizeMode: 'contain', // Ensure the image
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
  },
  dropdown: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#CCCCCC',
  },
  pickerItem: {
    // backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: 'center', // Center the text horizontally
  },  
});

export default ViewFeeStatus;

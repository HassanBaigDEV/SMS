import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {addFeeStatus} from '../../../utils/feeStatus';
import Header from '../../../components/header';

const FeeStatusForm = ({route, navigation}) => {
  const {student, year, newStudent} = route.params;

  const [feeDetails, setFeeDetails] = useState({
    registrationNumber: '',
    studentName: '',
    amountDue: '',
    amountPaid: '',
    payableAmount: '',
    paymentDate: '',
    remarks: '',
  });

  useEffect(() => {
    console.log('student:', student);
    console.log('newStudent:', newStudent);

    if (student) {
      const feeStatusForYear = student.feeStatus?.[year];
      if (feeStatusForYear) {
        setFeeDetails({
          registrationNumber: student.registrationNumber,
          studentName: student.studentName,
          amountDue: feeStatusForYear.amountDue?.toString() || '',
          amountPaid: feeStatusForYear.amountPaid?.toString() || '',
          payableAmount: feeStatusForYear.payableAmount?.toString() || '',
          paymentDate: feeStatusForYear.paymentDate?.toString() || '',
          remarks: feeStatusForYear.remarks?.toString() || '',
        });
      } else {
        setFeeDetails({
          registrationNumber: student.registrationNumber,
          studentName: student.studentName,
          amountDue: '',
          amountPaid: '',
          payableAmount: '',
          paymentDate: '',
          remarks: '',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student, year]);

  const handleAddFeeStatus = async () => {
    try {
      console.log('feeDetails:', feeDetails);
      await addFeeStatus(feeDetails, feeDetails.registrationNumber);
      Alert.alert('Success', 'Fee status added successfully.');
      setFeeDetails({
        registrationNumber: '',
        studentName: '',
        amountDue: '',
        amountPaid: '',
        payableAmount: '',
        paymentDate: '',
        remarks: '',
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleChange = (name, value) => {
    setFeeDetails(prevState => ({
      ...prevState,
      [name]: value.toString(),
    }));
  };

  return (
    <>
      <Header title="Fee Status Form" />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Registration Number:</Text>
            <TextInput
              style={styles.input}
              value={student?.registrationNumber}
              placeholder="Enter registration number"
              editable={false}
            />
            <Text style={styles.label}>Student Name:</Text>
            <TextInput
              style={styles.input}
              value={student?.studentName}
              placeholder="Enter student name"
              editable={false}
            />
            <Text style={styles.label}>Amount Due:</Text>
            <TextInput
              style={styles.input}
              value={feeDetails.amountDue}
              onChangeText={text => handleChange('amountDue', text)}
              placeholder="Enter amount due"
              keyboardType="numeric"
            />
            <Text style={styles.label}>Amount Paid:</Text>
            <TextInput
              style={styles.input}
              value={feeDetails.amountPaid}
              onChangeText={text => handleChange('amountPaid', text)}
              placeholder="Enter amount paid"
              keyboardType="numeric"
            />
            <Text style={styles.label}>Payable Amount:</Text>
            <TextInput
              style={styles.input}
              value={feeDetails.payableAmount}
              onChangeText={text => handleChange('payableAmount', text)}
              placeholder="Enter payable amount"
              keyboardType="numeric"
            />
            <Text style={styles.label}>Payment Date:</Text>
            <TextInput
              style={styles.input}
              value={feeDetails.paymentDate}
              onChangeText={text => handleChange('paymentDate', text)}
              placeholder="Enter payment date"
            />
            <Text style={styles.label}>Remarks:</Text>
            <TextInput
              style={styles.input}
              value={feeDetails.remarks}
              onChangeText={text => handleChange('remarks', text)}
              placeholder="Enter remarks"
            />
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={handleAddFeeStatus}>
          <Text style={styles.addButtonText}>Add Fee Status</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: 'rgb(0, 123, 255)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FeeStatusForm;

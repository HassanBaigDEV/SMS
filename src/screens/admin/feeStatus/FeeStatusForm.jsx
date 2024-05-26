import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet} from 'react-native';
import {addFeeStatus} from '../../../utils/feeStatus';

// Function to add fee status, adjust the import as necessary

const FeeStatusForm = ({route, navigation}) => {
  const {student, year, newStudent} = route.params;
  // const [registrationNumber, setRegistrationNumber] = useState('');
  // const [studentName, setStudentName] = useState('');
  // const [amountDue, setAmountDue] = useState('');
  // const [amountPaid, setAmountPaid] = useState('');
  // const [payableAmount, setPayableAmount] = useState('');
  // const [paymentDate, setPaymentDate] = useState('');
  // const [remarks, setRemarks] = useState('');

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
    // console.log('student:', student);
  }, [student]);

  useEffect(() => {
    if (student) {
      // console.log('student:', student.feeStatus[year].amountDue);
      setFeeDetails({
        ...feeDetails,
        registrationNumber: student.registrationNumber,
        studentName: student.studentName,
        amountDue: student.feeStatus[year].amountDue.toString(),
        amountPaid: student.feeStatus[year].amountPaid.toString(),
        payableAmount: student.feeStatus[year].payableAmount.toString(),
        paymentDate: student.feeStatus[year].paymentDate.toString(),
        remarks: student.feeStatus[year].remarks.toString(),
      });
    } else if (newStudent) {
      console.log('newStudent:', newStudent.registrationNumber);
      setFeeDetails({
        ...feeDetails,
        registrationNumber: newStudent.registrationNumber,
        studentName: newStudent.studentName,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const handleAddFeeStatus = async () => {
    try {
      console.log('feeDetails:', feeDetails);
      await addFeeStatus(feeDetails, feeDetails.registrationNumber);
      Alert.alert('Success', 'Fee status added successfully.');
      // Clear form fields after successful submission
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
    // let _arr = {...feeDetails};
    setFeeDetails(prevState => ({
      ...prevState,
      [name]: value.toString(),
    }));
  };

  return (
    <>
      {student ? (
        <View style={styles.container}>
          <Text style={styles.label}>Registration Number:</Text>
          <TextInput
            style={styles.input}
            value={student.registrationNumber}
            editable={false}
          />
          <Text style={styles.label}>Student Name:</Text>
          <TextInput
            style={styles.input}
            value={student.studentName}
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
          <Button title="Update Fee Status" onPress={handleAddFeeStatus} />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.label}>Registration Number:</Text>
          <TextInput
            style={styles.input}
            value={feeDetails.registrationNumber}
            // onChangeText={text => handleChange('registrationNumber', text)}
            // placeholder="Enter registration number"
          />
          <Text style={styles.label}>Student Name:</Text>
          <TextInput
            style={styles.input}
            value={feeDetails.studentName}
            onChangeText={text => handleChange('studentName', text)}
            placeholder="Enter student name"
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
          <Button title="Add Fee Status" onPress={handleAddFeeStatus} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
});

export default FeeStatusForm;

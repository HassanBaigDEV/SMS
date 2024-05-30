import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {collection, getDocs} from 'firebase/firestore';
import {FIREBASE_DB} from '../../firebase/firebaseConfig';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import moment from 'moment';
import Header from '../../components/header';
import {Picker} from '@react-native-picker/picker';
const _years = ['2019', '2020', '2021', '2022', '2023', '2024'];
// Helper function to calculate age
const calculateAge = dob => {
  const birthDate = moment(dob, 'YYYY-MM-DD');
  const currentDate = moment();
  const years = currentDate.diff(birthDate, 'years');
  birthDate.add(years, 'years');
  const months = currentDate.diff(birthDate, 'months');
  return {years, months};
};

// Fetch and process student data for age report
const fetchAndProcessStudentDataForAgeReport = async () => {
  try {
    const studentsCollection = collection(FIREBASE_DB, 'students');
    const studentSnapshot = await getDocs(studentsCollection);
    const studentList = studentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    let totalBoys = 0;
    let totalGirls = 0;

    const processedData = studentList.map(student => {
      const {years, months} = calculateAge(student.dateOfBirth);
      if (student.gender === 'male') {
        totalBoys += 1;
      } else if (student.gender === 'female') {
        totalGirls += 1;
      }
      return {
        registrationNumber: student.registrationNumber,
        studentName: student.studentName,
        fatherName: student.fatherName,
        dateOfBirth: student.dateOfBirth,
        age: `${years} years ${months} months`,
      };
    });

    return {students: processedData, totalBoys, totalGirls};
  } catch (error) {
    console.error('Error fetching students:', error);
    return {students: [], totalBoys: 0, totalGirls: 0};
  }
};

// Fetch and process student data for result report
const fetchAndProcessStudentDataForResultReport = async year => {
  try {
    const studentsCollection = collection(FIREBASE_DB, 'students');
    const studentSnapshot = await getDocs(studentsCollection);
    const studentList = studentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const processedData = studentList.map(student => {
      const marks = student.marks?.[year] || {};
      const subjects = Object.keys(marks).map(subject => ({
        subject,
        firstTerm: marks[subject]?.firstTerm || '',
        midTerm: marks[subject]?.midTerm || '',
        finalTerm: marks[subject]?.finalTerm || '',
      }));
      return {
        registrationNumber: student.id,
        studentName: student.studentName,
        subjects,
      };
    });

    return processedData;
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

// Generate PDF for age report
const generateAgeReportPDF = async data => {
  const {students, totalBoys, totalGirls} = data;
  try {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .student { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h2>Student Age Record Report</h2>
          <table>
            <thead>
              <tr>
                <th>Registration Number</th>
                <th>Student Name</th>
                <th>Father Name</th>
                <th>Date of Birth</th>
                <th>Age (Years & Months)</th>
              </tr>
            </thead>
            <tbody>
              ${students
                .map(
                  student => `
                <tr>
                  <td>${student.registrationNumber}</td>
                  <td>${student.studentName}</td>
                  <td>${student.fatherName}</td>
                  <td>${student.dateOfBirth}</td>
                  <td>${student.age}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
          <h3>Total Boys: ${totalBoys}</h3>
          <h3>Total Girls: ${totalGirls}</h3>
        </body>
      </html>
    `;

    const pdfOptions = {
      html: htmlContent,
      fileName: `student_age_record_report`,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(pdfOptions);

    console.log('PDF file created:', file.filePath);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

// Generate PDF for result report
const generateResultReportPDF = async (students, year) => {
  try {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .student { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h2>Student Result Report (${year})</h2>
          ${students
            .map(
              student => `
            <div class="student">
              <h3>${student.studentName} (Reg: ${
                student.registrationNumber
              })</h3>
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>First Term</th>
                    <th>Mid Term</th>
                    <th>Final Term</th>
                  </tr>
                </thead>
                <tbody>
                  ${student.subjects
                    .map(
                      subject => `
                    <tr>
                      <td>${subject.subject}</td>
                      <td>${subject.firstTerm}</td>
                      <td>${subject.midTerm}</td>
                      <td>${subject.finalTerm}</td>
                    </tr>
                  `,
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          `,
            )
            .join('')}
        </body>
      </html>
    `;

    const pdfOptions = {
      html: htmlContent,
      fileName: `student_result_report_${year}`,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(pdfOptions);

    console.log('PDF file created:', file.filePath);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

const StudentReport = () => {
  const [year, setYear] = useState(_years[_years.length - 1]);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState(''); // 'age' or 'result'

  const handleGeneratePDF = async () => {
    ToastAndroid.show('Downloading report...', ToastAndroid.SHORT);
    setLoading(true);
    if (reportType === 'age') {
      const data = await fetchAndProcessStudentDataForAgeReport();
      await generateAgeReportPDF(data);
    } else if (reportType === 'result') {
      // const year = '2024'; // Example year, you can make this dynamic

      const students = await fetchAndProcessStudentDataForResultReport(year);
      await generateResultReportPDF(students, year);
    }
    setLoading(false);
    ToastAndroid.show('PDF generated successfully', ToastAndroid.SHORT);
  };

  return (
    <>
      <Header title="Student Reports" />
      <View style={styles.container}>
        <Text style={styles.title}>Generate Student Report</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              reportType === 'age' && styles.selectedButton,
            ]}
            onPress={() => setReportType('age')}>
            <Text
              style={[
                reportType === 'age'
                  ? styles.selectedButtonText
                  : styles.buttonText,
              ]}>
              Age Report
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              reportType === 'result' && styles.selectedButton,
            ]}
            onPress={() => {
              setReportType('result');
              setShowModal(true);
            }}>
            <Text
              style={[
                reportType === 'result'
                  ? styles.selectedButtonText
                  : styles.buttonText,
              ]}>
              Result Report
            </Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button
            title="Generate PDF"
            onPress={handleGeneratePDF}
            disabled={!reportType}
          />
        )}
      </View>
      {/* closs modal when clicked on fade */}

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        // onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          {/* <Text style={styles.modalText}>Downloading report...</Text> */}
          {/* select YEar */}
          <View style={styles.yearContainer}>
            <Text style={styles.yearText}>Select Year:</Text>
            <Picker
              selectedValue={year}
              style={styles.yearPicker}
              onValueChange={itemValue => {
                setYear(itemValue);
                setShowModal(false);
              }}>
              {_years.map(year => (
                <Picker.Item key={year} label={year} value={year}  />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: '#fff',
  },
  selectedButton: {
    backgroundColor: '#007bff',
  },
  selectedButtonText: {
    color: '#fff',
  },
  buttonText: {
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  yearContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  yearText: {
    fontSize: 16,
    marginBottom: 10,
  },
  yearPicker: {
    width: 200,
    height: 40,
  },
});

export default StudentReport;

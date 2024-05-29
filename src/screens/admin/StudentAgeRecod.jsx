import {collection, getDocs} from 'firebase/firestore';
import {FIREBASE_DB} from '../../firebase/firebaseConfig';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import moment from 'moment';
import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  ToastAndroid,
} from 'react-native';

// Helper function to calculate age
const calculateAge = dob => {
  const birthDate = moment(dob, 'YYYY-MM-DD');
  const currentDate = moment();
  const years = currentDate.diff(birthDate, 'years');
  birthDate.add(years, 'years');
  const months = currentDate.diff(birthDate, 'months');
  return {years, months};
};

const fetchAndProcessStudentData = async () => {
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

const generatePDF = async data => {
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
    // You can open the PDF using a PDF viewer or share it using a sharing library
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

const StudentAgeReport = () => {
  const [loading, setLoading] = useState(false);

  const handleGeneratePDF = async () => {
    setLoading(true);
    const data = await fetchAndProcessStudentData();
    await generatePDF(data);
    setLoading(false);
    ToastAndroid.show('PDF generated successfully', ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate Student Age Record Report</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Generate PDF" onPress={handleGeneratePDF} />
      )}
    </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default StudentAgeReport;

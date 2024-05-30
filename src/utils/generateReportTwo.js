// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export const generatePDF = async students => {
  try {
    // Convert HTML to PDF using react-native-html-to-pdf
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>Student Report</h2>
          <table>
            <thead>
              <tr>
                <th>Registration Number</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              ${students
                .map(
                  student => `
                <tr>
                  <td>${student.registrationNumber}</td>
                  <td>${student.studentName}</td>
                  <td>${student.class}</td>
                  <td>${student.subject}</td>
                  <td>${student.marks}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const pdfOptions = {
      html: htmlContent,
      fileName: 'student_report',
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(pdfOptions);

    // You can open the PDF using a PDF viewer or share it using a sharing library
    console.log('PDF file created:', file.filePath);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

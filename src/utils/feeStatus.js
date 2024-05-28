import {doc, setDoc} from 'firebase/firestore';
import {FIREBASE_DB} from '../firebase/firebaseConfig';

export const addFeeStatus = async (
  feeStatus,
  registrationNumber,
  year,
  month,
) => {
  try {
    // const year = new Date().getFullYear().toString();
    const feeStatusRef = doc(FIREBASE_DB, `students/${registrationNumber}`);
    await setDoc(
      feeStatusRef,
      {
        feeStatus: {
          [year]: {
            [month]: {
              amountDue: feeStatus.amountDue,
              amountPaid: feeStatus.amountPaid,
              payableAmount: feeStatus.payableAmount,
              paymentDate: feeStatus.paymentDate,
              remarks: feeStatus.remarks,
            },
          },
        },
      },
      {merge: true},
    ); // Use merge option to update the existing document without overwriting other fields
  } catch (error) {
    throw new Error('Error adding fee status: ' + error.message);
  }
};

// Example usage

// addFeeStatus(589, 'Ali', 5000, 2000, 3000, '2022-10-10', 'Paid 2000');

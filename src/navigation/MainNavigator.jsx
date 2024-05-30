// AppNavigator.js
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/auth/Login.jsx';
import AdminDashboard from '../screens/admin/AdminDashboard.jsx';

// import ManageStudents from './screens/ManageStudents'; // To be created
// import ManageTeachers from './screens/ManageTeachers'; // To be created
// import ManageFees from './screens/ManageFees'; // To be created
// import UploadTimetable from './screens/UploadTimetable'; // To be created
// import UploadSyllabus from './screens/UploadSyllabus'; // To be created

import StudentDashboard from '../screens/student/studentDashboard.jsx';
import AcademicProfile from '../screens/student/academicProfile.jsx';
import ViewFeeStatus from '../screens/student/viewFeeStatus.jsx';

import StudentLogin from '../screens/auth/studentLogin.jsx';
import StudentList from '../screens/admin/student/StudentList.jsx';
import StudentDetail from '../screens/admin/student/StudentDetails.jsx';
import EditStudent from '../screens/admin/student/EditStudent.jsx';
import AddClassForm from '../screens/admin/class/AddClassForm.jsx';
import ClassList from '../screens/admin/class/classList.jsx';
import ClassDetails from '../screens/admin/class/classDetails.jsx';
import SubjectsList from '../screens/admin/class/subjectsList.jsx';
import SectionsList from '../screens/admin/class/sectionsList.jsx';
import SectionDetails from '../screens/admin/class/sectionsDetails.jsx';
import CreateStudentForm from '../screens/admin/student/CreateStudentForm.jsx';
import AddTeacherForm from '../screens/admin/teacher/AddTeacherForm.jsx';
import TeacherList from '../screens/admin/teacher/TeacherList.jsx';
import TeacherDetail from '../screens/admin/teacher/TeacherDetails.jsx';
import EditTeacher from '../screens/admin/teacher/EditTeacher.jsx';
import StudentAgeRecord from '../screens/admin/StudentAgeRecod.jsx';
import FeeStatusForm from '../screens/admin/feeStatus/FeeStatusForm.jsx';
import FeeStatus from '../screens/admin/feeStatus/index.jsx';

import TeacherLogin from '../screens/auth/teacherLogin.jsx';
import TeacherScreen from '../screens/teacher/TeacherDashboard';
import StudentMarks from '../screens/teacher/StudentMarks.jsx';
import EditMarks from '../screens/teacher/EditMarks.jsx';
import StudentReport from '../screens/admin/reportTwo.jsx';
import TimeTable from '../screens/admin/TimeTable.jsx';

const Stack = createStackNavigator();

const AcademicProfileScreenOptions = ({route}) => {
  const {user, selectedYear} = route.params;
  const classEnrolled = user.classEnrolled;
  const parts = classEnrolled.split('/'); // Split the string by "/"
  const className = parts[1]; // Get the second part, which is the class name
  console.log(className); // Output: Class 5

  return {
    title: `Academic Profile Report (${selectedYear})`,
    headerStyle: {
      backgroundColor: '#000', // Background color of the header
    },
    headerTitleStyle: {
      fontSize: 18,
      color: '#fff', // Text color of the header title
      fontFamily: 'Arial',
      letterSpacing: 1,
    },
    headerBackTitleVisible: false, // To hide the back button title
    headerTintColor: '#fff', // Color of the back button
  };
};

const FeeStatusScreenOptions = ({route}) => {
  const {user, feeYear} = route.params;

  return {
    title: `Fee Status (${feeYear})`,
    headerStyle: {
      backgroundColor: '#000', // Background color of the header
    },
    headerTitleStyle: {
      fontSize: 18,
      color: '#fff', // Text color of the header title
      fontFamily: 'Arial',
      letterSpacing: 1,
    },
    headerBackTitleVisible: false, // To hide the back button title
    headerTintColor: '#fff', // Color of the back button
  };
};

const StudentNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="StudentLogin">
      <Stack.Screen
        name="StudentLogin"
        component={StudentLogin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StudentDashboard"
        component={StudentDashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AcademicProfile"
        component={AcademicProfile}
        options={AcademicProfileScreenOptions}
      />
      <Stack.Screen
        name="ViewFeeStatus"
        component={ViewFeeStatus}
        options={FeeStatusScreenOptions}
      />
      {/* <Stack.Screen
        name="Timetable"
        component={Timetable}
        options={{ title: 'Timetable' }}
      />
      <Stack.Screen
        name="Syllabus"
        component={Syllabus}
        options={{ title: 'Syllabus' }}
      />   */}
    </Stack.Navigator>
  );
};

const AdminNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{title: 'Dashboard', headerShown: false}}
      />
      <Stack.Screen
        name="AddClass"
        component={AddClassForm}
        options={{title: 'Add Class', headerShown: false}}
      />
      <Stack.Screen
        name="ClassList"
        component={ClassList}
        options={{title: 'Classes', headerShown: false}}
      />
      <Stack.Screen
        name="ClassDetails"
        component={ClassDetails}
        options={{title: 'Class Details', headerShown: false}}
      />
      <Stack.Screen
        name="SubjectsList"
        component={SubjectsList}
        options={{title: 'Subjects', headerShown: false}}
      />
      <Stack.Screen
        name="SectionsList"
        component={SectionsList}
        options={{title: 'Sections', headerShown: false}}
      />
      <Stack.Screen
        name="SectionDetails"
        component={SectionDetails}
        options={{title: 'Section Details', headerShown: false}}
      />
      <Stack.Screen
        name="addStudent"
        component={CreateStudentForm}
        options={{title: 'Add Student', headerShown: false}}
      />
      <Stack.Screen
        name="AddTeacher"
        component={AddTeacherForm}
        options={{title: 'Add Teacher', headerShown: false}}
      />
      <Stack.Screen
        name="Students"
        component={StudentList}
        options={{title: 'Students', headerShown: false}}
      />
      <Stack.Screen
        name="StudentDetails"
        component={StudentDetail}
        options={{title: 'Student Details', headerShown: false}}
      />
      <Stack.Screen
        name="EditStudent"
        component={EditStudent}
        options={{title: 'Edit Student', headerShown: false}}
      />
      <Stack.Screen
        name="TeacherList"
        component={TeacherList}
        options={{title: 'Teachers', headerShown: false}}
      />
      <Stack.Screen
        name="TeacherDetails"
        component={TeacherDetail}
        options={{title: 'Teacher Details', headerShown: false}}
      />
      <Stack.Screen
        name="EditTeacher"
        component={EditTeacher}
        options={{title: 'Edit Teacher', headerShown: false}}
      />
      <Stack.Screen
        name="StudentAgeRecord"
        component={StudentAgeRecord}
        options={{title: 'Student Age Record', headerShown: false}}
      />
      <Stack.Screen
        name="FeeStatusForm"
        component={FeeStatusForm}
        options={{title: 'Fee Status', headerShown: false}}
      />
      <Stack.Screen
        name="FeeStatus"
        component={FeeStatus}
        options={{title: 'Fee Status', headerShown: false}}
      />
      <Stack.Screen
        name="StudentRecord"
        component={StudentReport}
        options={{title: 'Student Record', headerShown: false}}
      />
      <Stack.Screen
        name="TimeTable"
        component={TimeTable}
        options={{title: 'Time Table', headerShown: false}}
      />
      {/* <Stack.Screen
          name="ManageStudents"
          component={ManageStudents}
          options={{title: 'Manage Students'}}
        />
        <Stack.Screen
          name="ManageTeachers"
          component={ManageTeachers}
          options={{title: 'Manage Teachers'}}
        />
        <Stack.Screen
          name="ManageFees"
          component={ManageFees}
          options={{title: 'Manage Fees'}}
        />
        <Stack.Screen
          name="UploadTimetable"
          component={UploadTimetable}
          options={{title: 'Upload Timetable'}}
        />
        <Stack.Screen
          name="UploadSyllabus"
          component={UploadSyllabus}
          options={{title: 'Upload Syllabus'}}
        /> */}
    </Stack.Navigator>
  );
};

const TeacherNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="TeacherLogin">
      <Stack.Screen
        name="TeacherLogin"
        component={TeacherLogin}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="TeacherDashboard"
        component={TeacherScreen}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="StudentMarks"
        component={StudentMarks}
        options={{headerShown: false}}
      />
            <Stack.Screen
        name="EditMarks"
        component={EditMarks}
        options={{headerShown: false}}
      />
      
      {/*    <Stack.Screen
        name="Marks"
        component={Marks}
        options={{ title: 'Marks' }}
      />
      <Stack.Screen
        name="FeeStatus"
        component={FeeStatus}
        options={{ title: 'Fee Status' }}
      />
      <Stack.Screen
        name="Timetable"
        component={Timetable}
        options={{ title: 'Timetable' }}
      />
      <Stack.Screen
        name="Syllabus"
        component={Syllabus}
        options={{ title: 'Syllabus' }}
      />  */}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TeacherNavigator">
        <Stack.Screen
          name="StudentNavigator"
          component={StudentNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AdminNavigator"
          component={AdminNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TeacherNavigator"
          component={TeacherNavigator}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;

// AppNavigator.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/auth/Login.jsx';
import AdminDashboard from '../screens/admin/AdminDashboard.jsx';

// import ManageStudents from './screens/ManageStudents'; // To be created
// import ManageTeachers from './screens/ManageTeachers'; // To be created
// import ManageFees from './screens/ManageFees'; // To be created
// import UploadTimetable from './screens/UploadTimetable'; // To be created
// import UploadSyllabus from './screens/UploadSyllabus'; // To be created

import StudentLogin from '../screens/auth/studentLogin.jsx';
import StudentDashboard from '../screens/student/studentDashboard.jsx';
import StudentList from '../screens/admin/student/StudentList.jsx';
import StudentDetail from '../screens/admin/student/StudentDetails.jsx';
import EditStudent from '../screens/admin/student/EditStudent.jsx';
import AddClassForm from '../screens/admin/class/AddClassForm.jsx';
import ClassList from '../screens/admin/class/classList.jsx';
import ClassDetails from '../screens/admin/class/classDetails.jsx';
import SubjectsList from '../screens/admin/class/subjectsList.jsx';
import SectionsList from '../screens/admin/class/sectionsList.jsx';
import SectionDetails from '../screens/admin/class/sectionsDetails.jsx';
import CreateStudentForm from '../screens/admin/CreateStudentForm.jsx';
import AddTeacherForm from '../screens/admin/teacher/AddTeacherForm.jsx';
import TeacherList from '../screens/admin/teacher/TeacherList.jsx';
import TeacherDetail from '../screens/admin/teacher/TeacherDetails.jsx';
import EditTeacher from '../screens/admin/teacher/EditTeacher.jsx';

const Stack = createStackNavigator();

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
        options={{ headerShown: false }}
      /> 
      {/* <Stack.Screen
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
        options={{title: 'Dashboard'}}
      />
      <Stack.Screen
        name="AddClass"
        component={AddClassForm}
        options={{title: 'Add Class'}}
      />
      <Stack.Screen
        name="ClassList"
        component={ClassList}
        options={{title: 'Classes'}}
      />
      <Stack.Screen
        name="ClassDetails"
        component={ClassDetails}
        options={{title: 'Class Details'}}
      />
      <Stack.Screen
        name="SubjectsList"
        component={SubjectsList}
        options={{title: 'Subjects'}}
      />
      <Stack.Screen
        name="SectionsList"
        component={SectionsList}
        options={{title: 'Sections'}}
      />
      <Stack.Screen
        name="SectionDetails"
        component={SectionDetails}
        options={{title: 'Section Details'}}
      />
      <Stack.Screen
        name="addStudent"
        component={CreateStudentForm}
        options={{title: 'Add Student'}}
      />
      <Stack.Screen
        name="AddTeacher"
        component={AddTeacherForm}
        options={{title: 'Add Teacher'}}
      />
      <Stack.Screen
        name="Students"
        component={StudentList}
        options={{title: 'Students'}}
      />
      <Stack.Screen
        name="StudentDetails"
        component={StudentDetail}
        options={{title: 'Student Details'}}
      />
      <Stack.Screen
        name="EditStudent"
        component={EditStudent}
        options={{title: 'Edit Student'}}
      />
      <Stack.Screen
        name="TeacherList"
        component={TeacherList}
        options={{title: 'Teachers'}}
      />
      <Stack.Screen
        name="TeacherDetails"
        component={TeacherDetail}
        options={{title: 'Teacher Details'}}
      />
      <Stack.Screen
        name="EditTeacher"
        component={EditTeacher}
        options={{title: 'Edit Teacher'}}
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



const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StudentNavigator">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
// AppNavigator.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/auth/Login';
import AdminDashboard from '../screens/admin/AdminDashboard';
import AddClassForm from '../screens/admin/class/AddClassForm.jsx';
import ClassList from '../screens/admin/class/classList.jsx';
import ClassDetails from '../screens/admin/class/classDetails.jsx';
import SubjectsList from '../screens/admin/class/subjectsList.jsx';
import SectionsList from '../screens/admin/class/sectionsList.jsx';
import SectionDetails from '../screens/admin/class/sectionsDetails.jsx';
import CreateStudentForm from '../screens/admin/student/CreateStudentForm.jsx';
import AddTeacherForm from '../screens/admin/teacher/AddTeacherForm.jsx';
import StudentList from '../screens/admin/student/StudentList.jsx';
import StudentDetails from '../screens/admin/student/StudentDetails.jsx';
import EditStudent from '../screens/admin/student/EditStudent.jsx';
// import ManageStudents from './screens/ManageStudents'; // To be created
// import ManageTeachers from './screens/ManageTeachers'; // To be created
// import ManageFees from './screens/ManageFees'; // To be created
// import UploadTimetable from './screens/UploadTimetable'; // To be created
// import UploadSyllabus from './screens/UploadSyllabus'; // To be created

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
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
          name="addTeacher"
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
          component={StudentDetails}
          options={{title: 'Student Details'}}
        />
        <Stack.Screen
          name="EditStudent"
          component={EditStudent}
          options={{title: 'Edit Student'}}
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
    </NavigationContainer>
  );
};

export default Navigator;

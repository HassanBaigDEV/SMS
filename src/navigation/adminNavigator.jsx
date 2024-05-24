// AppNavigator.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/auth/Login';
import AdminDashboard from '../screens/admin/AdminDashboard';
import AddClassForm from '../screens/admin/AddClassForm';
// import ManageStudents from './screens/ManageStudents'; // To be created
// import ManageTeachers from './screens/ManageTeachers'; // To be created
// import ManageFees from './screens/ManageFees'; // To be created
// import UploadTimetable from './screens/UploadTimetable'; // To be created
// import UploadSyllabus from './screens/UploadSyllabus'; // To be created

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AdminDashboard">
        <Stack.Screen
          name="AdminLogin"
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

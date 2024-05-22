// RoleBasedComponent.js
import React from 'react';
import {View, Text} from 'react-native';

const RoleBasedComponent = ({userRole, children}) => {
  if (userRole !== 'admin') {
    return (
      <View>
        <Text>Access Denied: Admins only</Text>
      </View>
    );
  }
  return <>{children}</>;
};

export default RoleBasedComponent;

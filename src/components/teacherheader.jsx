import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';

const HeaderContainer = styled.View`
  height: ${Platform.OS === 'ios' ? '110px' : '90px'};
  padding-top: ${Platform.OS === 'ios' ? '40px' : '30px'};
  justify-content: left;
  padding-left: 15px;
  padding-bottom: 10px;
  background-color: #473f97;
  flex-direction: row;
  align-items: center;
`;

const BackButton = styled.Image`
  color: white;
  font-size: 18px;
`;

const TeacherHeader = ({ title }) => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <HeaderContainer>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton source={require('../assets/icons/chevron-left.png')} />
        </TouchableOpacity>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            marginLeft: 10,
          }}>
          {title}
        </Text>
      </HeaderContainer>
    </>
  );
};

export default TeacherHeader;

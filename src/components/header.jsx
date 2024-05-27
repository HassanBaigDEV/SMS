import React from 'react';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacity, StatusBar, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'react-native-paper';

const HeaderContainer = styled(LinearGradient)`
  height: ${Platform.OS === 'ios' ? '110px' : '90px'};
  padding-top: ${Platform.OS === 'ios' ? '40px' : '30px'};
  justify-content: left;
  padding-left: 15px;
  padding-bottom: 10px;
  /* border-bottom-left-radius: 30px; */
  border-bottom-right-radius: 0px;
  flex-direction: row;
  align-items: center;
`;

const BackButton = styled.Image`
  color: white;
  font-size: 18px;
`;

const Header = ({title}) => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <HeaderContainer
        colors={['rgb(64, 172, 194)', 'rgb(131, 15, 147)']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton source={require('../assests/icons/chevron-left.png')} />
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

export default Header;

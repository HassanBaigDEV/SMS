import React from 'react';
import {FIREBASE_APP} from './src/firebase/firebaseConfig';
import {View, Text} from 'react-native';


export default function App() {
  React.useEffect(() => {
    console.log(FIREBASE_APP);
  }, []);
  return (
    <View>
      <Text>App</Text>
    </View>
  );
}

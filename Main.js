import React from 'react';
import {
  StatusBar,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';

const Todo = () => {
  const [item, setItem] = React.useState('');
  const [list, setList] = React.useState([]);
  const [update, setUpdate] = React.useState(-1);
  const [filteredList, setFilteredList] = React.useState([]);
  const [search, setSearch] = React.useState(true);

  const addItems = () => {
    setFilteredList([]);
    setList([...list, item]);
    setItem('');
    Keyboard.dismiss();
    ToastAndroid.show('Item Added', ToastAndroid.SHORT);
  };

  const deleteItem = currIndex => {
    setList(() => list.filter((element, index) => index != currIndex));
    ToastAndroid.show('Item Deleted', ToastAndroid.SHORT);
  };

  const updateList = () => {
    const updated = [...list];
    updated[update] = item;
    setList(updated);
    setItem('');
    setUpdate(-1);
    Keyboard.dismiss();
    ToastAndroid.show('Item Updated', ToastAndroid.SHORT);
  };

  const updateItem = currIndex => {
    setItem(() => list.find((element, index) => index == currIndex));
    setUpdate(currIndex);
  };

  const searchItem = () => {
    setSearch(false);
    const filteredList = list.filter(element =>
      element.toLowerCase().includes(item),
    );
    setFilteredList(filteredList);
    setItem('');
    Keyboard.dismiss();
  };

  const removeList = () => {
    setSearch(true);
    setFilteredList([]);
  };

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={'lavender'} />
      <Text style={styles.mainbar}>todolist</Text>
      <View style={{flexDirection: 'row'}}>
        <TextInput
          style={styles.TextInput}
          label="Enter item"
          onChangeText={setItem}
          value={item}></TextInput>
        <TouchableOpacity
          onPress={update == -1 ? addItems : updateList}
          style={styles.touch}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
            {update == -1 ? 'Add!' : 'Update!'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={search ? searchItem : removeList}
          style={styles.touch}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
            {search ? 'Search!' : 'Cancel'}
          </Text>
        </TouchableOpacity>
      </View>
      {filteredList.length == 0 ? (
        <ScrollView style={styles.listBackground}>
          {list.map((element, index) => (
            <View style={styles.list}>
              {/* <Animated.View entering={SlideInRight} exiting={SlideOutRight}> */}
              <Text style={styles.listItem}>
                {index + 1}. {element}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="delete"
                  size={30}
                  onPress={() => {
                    deleteItem(index);
                  }}
                />
                <Icon
                  name="swap-horizontal"
                  size={30}
                  onPress={() => updateItem(index)}
                />
              </View>
              {/* </Animated.View> */}
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView style={styles.listBackground}>
          {filteredList.map((element, index) => (
            <View style={styles.list}>
              <Text style={styles.listItem}>
                {index + 1}. {element}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainbar: {
    backgroundColor: 'lavender',
    fontSize: 35,
    color: 'grey',
    fontWeight: 'bold',
    // textAlign: 'right',
    padding: 10,
  },
  TextInput: {
    width: 200,
    margin: 10,
    backgroundColor: 'white',
  },
  touch: {
    backgroundColor: 'lavender',
    marginLeft: 5,
    marginTop: 20,
    width: 90,
    height: 50,
    padding: 13,
    borderRadius: 30,
    alignItems: 'center',
  },
  listBackground: {
    backgroundColor: 'lavender',
    opacity: 0.5,
    padding: 10,
    margin: 10,
    borderRadius: 25,
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  listItem: {
    marginLeft: 20,
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
  },
  update: {
    backgroundColor: 'grey',
    paddingRight: 10,
    paddingLeft: 10,
    alignItems: 'center',
    borderRadius: 25,
  },
});

export default Todo;

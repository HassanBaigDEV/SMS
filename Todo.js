// import React, {useState} from 'react';
// import {
//   StatusBar,
//   Text,
//   StyleSheet,
//   View,
//   TouchableOpacity,
//   ScrollView,
//   Keyboard,
//   ToastAndroid,
//   FlatList,
// } from 'react-native';
// import {TextInput} from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const Main = () => {
//   const [item, setItem] = useState('');
//   const [list, setList] = useState([]);
//   const [update, setUpdate] = useState(-1);
//   const [search, setSearch] = useState(false);
//   const [filteredList, setFilteredList] = useState([]);

//   const addItems = () => {
//     if (!item) {
//       return ToastAndroid.show('Please enter an item', ToastAndroid.SHORT);
//     }
//     setList([...list, {id: Math.random().toString(), value: item}]);
//     setItem('');
//     Keyboard.dismiss();
//     ToastAndroid.show('Item Added', ToastAndroid.SHORT);
//   };

//   const updateItem = () => {
//     const updated = [...list];
//     updated[update] = {id: updated[update].id, value: item};
//     setList(updated);
//     setItem('');
//     setUpdate(-1);
//     Keyboard.dismiss();
//     ToastAndroid.show('Item Updated', ToastAndroid.SHORT);
//   };

//   const searchItem = () => {
//     if (!item) {
//       return ToastAndroid.show('Please enter an item', ToastAndroid.SHORT);
//     }
//     const filtered = list.filter(element =>
//       element.value.toLowerCase().includes(item.toLowerCase()),
//     );
//     setFilteredList(filtered);
//   };

//   const resetSearch = () => {
//     setFilteredList([]);
//     setItem('');
//     setSearch(false);
//   };

//   return (
//     <View style={{flex: 1}}>
//       <StatusBar backgroundColor={'lavender'} />
//       <Text style={styles.mainbar}>todolist</Text>
//       <View style={{padding: 10, width: '100vw'}}>
//         <TextInput
//           style={styles.TextInput}
//           label="Enter item"
//           onChangeText={setItem}
//           value={item}></TextInput>
//       </View>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'center',
//           marginBottom: 15,
//         }}>
//         <TouchableOpacity
//           style={styles.touch}
//           onPress={update == -1 ? addItems : updateItem}>
//           <Text> {update == -1 ? 'Add!' : 'Update'}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.touch}
//           onPress={() => {
//             setSearch(!search);
//             if (!search) {
//               searchItem();
//             } else {
//               resetSearch();
//             }
//           }}>
//           <Text>{search ? 'Cancel' : 'Search!'}</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         // data={search ? list : filteredList}
//         data={list}
//         keyExtractor={item => item.id}
//         renderItem={({item, index}) => (
//           <View style={styles.list}>
//             <Text style={styles.listItem}>{item.value}</Text>
//             <View style={{flexDirection: 'row'}}>
//               <Icon
//                 name="delete"
//                 size={30}
//                 onPress={() => {
//                   setList(prevList =>
//                     prevList.filter(element => element.id !== item.id),
//                   );
//                   ToastAndroid.show('Item Deleted', ToastAndroid.SHORT);
//                 }}
//               />
//               <Icon
//                 name="swap-horizontal"
//                 size={30}
//                 onPress={() => {
//                   setItem(item.value);
//                   setUpdate(index);
//                 }}
//               />
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainbar: {
//     backgroundColor: 'lavender',
//     fontSize: 35,
//     color: 'grey',
//     fontWeight: 'bold',
//     padding: 10,
//   },
//   TextInput: {
//     width: '90%',
//     margin: 10,
//     backgroundColor: 'white',
//   },
//   touch: {
//     backgroundColor: 'lavender',
//     marginLeft: 10,
//     marginRight: 10,
//     marginTop: 20,
//     width: 80,
//     height: 50,
//     padding: 13,
//     borderRadius: 30,
//     alignItems: 'center',
//   },
//   listBackground: {
//     backgroundColor: 'lavender',
//     opacity: 0.5,
//     padding: 10,
//     margin: 10,
//     borderRadius: 25,
//   },
//   list: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 5,
//   },
//   listItem: {
//     marginLeft: 20,
//     marginTop: 5,
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'grey',
//   },
// });

// export default Main;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

const App = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTask = () => {
    if (task) {
      if (editIndex !== -1) {
        // Edit existing task
        const updatedTasks = [...tasks];
        updatedTasks[editIndex] = task;
        setTasks(updatedTasks);
        setEditIndex(-1);
      } else {
        // Add new task
        setTasks([...tasks, task]);
      }
      setTask('');
    }
  };

  const handleEditTask = index => {
    const taskToEdit = tasks[index];
    setTask(taskToEdit);
    setEditIndex(index);
  };

  const handleDeleteTask = index => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleSearch = text => {
    setSearchQuery(text);
  };

  const filteredTasks = tasks.filter(task =>
    task.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderItem = ({item, index}) => (
    <View style={styles.task}>
      <Text style={styles.itemList}>{item}</Text>
      <View style={styles.taskButtons}>
        <TouchableOpacity onPress={() => handleEditTask(index)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTask(index)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Geeksforgeeks</Text>
      <Text style={styles.title}>ToDo App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task"
        value={task}
        onChangeText={text => setTask(text)}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>
          {editIndex !== -1 ? 'Update Task' : 'Add Task'}
        </Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Search task"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredTasks}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 7,
    color: 'green',
  },
  input: {
    borderWidth: 3,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 18,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  task: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    fontSize: 18,
  },
  itemList: {
    fontSize: 19,
  },
  taskButtons: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: 10,
    color: 'green',
    fontWeight: 'bold',
    fontSize: 18,
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default App;

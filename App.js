/*
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample() {
  const [image, setImage] = useState([]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(oldImage => [...oldImage, result.uri]);
      image.forEach(img => console.log(img));
    }
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
     {image.map((img, index) => (<Image key={index} source={{ uri: img }} style={{width: 200, height: 200}} />))}
    </View>
    </ScrollView>
  );
}
*/
import React , { useState, useEffect } from 'react';
import { Dimensions, ScrollView, Alert, Modal, StyleSheet, Text, TouchableHighlight, Pressable, View, Button, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { TextInput, DefaultTheme, Button as PaperButton, IconButton, Provider as PaperProvider }  from 'react-native-paper';
import sample from './assets/sample.jpeg';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {ImageBrowser} from 'expo-image-picker-multiple';
import * as ImageManipulator from 'expo-image-manipulator';
import { AssetsSelector } from 'expo-images-picker';
import { Ionicons } from '@expo/vector-icons';
function Home({ navigation }) {

  const [albums, setAlbums] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editAlbumID, seteditAlbumID] = useState(0);
  const [albumCount, setAlbumCount] = useState(0);
  const [newAlbumName, setNewAlbumName] = useState('New Album');
  let editAlbum = (index) => {
    setModalVisible(true);
    seteditAlbumID(index);
  }

  let createAlbum = (context) => {
    setAlbums(oldAlbum => [{id:albumCount, name: newAlbumName}, ...oldAlbum]);
    context.setDict(albumCount, []);
    setAlbumCount(oldAlbumCount => oldAlbumCount + 1);
    console.log(context.ImageDict);
    setCreateModalVisible(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ImageContext.Consumer>
        {
          context=>(
        <IconButton icon='plus'
           color="#65ABD4"
           onPress={() => setCreateModalVisible(true)}></IconButton>
          )
        }
        </ImageContext.Consumer>
      ),
    });
  }, [navigation]);
  return (
    <ImageContext.Consumer>
      {
        context=>(
          <View style={{ flex: 1, alignItems: 'center'}}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <View style={styles.modalElementView}>
                <PaperButton
                  onPress={async () => {
                    setModalVisible(false);
                    navigation.navigate('Conference', {editAlbumID: editAlbumID,});
                  }}>
                  Edit Album
                </PaperButton>
                </View>
                <View style={styles.modalElementView}>
                <PaperButton
                  onPress={() => {
                  }}>
                  Display Album
                </PaperButton>
                </View>
                <View style={styles.modalElementView}>
                <PaperButton
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  Hide Modal
                </PaperButton>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
              animationType="slide"
              visible={createModalVisible}>
              <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.modalElementView}>
                 <TextInput
                  value={newAlbumName}
                  onChangeText={(albumName) => setNewAlbumName(albumName)}
                  placeholder={'New Album'}
                />
                </View>
                <View style={styles.modalElementView}>
                <PaperButton
                  onPress={()=>{createAlbum(context)}}
                >
                  Create
                </PaperButton>
                </View>
                </View>
                </View>
          </Modal>
          <View style={{marginVertical: 10}}>
          <PaperButton
            onPress={() => navigation.navigate('Story')}
          >
          </PaperButton>
          </View>
                {albums.map(alb => (<View style={{marginVertical: 10}} key={alb.id}><PaperButton key={alb.id} onPress={()=>{editAlbum({...alb}.id)}}>{alb.name}</PaperButton></View>))}
        </View>
        )
      }
    </ImageContext.Consumer>
  );
}

function Conference({ route, navigation }) {
  const {editAlbumID} = route.params;
  console.log(editAlbumID);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  let selectPhotos = (context) => {navigation.navigate('ImageBrowserPage', {editAlbumID: editAlbumID})};

  let addPhotos = async (context) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(editAlbumID);
    if (!result.cancelled) {
      context.setDict(editAlbumID, [...context.ImageDict[editAlbumID], result.uri]);
    }
  };

  return (
    <ImageContext.Consumer>
      {context => (
        <ScrollView>
        <View style={styles.container}>
        <PaperButton
          onPress={()=>{selectPhotos(context)}}
        >
          add new photos
        </PaperButton>
        {context.ImageDict[editAlbumID].map((img, index) => (<Image key={index} source={{ uri: img }} style={{width: 200, height: 200}} />))}
        </View>
        </ScrollView>
      )}
    </ImageContext.Consumer>
  );
}

function Story() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Our Story</Text>
    </View>
  );
}

function ImageBrowserPage({ route, navigation }) {
  const {editAlbumID} = route.params;

  let  _processImageAsync = async(uri) => {
    const file = await ImageManipulator.manipulateAsync(
      uri,
      [{resize: { width: 1000 }}],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return file;
  };

  let imagesCallback = (callback, context) => {
    callback.then(async (photos) => {
      const cPhotos = [];
      for(let photo of photos) {
        const pPhoto = await _processImageAsync(photo.uri);
        cPhotos.push(pPhoto.uri);
        console.log(pPhoto.uri);
      }
      context.setDict(editAlbumID, [...context.ImageDict[editAlbumID], ...cPhotos]);
      navigation.navigate('Conference', {editAlbumID: editAlbumID,});
    })
    .catch((e) => console.log(e));
  };

  let _renderDoneButton = (count, onSubmit) => {
    if (!count) return null;
    return <TouchableOpacity title={'Done'} onPress={onSubmit}>
      <Text onPress={onSubmit}>Done</Text>
    </TouchableOpacity>
  }

  let updateHandler = (count, onSubmit) => {
    navigation.setOptions({
      headerRight: () => _renderDoneButton(count, onSubmit)
    });
  };

  let renderSelectedComponent = (number) => (
    <View style={styles.countBadge}>
      <Text>{number}</Text>
    </View>
  );

  const emptyStayComponent = <Text>Empty =(</Text>;

    return (
      <ImageContext.Consumer>
      {context => (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ImageBrowser
          max={4}
          onChange={updateHandler}
          callback={(callback)=>{imagesCallback(callback, context)}}
          renderSelectedComponent={renderSelectedComponent}
          emptyStayComponent={emptyStayComponent}
        />
      </View>)}
      </ImageContext.Consumer>
    );
}

const Stack = createStackNavigator();

function App() {

  const [state, setState] = useState({"-1":""});

  return (
    <PaperProvider theme={theme}>
    <ImageContext.Provider value=
    {{
      ImageDict: state,
      setDict: (editingAlbum, newEntry)=> 
      {console.log(editingAlbum);
        console.log(newEntry);
        console.log({...state, [editingAlbum]: newEntry,})
        setState({...state, [editingAlbum]: newEntry,});
      },
    }}>
     <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home}  options=
        {{
          headerTitle: "Configure Albums",
        }}
        />
        <Stack.Screen name="Conference" component={Conference} />
        <Stack.Screen name="Story" component={Story} />
        <Stack.Screen name="ImageBrowserPage" component={ImageBrowserPage} />
      </Stack.Navigator>
    </NavigationContainer>
    </ImageContext.Provider>
    </PaperProvider>
  );
}

const ImageContext = React.createContext({ ImageDict: {"-1":""}, setDict: ()=> {},});

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: Dimensions.get('window').width*0.8,
    height: Dimensions.get('window').height*0.3,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalElementView:
  {
    width: '90%',
    marginVertical: '3%',
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: 'absolute',
    right: 3,
    bottom: 3,
    justifyContent: 'center',
    backgroundColor: '#0580FF'
  },
});

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

export default App;





// export default function App() {
//   const [modalVisible, setModalVisible] = useState(false);
//   return (
//     <View style={styles.centeredView}>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           Alert.alert('Modal has been closed.');
//         }}>
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalText}>Hello World!</Text>

//             <TouchableHighlight
//               style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
//               onPress={() => {
//                 setModalVisible(!modalVisible);
//               }}>
//               <Text style={styles.textStyle}>Hide Modal</Text>
//             </TouchableHighlight>
//           </View>
//         </View>
//       </Modal>

//       <TouchableHighlight
//         style={styles.openButton}
//         onPress={() => {
//           setModalVisible(true);
//         }}>
//         <Text style={styles.textStyle}>Show Modal</Text>
//       </TouchableHighlight>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 22,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   openButton: {
//     backgroundColor: '#F194FF',
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
// });
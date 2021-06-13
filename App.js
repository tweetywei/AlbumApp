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
import { ScrollView, Alert, Modal, StyleSheet, Text, TouchableHighlight, Pressable, View, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as MediaLibrary from 'expo-media-library'
import * as ImagePicker from 'expo-image-picker';



function Home({ navigation }) {

  const [albums, setAlbums] = useState([]);
  const [ImageDict, setImageDict] = useState({"-1":""});
  const [modalVisible, setModalVisible] = useState(false);
  const [editAlbumID, seteditAlbumID] = useState(0);
  const [albumCount, setAlbumCount] = useState(0);

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

  let editAlbum = (index) => {
    setModalVisible(true);
    seteditAlbumID(index);
  }

  let createAlbum = () => {
    setAlbums(oldAlbum => [{id:albumCount, name: "new album"}, ...oldAlbum]);
    setImageDict(oldImageDict => {
      return {[albumCount]: [], ...oldImageDict};
    });
    setAlbumCount(oldAlbumCount => oldAlbumCount + 1);
    console.log(ImageDict);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
              onPress={async () => {
                setModalVisible(false);
                navigation.navigate('Conference', {editAlbumID: editAlbumID, ImageDict: {...ImageDict}, isAddPhoto: true, });
              }}>
              <Text style={styles.textStyle}>Add Photo</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Conference', {editAlbumID: editAlbumID, ImageDict: {...ImageDict}, isAddPhoto: false, });
                }}>
              <Text style={styles.textStyle}>Show Photo</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
              onPress={() => {
              }}>
              <Text style={styles.textStyle}>Display Album</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      <Text>Welcome to our Home Screen</Text>
      <Pressable
        onPress={() => navigation.navigate('Story')}
        style={{ backgroundColor: 'plum', padding: 10 }}
      >
       <Text>Story</Text>
      </Pressable>
      <Button
          onPress={createAlbum}
          title="create new album"
        />
     {albums.map(alb => (<Button key={alb.id} title={alb.name} onPress={()=>{editAlbum({...alb}.id)}}/>))}
    </View>
  );
}

function Conference({ route, navigation }) {
  const { ImageDict,  editAlbumID, isAddPhoto } = route.params;
  console.log(ImageDict);
  console.log(editAlbumID);

  let addPhotos = async (albumID) => {
    let number = await closeModal();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(albumID);
    if (!result.cancelled) {
      setImageDict(oldImageDict => {
         return {...oldImageDict, [albumID]:[...oldImageDict[albumID], result.uri]};
        });
    }
  };

  return (
    <ScrollView>
    <View style={styles.container}>
     {ImageDict[editAlbumID].map((img, index) => (<Image key={index} source={{ uri: img }} style={{width: 200, height: 200}} />))}
    </View>
    </ScrollView>
  );
}

function Story() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Our Story</Text>
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
     <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Conference" component={Conference} />
        <Stack.Screen name="Story" component={Story} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
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
});

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
import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ImageEditor,
  Button,
  Image,
  ActivityIndicator
} from 'react-native';

import Text from '../components/myText';
import Form from '../components/myForm';

import ImagePicker from 'react-native-image-picker';
import firebaseSDK from '../firebase/FirebaseSDK';

class SignUp extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    gender: '',
    avatar: ''
  }

  // const options = {
  //   title: 'Select Avatar',
  //   customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  //   storageOptions: {
  //     skipBackup: true,
  //     path: 'images',
  //   },
  // };

  constructor() {
    super();
    this.state = { 
      dwidth: 300,
      isLoading: false 
    };
  }

  cancelSignUp() {
      this.props.navigation.navigate('SignIn')
  }


  componentWillMount() {
    let dimention = Dimensions.get('window').width;
    this.setState({dwidth:dimention-60})
  }

  onSignUp = async () => {
    
    const user = {
      name: this.state.name,
      email: this.state.email,
      avatar: this.state.avatar,
      gender: this.state.gender,
      password: this.state.password
    }

    await this.setState({
      isLoading: true
    })

    await firebaseSDK.createAccount(user);

    this.setState({
      isLoading: false
    }, () => {
      this.props.navigation.navigate('SignIn')
    })

  }

  // onImageUpload = async () => {
  //   // const { status: cameraRollPerm } = await Permissions.askAsync(
  //   //   Permissions.CAMERA_ROLL
  //   // );
  //   try {
  //     // only if user allows permission to camera roll
  //       let pickerResult = await ImagePicker.launchImageLibraryAsync({
  //         allowsEditing: true,
  //         aspect: [4, 3],
  //       });
  //       console.log(
  //         'ready to upload... pickerResult json:' + JSON.stringify(pickerResult)
  //       );

  //       var wantedMaxSize = 150;
  //       var rawheight = pickerResult.height;
  //       var rawwidth = pickerResult.width;
        
  //       var ratio = rawwidth / rawheight;
  //       var wantedwidth = wantedMaxSize;
  //       var wantedheight = wantedMaxSize/ratio;
  //       // check vertical or horizontal
  //       if(rawheight > rawwidth){
  //           wantedwidth = wantedMaxSize*ratio;
  //           wantedheight = wantedMaxSize;
  //       }
  //       console.log("scale image to x:" + wantedwidth + " y:" + wantedheight);
  //       let resizedUri = await new Promise((resolve, reject) => {
  //         ImageEditor.cropImage(pickerResult.uri,
  //         {
  //             offset: { x: 0, y: 0 },
  //             size: { width: pickerResult.width, height: pickerResult.height },
  //             displaySize: { width: wantedwidth, height: wantedheight },
  //             resizeMode: 'contain',
  //         },
  //         (uri) => resolve(uri),
  //         () => reject(),
  //         );
  //       });

  //       console.warn(resizedUri)

  //       this.setState({
  //         image: resizedUri
  //       })

  //       let uploadUrl = await firebaseSDK.uploadImage(resizedUri);
  //       //let uploadUrl = await firebaseSDK.uploadImageAsync(resizedUri);
  //       await this.setState({ avatar: uploadUrl });
  //       console.log(" - await upload successful url:" + uploadUrl);
  //       console.log(" - await upload successful avatar state:" + this.state.avatar);
  //       await firebaseSDK.updateAvatar(uploadUrl); //might failed
      
  //   } catch (err) {
  //     console.log('onImageUpload error:' + err.message);
  //     alert('Upload image error:' + err.message);
  //   }
  // };

  onChangeTextName = name => this.setState({ name });
  onChangeTextEmail = email => this.setState({ email });
  onChangeTextGender = gender => this.setState({ gender });
  onChangeTextAvatar = avatar => this.setState({ avatar });
  onChangeTextPassword = password => this.setState({ password });

  render() {
    return (
        <View style={{ flex: 1 }}>

          <View 
            style={[style.boxStyle, { width: this.state.dwidth }]}
            showsHorizontalScrollIndicator={false}
          >
            <Text style={{ textAlign: 'center', color: '#8e24aa', fontSize: 25 }}>
              Sign Up
            </Text>

            <View style={{ marginTop: 16 }}>
              <TextInput
                placeholder="Name"
                style={{
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1,
                  paddingLeft: 5,
                }}
                value={this.state.name}
                onChangeText={this.onChangeTextName}
              />
            </View>

            <View style={{ marginTop: 16 }}>
              <TextInput
                placeholder="Email"
                style={{
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1,
                  paddingLeft: 5,
                }}
                value={this.state.email}
                onChangeText={this.onChangeTextEmail}
              />
            </View>

            <View style={{ marginTop: 16 }}>
              <TextInput
                placeholder="Gender"
                style={{
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1,
                  paddingLeft: 5,
                }}
                value={this.state.gender}
                onChangeText={this.onChangeTextGender}
              />
            </View>

            <View style={{ marginTop: 16 }}>
              <TextInput
                placeholder="Avatar"
                style={{
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1,
                  paddingLeft: 5,
                }}
                value={this.state.avatar}
                onChangeText={this.onChangeTextAvatar}
              />
            </View>

            <View style={{ marginTop: 16 }}>
              <TextInput
                placeholder="Password"
                style={{
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1,
                  paddingLeft: 5,
                }}
                value={this.state.password}
                onChangeText={this.onChangeTextPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={{
                marginTop: 30,
                alignSelf: 'center',
                lineHeight: 50,
              }}
              onPress={() => this.onSignUp()}>
              <View
                style={{
                  width: 200,
                  height: 50,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#ab47bc',
                }}>
                <Text style={{ color: 'white', fontSize: 15, lineHeight: 50 }}>
                  Sign Up
                </Text>
              </View>
            </TouchableOpacity>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>

              <TouchableOpacity
                onPress={()=>this.cancelSignUp()}
              >
                <Text style={{ color: '#ab47bc', fontSize: 15, lineHeight: 80 }}>
                  Sign In
                </Text>
              </TouchableOpacity>
            
            </View>

          </View>
        </View>
    );
  }
}
const style = StyleSheet.create({
  boxStyle: {
    flex: 1,
    padding: 25,
    alignSelf: 'center',
    marginTop: 24 * 2,
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 12,
  },
});

export default SignUp;

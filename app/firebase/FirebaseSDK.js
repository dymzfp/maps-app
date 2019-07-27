import firebase from 'firebase';
import uuid from 'uuid';
import { AsyncStorage } from 'react-native';

const config = {
  apiKey: "AIzaSyDNccJvi7t6sIfNS4K2RihNYWLuYBLILIs",
  authDomain: "fir-crud-464c4.firebaseapp.com",
  databaseURL: "https://fir-crud-464c4.firebaseio.com",
  projectId: "fir-crud-464c4",
  storageBucket: "gs://fir-crud-464c4.appspot.com",
  messagingSenderId: "288342281567",
  appId: "1:288342281567:web:60b86247475266d8"
}

class FirebaseSvc {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    } else {
      console.log("firebase apps already running...")
    }
  }

  login = async(user, success_callback, failed_callback) => {
    console.log("logging in");
    await firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(success_callback, failed_callback);

    let userf = firebase.auth().currentUser;
    
    await AsyncStorage.setItem('myUid', userf.uid);
    await AsyncStorage.setItem('myName', userf.displayName);


    console.warn(userf.photoURL);
    await AsyncStorage.setItem('myAvatar', userf.photoURL);

    // await firebase.database().ref('users/' + userf.uid).on("value", (snapshot) => {
    //   AsyncStorage.setItem('user', snapshot.val());      
    // }, function (errorObject) {
    //   console.log("The read failed: " + errorObject.code);
    // });

  }

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        this.login(user);
      } catch ({ message }) {
        console.log("Failed:" + message);
      }
    } else {
      console.log("Reusing auth...");
    }
  };

  createAccount = async (user) => {

    const { email, password, name, gender, avatar } = user

    firebase.auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(function() {
        console.log("created user successfully. User email:" + user.email + " name:" + user.name);

        if(!user.avatar) {
          user.avatar = 'https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_960_720.png'
        }

        console.warn(user.avatar);

        var userf = firebase.auth().currentUser;
        
        userf.updateProfile({ displayName: user.name, photoURL: user.avatar })
        .then(async () => {

          if(!user.avatar) {
            user.avatar = 'https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_960_720.png'
          }

          let userRef = firebase.database().ref('users/' + userf.uid)
          userRef.set({
            name: user.name,
            email: user.email,
            gender: user.gender,
            avatar: user.avatar
          });

        }, function(error) {
          console.warn("Error update displayName.");
        });
      }, function(error) {
        console.error("got error:" + typeof(error) + " string:" + error.message);
        alert("Create account failed. Error: "+error.message);
      });
  }

  uploadImage = async uri => {
    console.log('got image to upload. uri:' + uri);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = firebase
        .storage()
        .ref('avatar')
        .child(uuid.v4());
      const task = ref.put(blob);
    
      return new Promise((resolve, reject) => {
        task.on(
          'state_changed',
          () => {
              /* noop but you can track the progress here */
          },
          reject /* this is where you would put an error callback! */,
          () => resolve(task.snapshot.downloadURL)
        );
      });
    } catch (err) {
      console.log('uploadImage try/catch error: ' + err.message); //Cannot load an empty url
    }
  }

  updateAvatar = (url) => {
    //await this.setState({ avatar: url });
    var userf = firebase.auth().currentUser;
    if (userf != null) {
      userf.updateProfile({ avatar: url})
      .then(function() {
        console.log("Updated avatar successfully. url:" + url);
        alert("Avatar image is saved successfully.");
      }, function(error) {
        console.warn("Error update avatar.");
        alert("Error update avatar. Error:" + error.message);
      });
    } else {
      console.log("can't update avatar, user is not login.");
      alert("Unable to update avatar. You must login first.");
    }
  }
     
  onLogout = user => {
    firebase.auth().signOut().then(function() {
      console.log("Sign-out successful.");
    }).catch(function(error) {
      console.log("An error happened when signing out");
    });
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('Messages');
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    const timestamp = new Date(numberStamp);

    const message = {
      id,
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  refOn = callback => {
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  
  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp,
      };
      this.ref.push(message);
    }
  };

  refOff() {
    this.ref.off();
  }
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;

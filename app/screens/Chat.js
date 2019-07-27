import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import firebase from 'firebase';
import { AsyncStorage, View, TouchableWithoutFeedback, Text } from 'react-native';

import * as theme from './theme';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.navigation.getParam("name"),
            uid: props.navigation.getParam("uid"),
            myUid: '',
            myName: '',
            myAvatar: '',
            text: '',
            messagesList: []
        }
    }
    
    componentDidMount = async () => {
        this.setState({
            myUid: await AsyncStorage.getItem('myUid'),
            myName: await AsyncStorage.getItem('myName'),
            myAvatar: await AsyncStorage.getItem('myAvatar')
        })

        firebase.database().ref('messages').child(this.state.myUid).child(this.state.uid).on('child_added', (val)=>{
            this.setState((prevState)=>{
                return {
                    messagesList: GiftedChat.append(prevState.messagesList, val.val())
                }
            })
        })
    }

    

    sendMessage = async () => {
        if(this.state.text.length > 0){
            let msgId = firebase.database().ref('messages').child(this.state.myUid).child(this.state.uid).push().key;
            let updates = {};
            let message = {
                _id: msgId,
                text: this.state.text,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                user: {
                    _id: this.state.myUid,
                    name: this.state.myName,
                    avatar: this.state.myAvatar
                },
            }
            updates["messages/" + this.state.myUid + '/' + this.state.uid + '/' + msgId] = message;
            updates["messages/" + this.state.uid + '/' + this.state.myUid + '/' + msgId] = message;
            firebase.database().ref().update(updates);
            this.setState({text: ''})
            
        }
        else{
            alert('Please type a message first')
        }

    }

    renderHeader() {
      return (
        <View style={styles.header}>
          <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
            <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()} style={{ width: 50, alignItems: 'center' }}>
              <Ionicons name="home" size={theme.SIZES.icon * 1.5} />
            </TouchableWithoutFeedback>
            <View style={{ marginLeft: 48 }}>
                <Text style={styles.headerLocation}>{this.state.name}</Text>
            </View>
          </View>
        </View>
      )
    }

    render() {

        return (
        	<View style={{ flex: 1 }}>
                {this.renderHeader()}

	            <GiftedChat
	                text={this.state.text}
	                messages={this.state.messagesList}
	                user={{
	                    _id : this.state.myUid
	                }}
	                onInputTextChanged={(text) => {this.setState({text: text})}}
	                onSend={this.sendMessage}
	            />
	        </View>
        );
    }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: theme.SIZES.base * 2,
    paddingTop: theme.SIZES.base * 2.5 + 9,
    paddingBottom: theme.SIZES.base * 1.5,
    borderBottomWidth: 2.5,
    borderBottomColor: theme.COLORS.main,
  },
  headerTitle: {
    color: theme.COLORS.gray,
  },
  headerLocation: {
    fontSize: theme.SIZES.font,
    fontWeight: '500',
    paddingVertical: theme.SIZES.base / 3,
  },
}
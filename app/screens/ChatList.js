import React, { Component } from 'react';
import { AsyncStorage, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, FlatList, ActivityIndicator, Modal } from 'react-native';
import firebase from 'firebase'
import {createStackNavigator} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as theme from './theme';

export default class App extends Component{
    constructor() {
        super();
        this.state = {
            modalVisible: false,
            email : '',
            password : '', 
            users: [],
            myUid: ''
        }
    }

    myProfile = () => {
		this.props.navigation.navigate('myProfile')
	};
    // onSubmit = () => {
    //     const a = firebaseSvc.readUserData
    //     console.warn(a)
    //     //this.props.navigation.navigate('signIn')
    // }

    componentDidMount = async () => {
        this.setState({myUid: await AsyncStorage.getItem('myUid')})
        await firebase.database().ref('users/').on('child_added', (value) =>{
            let person = value.val()
            person.uid = value.key
            if(person.uid !== this.state.myUid){
                this.setState((prevState) => {
                    return {
                        users: [...prevState.users, person]
                    }
                })
            }
        });
    }

    renderItem = ({item}) => (
        <TouchableOpacity style={styles.user}
		onPress={() => this.props.navigation.navigate('Chat', item)}
		>
	      	<Text style={{marginLeft: 5, marginTop: 12}}>{item.name}</Text>
	    </TouchableOpacity>
    )

    renderHeader() {
      return (
        <View style={styles.header}>
          <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
            <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()} style={{ width: 50, alignItems: 'center' }}>
              <Ionicons name="home" size={theme.SIZES.icon * 1.5} />
            </TouchableWithoutFeedback>
            <View style={{ marginLeft: 48 }}>
                <Text style={styles.headerLocation}>Chat List</Text>
            </View>
          </View>
        </View>
      )
    }

    render() {
        return (
            <View style={styles.container}>
                { this.renderHeader() }
                
                <View style={{marginTop:50, marginLeft: 5, marginRight: 5}}>
                    <FlatList
                        data={this.state.users}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item.uid}
                        refreshing={true}
                        onRefresh={this.componentWillMount}
                    />
                </View>
            
            </View>
        )
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

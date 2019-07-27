import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './app/routes/navigation';

console.ignoredYellowBox = [
    'Setting a timer'
]

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
    // TODO: You: Do firebase things
    // const { user } = await firebase.auth().signInAnonymously();
    // console.warn('User -> ', user.toJSON());

    // await firebase.analytics().logEvent('foo', { bar: '123'});
  }

  render() {
    return (
      <React.Fragment>
        <StatusBar translucent={true} backgroundColor='rgba(0,0,0,0.3)' barStyle="light-content" />
        <AppNavigator />
      </React.Fragment>
    );
  }
}
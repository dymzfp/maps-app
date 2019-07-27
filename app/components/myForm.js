import React from 'react';
import { TextInput } from 'react-native';

export default class myForm extends React.PureComponent {
	render() {
		return(
              <TextInput
    			placeholder={this.props.placeholder}
    			secureTextEntry={this.props.secureTextEntry}
                style={{
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1,
                  paddingLeft: 5,
                }}
              />
		)
	}
}
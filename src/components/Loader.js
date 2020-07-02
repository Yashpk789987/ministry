import React, {Component} from 'react';
import {View, Modal, StatusBar} from 'react-native';
import LottieView from 'lottie-react-native';

export class Loader extends Component {
  UNSAFE_componentWillReceiveProps() {
    if (this.props.loading === false) {
      StatusBar.setBackgroundColor('white');
      StatusBar.setBarStyle('dark-content');
    }
  }
  render() {
    return (
      <Modal
        statusBarTranslucent
        visible={this.props.loading}
        backdropColor="white"
        transparent={true}>
        <StatusBar backgroundColor="white" />
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.5)',
            height: '100%',
            width: '100%',
            justifyContent: 'flex-start',
            alignContent: 'center',
            zIndex: 5,
          }}>
          <LottieView
            source={require('../../assets/lottie/loader.json')}
            autoPlay={true}
            loop={true}
          />
        </View>
      </Modal>
    );
  }
}

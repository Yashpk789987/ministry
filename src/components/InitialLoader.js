import React from 'react';

import {
  ImageBackground,
  Dimensions,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';

import LottieView from 'lottie-react-native';

const {height, width} = Dimensions.get('screen');

export class InitialLoader extends React.Component {
  render() {
    return (
      <>
        <StatusBar translucent backgroundColor="white" />
        <ImageBackground
          style={styles.bg}
          source={require('../../assets/splash/splashios.png')}>
          <LottieView
            style={styles.view}
            source={require('../../assets/lottie/loader1.json')}
            autoPlay={true}
            loop={true}
          />
        </ImageBackground>
      </>
    );
  }
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    ...Platform.select({android: {marginTop: '10%'}}),
  },
  view: {
    flex: 1,
    position: 'absolute',
    bottom: 5,
    height: height * 0.1,
    width: width * 1,
  },
});

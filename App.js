import React, {Component} from 'react';

import {
  AsyncStorage,
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';

import {
  Dialog,
  Colors,
  Constants,
  RadioGroup,
  RadioButton,
} from 'react-native-ui-lib';

import {InitialLoader} from './src/components/InitialLoader';
import {LanguageContext} from './src/contexts/language';
import {ScreenSetup} from './src/screens/ScreenSetup';
import {i18n} from './src/translations';

const {height} = Dimensions.get('screen');

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: 'en',
      isReady: false,
      isLanguageAsked: true,
    };
  }

  loadLanguageState = async () => {
    try {
      let result = await AsyncStorage.getItem('languageState');
      if (result === null) {
        this.setState({isLanguageAsked: false});
        return false;
      } else {
        result = JSON.parse(result);
        this.setState({
          language: result.language,
          isLanguageAsked: true,
          isReady: true,
        });
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  setLanguageState = async language => {
    try {
      await AsyncStorage.setItem(
        'languageState',
        JSON.stringify({language: language}),
      );
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount = async () => {
    SplashScreen.hide();
    let res = await this.loadLanguageState();
    if (res) {
      this.setState({isReady: true});
    }
  };

  changeLanguage = async language => {
    await this.setLanguageState(language);
    this.setState({language: language});
  };

  moveNext = async () => {
    this.setLanguageState(this.state.language);
    this.setState({isLanguageAsked: true, isReady: true});
  };

  render() {
    const {language, isReady, isLanguageAsked} = this.state;
    i18n.locale = language;
    if (!isReady) {
      return (
        <>
          <InitialLoader />
          <Dialog
            onDialogDismissed={() => this.moveNext()}
            height={height * 0.4}
            migrate
            useSafeArea
            visible={!isLanguageAsked}
            containerStyle={{
              backgroundColor: Colors.white,
              marginBottom: Constants.isIphoneX ? 0 : 20,
              borderRadius: 12,
              flex: 1,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
            onDismiss={() => this.setState({isLanguageAsked: true})}>
            <View>
              <Text
                style={{
                  color: '#0663C2',
                  fontWeight: 'bold',
                  fontSize: 22,
                  textAlign: 'center',
                }}>
                Select Language
              </Text>
              <Text
                style={{
                  color: '#0663C2',
                  fontWeight: 'bold',
                  fontSize: 22,
                  textAlign: 'center',
                }}>
                اختار اللغة
              </Text>
            </View>
            <RadioGroup
              initialValue={language || null}
              onValueChange={value => this.changeLanguage(value)}>
              <View
                style={{
                  width: '60%',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <RadioButton
                  color="#0663C2"
                  value={'en'}
                  label={'English'}
                  labelStyle={{color: '#0663C2'}}
                />
                <RadioButton
                  color="#0663C2"
                  value={'ar'}
                  label={'عربى'}
                  labelStyle={{color: '#0663C2'}}
                />
              </View>
            </RadioGroup>
            <TouchableOpacity
              onPress={() => this.moveNext()}
              style={{
                backgroundColor: '#b9cde5',
                borderColor: '#0663C2',
                borderWidth: 2,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: '2.5%',
                paddingHorizontal: '2%',
                width: '80%',
              }}>
              <Text
                style={{
                  color: '#0663C2',
                  fontWeight: 'bold',
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                {'OK '}
                {' حسنا'}
              </Text>
            </TouchableOpacity>
          </Dialog>
        </>
      );
    }
    return (
      <LanguageContext.Provider
        value={{language: language, changeLanguage: this.changeLanguage}}>
        <StatusBar translucent backgroundColor="white" />
        <ScreenSetup />
      </LanguageContext.Provider>
    );
  }
}

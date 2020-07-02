import React, {Component} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import {LanguageContext} from '../contexts/language';

export class Header extends Component {
  render() {
    const {language, changeLanguage} = this.context;
    return (
      <View
        style={{
          height: '20%',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => {
            if (this.props.navigation === undefined) {
            } else {
              this.props.navigation.goBack();
            }
          }}
          style={{
            marginTop: '15%',
            width: '30%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            paddingLeft: '4%',
          }}>
          {this.props.navigation === undefined ? null : (
            <Icon name="ios-arrow-dropleft-circle" size={40} color="#0663C2" />
          )}
        </TouchableOpacity>
        <View style={{width: '40%'}}>
          <Image
            style={{
              marginTop: '15%',
              height: '80%',
              width: '100%',
              resizeMode: 'contain',
            }}
            source={require('../../assets/logo.jpg')}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            if (language === 'en') {
              changeLanguage('ar');
            } else {
              changeLanguage('en');
            }
          }}
          style={{
            marginTop: '15%',
            width: '30%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingRight: '5%',
          }}>
          <Image
            style={{
              height: '40%',
              width: '40%',
              resizeMode: 'contain',
            }}
            source={require('../../assets/icons/language.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

Header.contextType = LanguageContext;

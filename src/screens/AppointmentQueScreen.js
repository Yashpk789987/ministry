import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import ViewShot, {captureRef} from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import {Header} from '../components/Header';
import {TranslatedText} from '../components/TranslatedText';
import {Loader} from '../components/Loader';

import {checkFilePermission, askFilePermission} from '../utils/permissions';
import {LanguageContext} from '../contexts/language';
import {__waitInfo} from '../utils/apis';
import {i18n} from '../translations';
import {Toast} from 'react-native-ui-lib';
import {format} from '../utils/formatters';

export class AppointmentQueScreen extends Component {
  state = {
    expectedTime: '',
    ticket: {},
    waitInfo: {},
    loading: false,
    toast: false,
  };

  captureView = () => {
    captureRef(this.refs.viewShot)
      .then(async uri => {
        let result = await checkFilePermission();
        if (!result) {
          let response = await askFilePermission();
          if (response) {
            await CameraRoll.save(uri);
            this.setState({toast: true});
            setTimeout(() => this.setState({toast: false}), 2000);
          } else {
            alert('You Need To Grant Permission To Save Image');
          }
        } else {
          await CameraRoll.save(uri);
          this.setState({toast: true});
          setTimeout(() => this.setState({toast: false}), 2000);
        }
      })
      .catch(err => console.log(err));
  };

  componentDidMount = async () => {
    const {
      route: {
        params: {ticket, delay},
      },
    } = this.props;
    let d1 = new Date();
    d1.setSeconds(d1.getMinutes() + delay);
    await this.setState({
      appointmentTime: `${format(d1.getHours())}:${format(d1.getMinutes())}`,
      ticket: ticket,
      loading: true,
    });
    let waitInfo = await __waitInfo(ticket.branchId);
    if (waitInfo.ok) {
      this.setState({waitInfo: waitInfo.data, loading: false});
    } else {
      this.setState({waitInfo: waitInfo.data, loading: false});
    }
  };

  render() {
    const {ticket, waitInfo, loading, appointmentTime, toast} = this.state;
    const {language} = this.context;
    const {
      route: {
        params: {bookedTime},
      },
      navigation,
    } = this.props;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <Toast
          visible={toast}
          position="bottom"
          style={{
            backgroundColor: '#b9cde5',
            borderColor: '#0663C2',
            borderWidth: 3,
            marginBottom: '5%',
            padding: '5%',
            marginHorizontal: '2%',
            borderRadius: 5,
          }}>
          <TranslatedText
            style={{
              textAlign: 'center',
              color: '#0663C2',
              fontWeight: 'bold',
              fontSize: 16,
            }}>
            Successfully Saved In Gallery
          </TranslatedText>
        </Toast>
        <Header navigation={navigation} />
        <Loader loading={loading} />
        <View
          style={{
            width: '95%',
            height: Platform.OS === 'android' ? '5%' : '10%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.text}>
            {i18n.t('Appointment selected by the customer:') + appointmentTime}
          </Text>
        </View>
        <View
          style={{
            width: '95%',
            height: '10%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.text}>
            {waitInfo.customersWaitingInDefaultQueue === undefined
              ? 'Number of Customer on the Que: ##'
              : i18n.t('Number of Customer on the Que:') +
                waitInfo.customersWaitingInDefaultQueue}
          </Text>
        </View>
        <ViewShot
          ref="viewShot"
          options={{format: 'png', quality: 0.8}}
          style={{
            width: '95%',
            height: '30%',
            justifyContent: 'space-around',
            alignItems: 'center',
            borderWidth: 5,
            borderColor: '#0663C2',
            backgroundColor: 'white',
            paddingVertical: '1%',
          }}>
          <View
            style={{flexDirection: language === 'en' ? 'row' : 'row-reverse'}}>
            <TranslatedText style={styles.text}>Civil ID</TranslatedText>
            <Text style={styles.text}>{' : '}</Text>
            <Text style={styles.text}>{ticket.civilId}</Text>
          </View>
          <View
            style={{flexDirection: language === 'en' ? 'row' : 'row-reverse'}}>
            <TranslatedText style={styles.text}>Branch</TranslatedText>
            <Text style={styles.text}>{' : '}</Text>
            <Text style={styles.text}>{ticket.branchName}</Text>
          </View>
          <Text style={[styles.text, {fontSize: 60}]}>
            {ticket.ticketNumber === undefined
              ? '#Que'
              : `#${ticket.ticketNumber}`}
          </Text>
          <View
            style={{flexDirection: language === 'en' ? 'row' : 'row-reverse'}}>
            <TranslatedText style={styles.text}>Arrival Time</TranslatedText>
            <Text style={styles.text}>{' : '}</Text>
            <Text style={styles.text}>{appointmentTime}</Text>
          </View>
          <View
            style={{flexDirection: language === 'en' ? 'row' : 'row-reverse'}}>
            <TranslatedText style={styles.text}>Booked Time</TranslatedText>
            <Text style={styles.text}>{' : '}</Text>
            <Text style={styles.text}>{`${format(
              bookedTime.getHours(),
            )}:${format(bookedTime.getMinutes())}`}</Text>
          </View>
        </ViewShot>
        <View style={{height: '5%', width: '95%'}}>
          <TranslatedText
            style={[styles.text, {color: '#E46D0C', fontSize: 18}]}>
            Kindly Save your Que number on your Gallery, press the below button
          </TranslatedText>
        </View>
        <View
          style={{
            flex: 1,
            width: '95%',
            height: '4%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => this.captureView()}
            style={{
              flex: 0.4,
              width: '100%',
              backgroundColor: '#b9cde5',
              borderColor: '#0663C2',
              borderWidth: 2,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TranslatedText
              style={{
                color: '#0663C2',
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'center',
              }}>
              Click To Save In Gallery
            </TranslatedText>
          </TouchableOpacity>
        </View>
        <View style={styles.messageBox}>
          <TranslatedText
            style={{color: '#91312F', fontWeight: 'bold', fontSize: 22}}>
            Note1
          </TranslatedText>
        </View>
      </View>
    );
  }
}

AppointmentQueScreen.contextType = LanguageContext;

const styles = StyleSheet.create({
  text: {
    color: '#0663C2',
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
  },
  messageBox: {
    width: '95%',
    height: '15%',
    backgroundColor: '#E6B9B8',
    borderWidth: 4,
    borderColor: '#91312F',
    padding: '2%',
    marginBottom: '2%',
  },
});

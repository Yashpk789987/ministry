import React, {Component} from 'react';

import {View, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';

import {
  Picker,
  KeyboardAwareScrollView,
  TextField,
  Colors,
} from 'react-native-ui-lib';

import _ from 'lodash';

import {TranslatedText} from '../components/TranslatedText';
import {i18n} from '../translations';
import {LanguageContext} from '../contexts/language';
import {Header} from '../components/Header';
import {MessageBox} from '../components/MessageBox';

import {states} from '../../assets/data/states';
import {cities} from '../../assets/data/cities';
import {Loader} from '../components/Loader';

import {
  _fetchOffices,
  __fetchOffices,
  _createTicketWithoutDate,
  _createTicketWithTime,
  _createTicketWithoutTime,
} from '../utils/apis';

import {SelectAppointmentTimeDialog} from '../components/SelectAppointmentTimeDialog';
import {_Alert} from '../components/Alert';

const {height} = Dimensions.get('screen');

export class AppointmentFormScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: states,
      cities: cities,
      offices: [],
      state: {},
      city: {},
      office: {},
      civilId: '',
      modal: false,
      delay: 0,
      loading: false,
      disabled: false,
      branchOpen: true,
      validation: '',
    };
  }

  createAppointment = async () => {
    this.createTicket(true);
  };

  createAppointmentByTime = () => {
    this.setState({modal: false});
    this.createTicket(false);
  };

  showModalAndCreateAppointment = () => {
    if (this.validateForm()) {
      this.setState({modal: true});
    }
  };

  hideDialog = () => {
    this.setState({modal: false});
  };

  setDelay = delay => {
    this.setState({
      delay: delay,
    });
  };

  filterCities = async stateId => {
    this.setState({
      cities: cities.filter(city => city.stateId === stateId),
    });
  };

  fetchOfficies = async city => {
    this.setState({loading: true});
    let result = await __fetchOffices(city);
    if (result) {
      this.setState({loading: false, offices: result});
    } else {
      this.setState({loading: false});
      //_Alert(i18n.t('Techical Problem'), i18n.t('technical'));
    }
  };

  createTicket = async withoutDate => {
    if (this.validateForm()) {
      this.setState({loading: true});
      const {
        office: {id, name},
        civilId,
        delay,
      } = this.state;
      if (withoutDate) {
        let ticket = await _createTicketWithoutTime({
          branchId: id,
          civilId: civilId,
        });
        if (ticket.ok) {
          this.setState({loading: false});
          const {navigation} = this.props;
          navigation.navigate('DirectQueScreen', {
            ticket: {...ticket.data, civilId: civilId, branchName: name},
            bookedTime: new Date(),
          });
        } else {
          this.setState({loading: false});
          if (ticket.error) {
            this.setState({validation: ticket.message + ticket.error});
          } else {
            this.setState({validation: ticket.message});
          }

          setTimeout(() => this.setState({validation: ''}), 4000);
        }
      } else {
        let ticket = await _createTicketWithTime({
          branchId: id,
          civilId: civilId,
          delay: delay,
        });
        if (ticket.ok) {
          this.setState({loading: false, modal: false});
          const {navigation} = this.props;
          navigation.navigate('AppointmentQueScreen', {
            ticket: {...ticket.data, civilId: civilId, branchName: name},
            bookedTime: new Date(),
            delay: delay,
          });
        } else {
          this.setState({loading: false});
          if (ticket.error) {
            this.setState({validation: ticket.message + ticket.error});
          } else {
            this.setState({validation: ticket.message});
          }

          setTimeout(() => this.setState({validation: ''}), 4000);
        }
      }
    }
  };

  validateForm = () => {
    const {office, civilId} = this.state;
    if (civilId === '') {
      this.setState({validation: 'Please Fill CivilId'});
      setTimeout(() => this.setState({validation: ''}), 2000);
      return false;
    } else if (civilId.length !== 12 || civilId[0] !== '2') {
      this.setState({
        validation: 'Wrong Civil ID',
      });
      setTimeout(() => this.setState({validation: ''}), 2000);
      return false;
    } else if (_.isEmpty(office)) {
      this.setState({validation: 'Please Select Office'});
      setTimeout(() => this.setState({validation: ''}), 2000);
      return false;
    } else {
      return true;
    }
  };

  render() {
    const {
      states,
      state,
      city,
      office,
      civilId,
      modal,
      cities,
      loading,
      offices,
      disabled,
      branchOpen,
      validation,
    } = this.state;

    const {language} = this.context;

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <Header />
        {validation !== '' ? (
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              top: '20%',
              width: '100%',
            }}>
            <MessageBox text={validation} />
          </View>
        ) : null}
        <Loader loading={loading} />
        <SelectAppointmentTimeDialog
          selectedOffice={office}
          modal={modal}
          createTicket={this.createAppointmentByTime}
          hideDialog={this.hideDialog}
          setDelay={this.setDelay}
        />
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="always"
          style={{
            borderColor: '#0663C2',
            borderWidth: 3,
            width: '95%',
            paddingHorizontal: '2%',
          }}>
          <View style={{height: '16%', width: '100%'}}>
            <View style={{paddingVertical: '2%'}}>
              <TranslatedText
                style={{color: '#0663C2', fontWeight: 'bold', fontSize: 20}}>
                Civil ID
              </TranslatedText>
            </View>
            <TextField
              onChangeText={text => {
                this.setState({civilId: text});
              }}
              value={civilId}
              style={styles.picker}
              hideUnderline={true}
            />
          </View>
          <View style={{height: '16%', width: '100%'}}>
            <View style={{paddingVertical: '2%'}}>
              <TranslatedText
                style={{color: '#0663C2', fontWeight: 'bold', fontSize: 20}}>
                State
              </TranslatedText>
            </View>
            <View style={styles.picker}>
              <Picker
                showSearch={true}
                listProps={{keyboardShouldPersistTaps: 'always'}}
                hideUnderline
                placeholder={i18n.t('Select State')}
                value={{
                  en: state.en,
                  ar: state.ar,
                  label: language === 'en' ? state.en : state.ar,
                  value: state.id,
                }}
                onChange={({value, en, ar}) => {
                  this.filterCities(value);
                  this.setState({state: {id: value, en: en, ar: ar}});
                }}
                topBarProps={{title: i18n.t('Select State')}}
                rightIconSource={require('../../assets/icons/chevron-down.png')}>
                {_.map(states, state => (
                  <Picker.Item
                    key={state.id}
                    value={{
                      en: state.en,
                      ar: state.ar,
                      label: language === 'en' ? state.en : state.ar,
                      value: state.id,
                    }}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View style={{height: '16%', width: '100%'}}>
            <View style={{paddingVertical: '2%'}}>
              <TranslatedText
                style={{color: '#0663C2', fontWeight: 'bold', fontSize: 20}}>
                City
              </TranslatedText>
            </View>
            <View style={styles.picker}>
              <Picker
                showSearch={true}
                listProps={{keyboardShouldPersistTaps: 'always'}}
                hideUnderline
                placeholder={i18n.t('Select City')}
                value={{
                  label: language === 'en' ? city.en : city.ar,
                  value: city.id,
                  en: city.en,
                  ar: city.ar,
                }}
                onChange={({value, ar, en, city}) => {
                  this.setState({city: {id: value, ar: ar, en: en}});
                  this.fetchOfficies(city);
                }}
                topBarProps={{title: i18n.t('Select City')}}
                rightIconSource={require('../../assets/icons/chevron-down.png')}>
                {_.map(cities, city => (
                  <Picker.Item
                    key={city.id}
                    value={{
                      label: language === 'en' ? city.en : city.ar,
                      value: city.id,
                      city: city,
                      ar: city.ar,
                      en: city.en,
                    }}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View style={{height: '16%', width: '100%'}}>
            <View style={{paddingVertical: '2%', paddingTop: '3%'}}>
              <TranslatedText
                style={{color: '#0663C2', fontWeight: 'bold', fontSize: 20}}>
                Customer Service Office
              </TranslatedText>
            </View>
            <View style={styles.picker}>
              <Picker
                showSearch={true}
                listProps={{keyboardShouldPersistTaps: 'always'}}
                hideUnderline
                placeholder={i18n.t('Select Customer Service Office')}
                value={{label: office.name, value: office.id}}
                onChange={({office}) => {
                  this.setState({
                    office: office,
                    branchOpen: office.branchOpen,
                    disabled: !office.branchOpen, // for now only after development it will be disabled: !office.branchOpen
                  });
                }}
                topBarProps={{title: i18n.t('Select Customer Service Office')}}
                rightIconSource={require('../../assets/icons/chevron-down.png')}>
                {_.map(offices, office => (
                  <Picker.Item
                    key={office.id}
                    value={{
                      label: office.name,
                      value: office.id,
                      office: office,
                    }}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View
            style={{
              marginTop: '4%',
              height: '2.5%',
              justifyContent: 'center',
            }}>
            {!branchOpen ? (
              <TranslatedText
                style={{fontSize: 14, color: '#E46D0C', fontWeight: 'bold'}}>
                To be appeared that this store is closed due to its outside
                working hours
              </TranslatedText>
            ) : null}
          </View>

          <View
            style={{
              height: !branchOpen ? '11%' : '15%',
              justifyContent: 'center',
            }}>
            <TranslatedText
              style={{
                color: '#0663C2',
                fontWeight: 'bold',
                fontSize: 22,
                textAlign: 'center',
              }}>
              To get que number, please choose from the following
            </TranslatedText>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              disabled={disabled}
              style={styles.button}
              onPress={() => {
                this.showModalAndCreateAppointment();
              }}>
              <TranslatedText
                style={{
                  color: '#0663C2',
                  fontWeight: 'bold',
                  fontSize: 22,
                  textAlign: 'center',
                }}>
                Que Appointment
              </TranslatedText>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={disabled}
              style={styles.button}
              onPress={() => this.createAppointment()}>
              <TranslatedText
                style={{
                  color: '#0663C2',
                  fontWeight: 'bold',
                  fontSize: 22,
                  textAlign: 'center',
                }}>
                Direct Que Number
              </TranslatedText>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

AppointmentFormScreen.contextType = LanguageContext;

const styles = StyleSheet.create({
  picker: {
    width: '100%',
    height: 45,
    color: Colors.red20,
    paddingVertical: 5,
    paddingHorizontal: '2%',
    borderWidth: 2,
    borderColor: '#0663C2',
    color: '#0663C2',
  },
  button: {
    width: '45%',
    height: height * 0.09,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b9cde5',
    borderColor: '#0663C2',
    borderWidth: 2,
    borderRadius: 10,
  },
});

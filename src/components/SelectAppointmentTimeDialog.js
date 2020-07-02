import React, { Component } from "react";
import { TouchableOpacity, Dimensions, View } from "react-native";
import _ from "lodash";

import {
  Dialog,
  Colors,
  Constants,
  Checkbox,
  Assets,
} from "react-native-ui-lib";
import { TranslatedText } from "./TranslatedText";

const { height } = Dimensions.get("screen");

export class SelectAppointmentTimeDialog extends Component {
  state = {
    message: "",
    selectedTime: -1,
  };

  render() {
    const {
      hideDialog,
      createTicket,
      setDelay,
      modal,
      selectedOffice,
    } = this.props;

    const { message, selectedTime } = this.state;
    let diff = 0;
    if (!_.isEmpty(selectedOffice)) {
      var time_start = new Date();
      var time_end = new Date();
      var value_end = selectedOffice.closeTime.split(":");
      //var value_end = "17:53".split(":");
      time_end.setHours(value_end[0], value_end[1], 0, 0);
      diff = (time_end - time_start) / 60000;
    }

    return (
      <Dialog
        height={height * 0.6}
        migrate
        useSafeArea
        visible={modal}
        containerStyle={{
          backgroundColor: Colors.white,
          marginBottom: Constants.isIphoneX ? 0 : 20,
          borderRadius: 12,
          flex: 1,
          justifyContent: "space-around",
          alignItems: "center",
        }}
        onDismiss={hideDialog}
      >
        <TranslatedText
          style={{
            color: "#0663C2",
            fontWeight: "bold",
            fontSize: 22,
            textAlign: "center",
          }}
        >
          Schedule Your Appointment
        </TranslatedText>
        <View
          style={{
            flex: 0.7,
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: "2%",
              height: 40,
              width: "80%",
            }}
          >
            <TranslatedText
              style={{
                color: "#0663C2",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              After 15 minutes
            </TranslatedText>
            <Checkbox
              disabled={diff < 0 ? true : diff >= 15 ? false : true}
              value={selectedTime === 0}
              onValueChange={(value) => {
                if (value) {
                  this.setState({ selectedTime: 0, message: "" });
                  setDelay(900);
                } else {
                  this.setState({ selectedTime: -1, message: "" });
                  setDelay(0);
                }
              }}
              borderRadius={2}
              size={30}
              color={"#0663C2"}
              iconColor={"white"}
              selectedIcon={Assets.icons.check}
            />
          </View>
          <View
            style={{
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: "2%",
              height: 40,
              width: "80%",
            }}
          >
            <TranslatedText
              style={{
                color: "#0663C2",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              After 30 minutes
            </TranslatedText>
            <Checkbox
              disabled={diff < 0 ? true : diff >= 30 ? false : true}
              value={selectedTime === 1}
              onValueChange={(value) => {
                if (value) {
                  this.setState({ selectedTime: 1, message: "" });
                  setDelay(1800);
                } else {
                  this.setState({ selectedTime: -1, message: "" });
                  setDelay(0);
                }
              }}
              borderRadius={2}
              size={30}
              color={"#0663C2"}
              iconColor={"white"}
              selectedIcon={Assets.icons.check}
            />
          </View>
          <View
            style={{
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: "2%",
              height: 40,
              width: "80%",
            }}
          >
            <TranslatedText
              style={{
                color: "#0663C2",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              After 45 minutes
            </TranslatedText>
            <Checkbox
              disabled={diff < 0 ? true : diff >= 45 ? false : true}
              value={selectedTime === 2}
              onValueChange={(value) => {
                if (value) {
                  this.setState({ selectedTime: 2, message: "" });
                  setDelay(2700);
                } else {
                  this.setState({ selectedTime: -1, message: "" });
                  setDelay(0);
                }
              }}
              borderRadius={2}
              size={30}
              color={"#0663C2"}
              iconColor={"white"}
              selectedIcon={Assets.icons.check}
            />
          </View>
          <View
            style={{
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: "2%",
              height: 40,
              width: "80%",
            }}
          >
            <TranslatedText
              style={{
                color: "#0663C2",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              After 1 hour
            </TranslatedText>
            <Checkbox
              disabled={diff < 0 ? true : diff >= 60 ? false : true}
              value={selectedTime === 3}
              onValueChange={(value) => {
                if (value) {
                  this.setState({ selectedTime: 3, message: "" });
                  setDelay(3600);
                } else {
                  this.setState({ selectedTime: -1, message: "" });
                  setDelay(0);
                }
              }}
              borderRadius={2}
              size={30}
              color={"#0663C2"}
              iconColor={"white"}
              selectedIcon={Assets.icons.check}
            />
          </View>
        </View>
        {message === "" ? null : (
          <View
            style={{
              width: "100%",
            }}
          >
            <TranslatedText
              style={{
                color: "#91312F",
                fontWeight: "bold",
                fontSize: 20,
                textAlign: "center",
              }}
            >
              {message}
            </TranslatedText>
          </View>
        )}
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (selectedTime === -1) {
                this.setState({ message: "Please Select Time" });
              } else {
                this.setState({ message: "" });
                createTicket();
              }
            }}
            style={{
              backgroundColor: "#b9cde5",
              borderColor: "#0663C2",
              borderWidth: 2,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: "2%",
              height: 40,
              width: "80%",
            }}
          >
            <TranslatedText
              style={{
                color: "#0663C2",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Create Ticket
            </TranslatedText>
          </TouchableOpacity>
        </View>
      </Dialog>
    );
  }
}

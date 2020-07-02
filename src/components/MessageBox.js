import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TranslatedText } from "./TranslatedText";

export class MessageBox extends Component {
  render() {
    return (
      <View style={styles.messageBox}>
        <TranslatedText
          style={{
            color: "#91312F",
            fontWeight: "bold",
            fontSize: 20,
            textAlign: "center",
          }}
        >
          {this.props.text}
        </TranslatedText>
        <Text
          style={{
            color: "#91312F",
            fontWeight: "bold",
            fontSize: 20,
            textAlign: "center",
          }}
        >
          {this.props.text}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  messageBox: {
    backgroundColor: "#E6B9B8",
    borderWidth: 4,
    borderColor: "#91312F",
    padding: "5%",
    width: "100%",
  },
});

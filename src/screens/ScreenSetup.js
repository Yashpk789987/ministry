import "react-native-gesture-handler";
import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { AppointmentFormScreen } from "./AppointmentFormScreen";
import { DirectQueScreen } from "./DirectQueScreen";
import { AppointmentQueScreen } from "./AppointmentQueScreen";
import { Header } from "../components/Header";

const Stack = createStackNavigator();

export class ScreenSetup extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ header: () => null }}
          initialRouteName="AppointmentFormScreen"
        >
          <Stack.Screen
            name="AppointmentFormScreen"
            component={AppointmentFormScreen}
          />
          <Stack.Screen name="DirectQueScreen" component={DirectQueScreen} />
          <Stack.Screen
            name="AppointmentQueScreen"
            component={AppointmentQueScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

import React, { Component } from "react";
import { Text } from "react-native";

import { i18n } from "../translations";
import { LanguageContext } from "../contexts/language";

export class TranslatedText extends Component {
  render() {
    const { language } = this.context;
    i18n.locale = language;
    const { children } = this.props;
    return <Text {...this.props}>{i18n.t(children)}</Text>;
  }
}

TranslatedText.contextType = LanguageContext;

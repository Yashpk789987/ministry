import React from "react";

export const LanguageContext = React.createContext({
  language: "en",
  changeLanguage: (language) => null,
});

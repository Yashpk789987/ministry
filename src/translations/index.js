import i18n from "i18n-js";

import { en } from "./en";
import { ar } from "./ar";

i18n.fallbacks = true;

i18n.translations = {
  en,
  ar,
};

i18n.locale = "en";

export { i18n };

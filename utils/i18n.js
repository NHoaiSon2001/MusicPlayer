import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import localesResourse from "../assets/languages";

i18n
	.use(reactI18nextModule)
	.init({
		resources: localesResourse,
		lng: 'en',
		compatibilityJSON: 'v3',
		interpolation: {
			escapeValue: false
		}
	});

export default i18n;
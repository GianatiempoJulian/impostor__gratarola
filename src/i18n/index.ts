import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import it from './locales/it.json';

export type Translations = {
  en: typeof en;
  es: typeof es;
  fr: typeof fr;
  it: typeof it;
};

const translations: Translations = { en, es, fr, it };

export default translations;

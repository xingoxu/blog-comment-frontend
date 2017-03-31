import highlightJs from 'highlight.js/lib/highlight';
import { highlightLanguage } from '../config.js';

highlightLanguage.forEach(lang => {
  const langModule = require(`highlight.js/lib/languages/${lang}`);
  highlightJs.registerLanguage(lang, langModule);
});

export default highlightJs;
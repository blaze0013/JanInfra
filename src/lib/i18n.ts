import en from '../messages/en.json';
import hi from '../messages/hi.json';
import bn from '../messages/bn.json';
import mr from '../messages/mr.json';
import te from '../messages/te.json';
import ta from '../messages/ta.json';

const dictionaries: any = {
  en,
  hi,
  bn,
  mr,
  te,
  ta
};

export function getDictionary(lang: string) {
  return dictionaries[lang] || dictionaries['en'];
}
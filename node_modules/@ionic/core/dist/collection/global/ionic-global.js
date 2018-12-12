import { isPlatform, setupPlatforms } from '../utils/platform';
import { Config, configFromSession, configFromURL, saveConfig } from './config';
const win = window;
const Ionic = win['Ionic'] = win['Ionic'] || {};
Object.defineProperty(Ionic, 'queue', {
    get: () => Context['queue']
});
setupPlatforms(win);
Context.isPlatform = isPlatform;
const configObj = Object.assign({}, configFromSession(), { persistConfig: false }, Ionic['config'], configFromURL());
const config = Ionic['config'] = Context['config'] = new Config(configObj);
if (config.getBoolean('persistConfig')) {
    saveConfig(configObj);
}
const documentElement = document.documentElement;
const mode = config.get('mode', documentElement.getAttribute('mode') || (isPlatform(win, 'ios') ? 'ios' : 'md'));
Ionic.mode = Context.mode = mode;
config.set('mode', mode);
documentElement.setAttribute('mode', mode);
documentElement.classList.add(mode);
if (config.getBoolean('_testing')) {
    config.set('animated', false);
}

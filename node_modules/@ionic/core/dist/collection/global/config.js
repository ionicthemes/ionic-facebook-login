export class Config {
    constructor(configObj) {
        this.m = new Map(Object.entries(configObj));
    }
    get(key, fallback) {
        const value = this.m.get(key);
        return (value !== undefined) ? value : fallback;
    }
    getBoolean(key, fallback = false) {
        const val = this.m.get(key);
        if (val === undefined) {
            return fallback;
        }
        if (typeof val === 'string') {
            return val === 'true';
        }
        return !!val;
    }
    getNumber(key, fallback) {
        const val = parseFloat(this.m.get(key));
        return isNaN(val) ? (fallback !== undefined ? fallback : NaN) : val;
    }
    set(key, value) {
        this.m.set(key, value);
    }
}
export function configFromSession() {
    try {
        const configStr = window.sessionStorage.getItem(IONIC_SESSION_KEY);
        return configStr !== null ? JSON.parse(configStr) : {};
    }
    catch (e) {
        return {};
    }
}
export function saveConfig(config) {
    try {
        window.sessionStorage.setItem(IONIC_SESSION_KEY, JSON.stringify(config));
    }
    catch (e) {
        return;
    }
}
export function configFromURL() {
    const config = {};
    const win = window;
    win.location.search.slice(1)
        .split('&')
        .map(entry => entry.split('='))
        .map(([key, value]) => [decodeURIComponent(key), decodeURIComponent(value)])
        .filter(([key]) => startsWith(key, IONIC_PREFIX))
        .map(([key, value]) => [key.slice(IONIC_PREFIX.length), value])
        .forEach(([key, value]) => {
        config[key] = value;
    });
    return config;
}
function startsWith(input, search) {
    return input.substr(0, search.length) === search;
}
const IONIC_PREFIX = 'ionic:';
const IONIC_SESSION_KEY = 'ionic-persist-config';

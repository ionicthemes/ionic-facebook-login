import { rIC } from '../../utils/helpers';
import { isPlatform } from '../../utils/platform';
export class App {
    componentDidLoad() {
        rIC(() => {
            const { win, config, queue } = this;
            if (!config.getBoolean('_testing')) {
                importTapClick(win, config);
            }
            importInputShims(win, config);
            importStatusTap(win, config, queue);
            importHardwareBackButton(win, config);
        });
    }
    hostData() {
        return {
            class: {
                'ion-page': true,
                'force-statusbar-padding': this.config.getBoolean('_forceStatusbarPadding')
            }
        };
    }
    static get is() { return "ion-app"; }
    static get properties() { return {
        "config": {
            "context": "config"
        },
        "el": {
            "elementRef": true
        },
        "queue": {
            "context": "queue"
        },
        "win": {
            "context": "window"
        }
    }; }
    static get style() { return "/**style-placeholder:ion-app:**/"; }
}
function importHardwareBackButton(win, config) {
    const hardwareBackConfig = config.getBoolean('hardwareBackButton', isPlatform(win, 'hybrid'));
    if (hardwareBackConfig) {
        import('../../utils/hardware-back-button').then(module => module.startHardwareBackButton(win));
    }
}
function importStatusTap(win, config, queue) {
    const statusTap = config.getBoolean('statusTap', isPlatform(win, 'hybrid'));
    if (statusTap) {
        import('../../utils/status-tap').then(module => module.startStatusTap(win, queue));
    }
}
function importTapClick(win, config) {
    import('../../utils/tap-click').then(module => module.startTapClick(win.document, config));
}
function importInputShims(win, config) {
    const inputShims = config.getBoolean('inputShims', needInputShims(win));
    if (inputShims) {
        import('../../utils/input-shims/input-shims').then(module => module.startInputShims(win.document, config));
    }
}
function needInputShims(win) {
    return isPlatform(win, 'ios') && isPlatform(win, 'mobile');
}

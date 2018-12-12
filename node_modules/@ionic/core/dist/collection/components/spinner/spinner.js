import { createColorClasses } from '../../utils/theme';
import { SPINNERS } from './spinner-configs';
export class Spinner {
    constructor() {
        this.paused = false;
    }
    getName() {
        const name = this.name || this.config.get('spinner');
        if (name) {
            return name;
        }
        return (this.mode === 'ios') ? 'lines' : 'crescent';
    }
    hostData() {
        return {
            class: Object.assign({}, createColorClasses(this.color), { [`spinner-${this.getName()}`]: true, 'spinner-paused': !!this.paused || this.config.getBoolean('_testing') })
        };
    }
    render() {
        const name = this.getName();
        const spinner = SPINNERS[name] || SPINNERS['lines'];
        const duration = (typeof this.duration === 'number' && this.duration > 10 ? this.duration : spinner.dur);
        const svgs = [];
        if (spinner.circles !== undefined) {
            for (let i = 0; i < spinner.circles; i++) {
                svgs.push(buildCircle(spinner, duration, i, spinner.circles));
            }
        }
        else if (spinner.lines !== undefined) {
            for (let i = 0; i < spinner.lines; i++) {
                svgs.push(buildLine(spinner, duration, i, spinner.lines));
            }
        }
        return svgs;
    }
    static get is() { return "ion-spinner"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "color": {
            "type": String,
            "attr": "color"
        },
        "config": {
            "context": "config"
        },
        "duration": {
            "type": Number,
            "attr": "duration"
        },
        "name": {
            "type": String,
            "attr": "name"
        },
        "paused": {
            "type": Boolean,
            "attr": "paused"
        }
    }; }
    static get style() { return "/**style-placeholder:ion-spinner:**/"; }
}
function buildCircle(spinner, duration, index, total) {
    const data = spinner.fn(duration, index, total);
    data.style['animation-duration'] = `${duration}ms`;
    return (h("svg", { viewBox: "0 0 64 64", style: data.style },
        h("circle", { transform: "translate(32,32)", r: data.r })));
}
function buildLine(spinner, duration, index, total) {
    const data = spinner.fn(duration, index, total);
    data.style['animation-duration'] = `${duration}ms`;
    return (h("svg", { viewBox: "0 0 64 64", style: data.style },
        h("line", { transform: "translate(32,32)", y1: data.y1, y2: data.y2 })));
}

import { clamp, debounceEvent } from '../../utils/helpers';
import { createColorClasses, hostContext } from '../../utils/theme';
export class Range {
    constructor() {
        this.noUpdate = false;
        this.hasFocus = false;
        this.ratioA = 0;
        this.ratioB = 0;
        this.debounce = 0;
        this.name = '';
        this.dualKnobs = false;
        this.min = 0;
        this.max = 100;
        this.pin = false;
        this.snaps = false;
        this.step = 1;
        this.disabled = false;
        this.value = 0;
    }
    debounceChanged() {
        this.ionChange = debounceEvent(this.ionChange, this.debounce);
    }
    minChanged() {
        if (!this.noUpdate) {
            this.updateRatio();
        }
    }
    maxChanged() {
        if (!this.noUpdate) {
            this.updateRatio();
        }
    }
    disabledChanged() {
        if (this.gesture) {
            this.gesture.setDisabled(this.disabled);
        }
        this.emitStyle();
    }
    valueChanged(value) {
        if (!this.noUpdate) {
            this.updateRatio();
        }
        this.ionChange.emit({ value });
    }
    componentWillLoad() {
        this.updateRatio();
        this.debounceChanged();
        this.emitStyle();
    }
    async componentDidLoad() {
        this.gesture = (await import('../../utils/gesture/gesture')).createGesture({
            el: this.rangeSlider,
            queue: this.queue,
            gestureName: 'range',
            gesturePriority: 100,
            threshold: 0,
            onStart: ev => this.onStart(ev),
            onMove: ev => this.onMove(ev),
            onEnd: ev => this.onEnd(ev),
        });
        this.gesture.setDisabled(this.disabled);
    }
    keyChng(ev) {
        let step = this.step;
        step = step > 0 ? step : 1;
        step = step / (this.max - this.min);
        if (!ev.detail.isIncrease) {
            step *= -1;
        }
        if (ev.detail.knob === 'A') {
            this.ratioA += step;
        }
        else {
            this.ratioB += step;
        }
        this.updateValue();
    }
    handleKeyboard(knob, isIncrease) {
        let step = this.step;
        step = step > 0 ? step : 1;
        step = step / (this.max - this.min);
        if (!isIncrease) {
            step *= -1;
        }
        if (knob === 'A') {
            this.ratioA += step;
        }
        else {
            this.ratioB += step;
        }
        this.updateValue();
    }
    getValue() {
        const value = this.value || 0;
        if (this.dualKnobs) {
            if (typeof value === 'object') {
                return value;
            }
            return {
                lower: 0,
                upper: value
            };
        }
        else {
            if (typeof value === 'object') {
                return value.upper;
            }
            return value;
        }
    }
    emitStyle() {
        this.ionStyle.emit({
            'interactive-disabled': this.disabled
        });
    }
    fireBlur() {
        if (this.hasFocus) {
            this.hasFocus = false;
            this.ionBlur.emit();
            this.emitStyle();
        }
    }
    fireFocus() {
        if (!this.hasFocus) {
            this.hasFocus = true;
            this.ionFocus.emit();
            this.emitStyle();
        }
    }
    onStart(detail) {
        this.fireFocus();
        const rect = this.rect = this.rangeSlider.getBoundingClientRect();
        const currentX = detail.currentX;
        const ratio = clamp(0, (currentX - rect.left) / rect.width, 1);
        this.pressedKnob =
            !this.dualKnobs ||
                Math.abs(this.ratioA - ratio) < Math.abs(this.ratioB - ratio)
                ? 'A'
                : 'B';
        this.update(currentX);
    }
    onMove(detail) {
        this.update(detail.currentX);
    }
    onEnd(detail) {
        this.update(detail.currentX);
        this.pressedKnob = undefined;
        this.fireBlur();
    }
    update(currentX) {
        const rect = this.rect;
        let ratio = clamp(0, (currentX - rect.left) / rect.width, 1);
        if (this.snaps) {
            const value = ratioToValue(ratio, this.min, this.max, this.step);
            ratio = valueToRatio(value, this.min, this.max);
        }
        if (this.pressedKnob === 'A') {
            this.ratioA = ratio;
        }
        else {
            this.ratioB = ratio;
        }
        this.updateValue();
    }
    get valA() {
        return ratioToValue(this.ratioA, this.min, this.max, this.step);
    }
    get valB() {
        return ratioToValue(this.ratioB, this.min, this.max, this.step);
    }
    get ratioLower() {
        if (this.dualKnobs) {
            return Math.min(this.ratioA, this.ratioB);
        }
        return 0;
    }
    get ratioUpper() {
        if (this.dualKnobs) {
            return Math.max(this.ratioA, this.ratioB);
        }
        return this.ratioA;
    }
    updateRatio() {
        const value = this.getValue();
        const { min, max } = this;
        if (this.dualKnobs) {
            this.ratioA = valueToRatio(value.lower, min, max);
            this.ratioB = valueToRatio(value.upper, min, max);
        }
        else {
            this.ratioA = valueToRatio(value, min, max);
        }
    }
    updateValue() {
        this.noUpdate = true;
        const { valA, valB } = this;
        this.value = !this.dualKnobs
            ? valA
            : {
                lower: Math.min(valA, valB),
                upper: Math.max(valA, valB)
            };
        this.noUpdate = false;
    }
    hostData() {
        return {
            class: Object.assign({}, createColorClasses(this.color), { 'in-item': hostContext('ion-item', this.el), 'range-disabled': this.disabled, 'range-pressed': this.pressedKnob !== undefined, 'range-has-pin': this.pin })
        };
    }
    render() {
        const { min, max, step, ratioLower, ratioUpper } = this;
        const barL = `${ratioLower * 100}%`;
        const barR = `${100 - ratioUpper * 100}%`;
        const ticks = [];
        if (this.snaps) {
            for (let value = min; value <= max; value += step) {
                const ratio = valueToRatio(value, min, max);
                ticks.push({
                    ratio,
                    active: ratio >= ratioLower && ratio <= ratioUpper,
                    left: `${ratio * 100}%`
                });
            }
        }
        return [
            h("slot", { name: "start" }),
            h("div", { class: "range-slider", ref: el => this.rangeSlider = el },
                ticks.map(t => (h("div", { style: { left: t.left }, role: "presentation", class: {
                        'range-tick': true,
                        'range-tick-active': t.active
                    } }))),
                h("div", { class: "range-bar", role: "presentation" }),
                h("div", { class: "range-bar range-bar-active", role: "presentation", style: {
                        left: barL,
                        right: barR
                    } }),
                renderKnob({
                    knob: 'A',
                    pressed: this.pressedKnob === 'A',
                    value: this.valA,
                    ratio: this.ratioA,
                    pin: this.pin,
                    disabled: this.disabled,
                    handleKeyboard: this.handleKeyboard.bind(this),
                    min,
                    max
                }),
                this.dualKnobs && renderKnob({
                    knob: 'B',
                    pressed: this.pressedKnob === 'B',
                    value: this.valB,
                    ratio: this.ratioB,
                    pin: this.pin,
                    disabled: this.disabled,
                    handleKeyboard: this.handleKeyboard.bind(this),
                    min,
                    max
                })),
            h("slot", { name: "end" })
        ];
    }
    static get is() { return "ion-range"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "color": {
            "type": String,
            "attr": "color"
        },
        "debounce": {
            "type": Number,
            "attr": "debounce",
            "watchCallbacks": ["debounceChanged"]
        },
        "disabled": {
            "type": Boolean,
            "attr": "disabled",
            "watchCallbacks": ["disabledChanged"]
        },
        "dualKnobs": {
            "type": Boolean,
            "attr": "dual-knobs"
        },
        "el": {
            "elementRef": true
        },
        "max": {
            "type": Number,
            "attr": "max",
            "watchCallbacks": ["maxChanged"]
        },
        "min": {
            "type": Number,
            "attr": "min",
            "watchCallbacks": ["minChanged"]
        },
        "mode": {
            "type": String,
            "attr": "mode"
        },
        "name": {
            "type": String,
            "attr": "name"
        },
        "pin": {
            "type": Boolean,
            "attr": "pin"
        },
        "pressedKnob": {
            "state": true
        },
        "queue": {
            "context": "queue"
        },
        "ratioA": {
            "state": true
        },
        "ratioB": {
            "state": true
        },
        "snaps": {
            "type": Boolean,
            "attr": "snaps"
        },
        "step": {
            "type": Number,
            "attr": "step"
        },
        "value": {
            "type": Number,
            "attr": "value",
            "mutable": true,
            "watchCallbacks": ["valueChanged"]
        }
    }; }
    static get events() { return [{
            "name": "ionChange",
            "method": "ionChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionStyle",
            "method": "ionStyle",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionFocus",
            "method": "ionFocus",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionBlur",
            "method": "ionBlur",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "ionIncrease",
            "method": "keyChng"
        }, {
            "name": "ionDecrease",
            "method": "keyChng"
        }]; }
    static get style() { return "/**style-placeholder:ion-range:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-range:**/"; }
}
function renderKnob({ knob, value, ratio, min, max, disabled, pressed, pin, handleKeyboard }) {
    return (h("div", { onKeyDown: (ev) => {
            const key = ev.key;
            if (key === 'ArrowLeft' || key === 'ArrowDown') {
                handleKeyboard(knob, false);
                ev.preventDefault();
                ev.stopPropagation();
            }
            else if (key === 'ArrowRight' || key === 'ArrowUp') {
                handleKeyboard(knob, true);
                ev.preventDefault();
                ev.stopPropagation();
            }
        }, class: {
            'range-knob-handle': true,
            'range-knob-pressed': pressed,
            'range-knob-min': value === min,
            'range-knob-max': value === max
        }, style: {
            'left': `${ratio * 100}%`
        }, role: "slider", tabindex: disabled ? -1 : 0, "aria-valuemin": min, "aria-valuemax": max, "aria-disabled": disabled ? 'true' : null, "aria-valuenow": value },
        pin && h("div", { class: "range-pin", role: "presentation" }, Math.round(value)),
        h("div", { class: "range-knob", role: "presentation" })));
}
function ratioToValue(ratio, min, max, step) {
    let value = (max - min) * ratio;
    if (step > 0) {
        value = Math.round(value / step) * step + min;
    }
    return clamp(min, value, max);
}
function valueToRatio(value, min, max) {
    return clamp(0, (value - min) / (max - min), 1);
}

import { GESTURE_CONTROLLER } from '../../utils/gesture/gesture-controller';
import { now } from '../../utils/helpers';
export class Backdrop {
    constructor() {
        this.lastClick = -10000;
        this.blocker = GESTURE_CONTROLLER.createBlocker({
            disableScroll: true
        });
        this.visible = true;
        this.tappable = true;
        this.stopPropagation = true;
    }
    componentDidLoad() {
        if (this.stopPropagation) {
            this.blocker.block();
        }
    }
    componentDidUnload() {
        this.blocker.destroy();
    }
    onTouchStart(ev) {
        this.lastClick = now(ev);
        this.emitTap(ev);
    }
    onMouseDown(ev) {
        if (this.lastClick < now(ev) - 2500) {
            this.emitTap(ev);
        }
    }
    emitTap(ev) {
        if (this.stopPropagation) {
            ev.preventDefault();
            ev.stopPropagation();
        }
        if (this.tappable) {
            this.ionBackdropTap.emit();
        }
    }
    hostData() {
        return {
            tabindex: '-1',
            class: {
                'backdrop-hide': !this.visible,
                'backdrop-no-tappable': !this.tappable,
            }
        };
    }
    static get is() { return "ion-backdrop"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "doc": {
            "context": "document"
        },
        "stopPropagation": {
            "type": Boolean,
            "attr": "stop-propagation"
        },
        "tappable": {
            "type": Boolean,
            "attr": "tappable"
        },
        "visible": {
            "type": Boolean,
            "attr": "visible"
        }
    }; }
    static get events() { return [{
            "name": "ionBackdropTap",
            "method": "ionBackdropTap",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "touchstart",
            "method": "onTouchStart",
            "capture": true
        }, {
            "name": "click",
            "method": "onMouseDown",
            "capture": true
        }, {
            "name": "mousedown",
            "method": "onMouseDown",
            "capture": true
        }]; }
    static get style() { return "/**style-placeholder:ion-backdrop:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-backdrop:**/"; }
}

import { dismiss, eventMethod, present } from '../../utils/overlays';
import { createThemedClasses, getClassMap } from '../../utils/theme';
import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
export class Picker {
    constructor() {
        this.presented = false;
        this.keyboardClose = true;
        this.buttons = [];
        this.columns = [];
        this.duration = 0;
        this.showBackdrop = true;
        this.backdropDismiss = true;
        this.animated = true;
    }
    componentDidLoad() {
        this.ionPickerDidLoad.emit();
    }
    componentDidUnload() {
        this.ionPickerDidUnload.emit();
    }
    onBackdropTap() {
        const cancelBtn = this.buttons.find(b => b.role === 'cancel');
        if (cancelBtn) {
            this.buttonClick(cancelBtn);
        }
        else {
            this.dismiss();
        }
    }
    async present() {
        await present(this, 'pickerEnter', iosEnterAnimation, iosEnterAnimation, undefined);
        if (this.duration > 0) {
            this.durationTimeout = setTimeout(() => this.dismiss(), this.duration);
        }
    }
    dismiss(data, role) {
        if (this.durationTimeout) {
            clearTimeout(this.durationTimeout);
        }
        return dismiss(this, data, role, 'pickerLeave', iosLeaveAnimation, iosLeaveAnimation);
    }
    onDidDismiss() {
        return eventMethod(this.el, 'ionPickerDidDismiss');
    }
    onWillDismiss() {
        return eventMethod(this.el, 'ionPickerWillDismiss');
    }
    getColumn(name) {
        return Promise.resolve(this.columns.find(column => column.name === name));
    }
    buttonClick(button) {
        let shouldDismiss = true;
        if (button.handler) {
            if (button.handler(this.getSelected()) === false) {
                shouldDismiss = false;
            }
        }
        if (shouldDismiss) {
            return this.dismiss();
        }
        return Promise.resolve(false);
    }
    getSelected() {
        const selected = {};
        this.columns.forEach((col, index) => {
            const selectedColumn = col.selectedIndex !== undefined
                ? col.options[col.selectedIndex]
                : undefined;
            selected[col.name] = {
                text: selectedColumn ? selectedColumn.text : undefined,
                value: selectedColumn ? selectedColumn.value : undefined,
                columnIndex: index
            };
        });
        return selected;
    }
    hostData() {
        return {
            class: Object.assign({}, createThemedClasses(this.mode, 'picker'), getClassMap(this.cssClass)),
            style: {
                zIndex: 20000 + this.overlayIndex
            }
        };
    }
    render() {
        return [
            h("ion-backdrop", { visible: this.showBackdrop, tappable: this.backdropDismiss }),
            h("div", { class: "picker-wrapper", role: "dialog" },
                h("div", { class: "picker-toolbar" }, this.buttons.map(b => (h("div", { class: buttonWrapperClass(b) },
                    h("button", { type: "button", "ion-activatable": true, onClick: () => this.buttonClick(b), class: buttonClass(b) }, b.text))))),
                h("div", { class: "picker-columns" },
                    h("div", { class: "picker-above-highlight" }),
                    this.columns.map(c => h("ion-picker-column", { col: c })),
                    h("div", { class: "picker-below-highlight" })))
        ];
    }
    static get is() { return "ion-picker"; }
    static get properties() { return {
        "animated": {
            "type": Boolean,
            "attr": "animated"
        },
        "animationCtrl": {
            "connect": "ion-animation-controller"
        },
        "backdropDismiss": {
            "type": Boolean,
            "attr": "backdrop-dismiss"
        },
        "buttons": {
            "type": "Any",
            "attr": "buttons"
        },
        "columns": {
            "type": "Any",
            "attr": "columns"
        },
        "config": {
            "context": "config"
        },
        "cssClass": {
            "type": String,
            "attr": "css-class"
        },
        "dismiss": {
            "method": true
        },
        "duration": {
            "type": Number,
            "attr": "duration"
        },
        "el": {
            "elementRef": true
        },
        "enterAnimation": {
            "type": "Any",
            "attr": "enter-animation"
        },
        "getColumn": {
            "method": true
        },
        "keyboardClose": {
            "type": Boolean,
            "attr": "keyboard-close"
        },
        "leaveAnimation": {
            "type": "Any",
            "attr": "leave-animation"
        },
        "mode": {
            "type": String,
            "attr": "mode"
        },
        "onDidDismiss": {
            "method": true
        },
        "onWillDismiss": {
            "method": true
        },
        "overlayIndex": {
            "type": Number,
            "attr": "overlay-index"
        },
        "present": {
            "method": true
        },
        "showBackdrop": {
            "type": Boolean,
            "attr": "show-backdrop"
        }
    }; }
    static get events() { return [{
            "name": "ionPickerDidLoad",
            "method": "ionPickerDidLoad",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionPickerDidPresent",
            "method": "didPresent",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionPickerWillPresent",
            "method": "willPresent",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionPickerWillDismiss",
            "method": "willDismiss",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionPickerDidDismiss",
            "method": "didDismiss",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionPickerDidUnload",
            "method": "ionPickerDidUnload",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "ionBackdropTap",
            "method": "onBackdropTap"
        }]; }
    static get style() { return "/**style-placeholder:ion-picker:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-picker:**/"; }
}
function buttonWrapperClass(button) {
    return {
        [`picker-toolbar-${button.role}`]: button.role !== undefined,
        'picker-toolbar-button': true
    };
}
function buttonClass(button) {
    return Object.assign({ 'picker-button': true }, getClassMap(button.cssClass));
}

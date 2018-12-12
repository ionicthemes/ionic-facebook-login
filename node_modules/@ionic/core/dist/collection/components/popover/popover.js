import { attachComponent, detachComponent } from '../../utils/framework-delegate';
import { BACKDROP, dismiss, eventMethod, present } from '../../utils/overlays';
import { getClassMap } from '../../utils/theme';
import { deepReady } from '../../utils/transition';
import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';
export class Popover {
    constructor() {
        this.presented = false;
        this.keyboardClose = true;
        this.backdropDismiss = true;
        this.showBackdrop = true;
        this.translucent = false;
        this.animated = true;
    }
    componentDidLoad() {
        this.ionPopoverDidLoad.emit();
    }
    componentDidUnload() {
        this.ionPopoverDidUnload.emit();
    }
    onDismiss(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.dismiss();
    }
    onBackdropTap() {
        this.dismiss(undefined, BACKDROP);
    }
    lifecycle(modalEvent) {
        const el = this.usersElement;
        const name = LIFECYCLE_MAP[modalEvent.type];
        if (el && name) {
            const event = new CustomEvent(name, {
                bubbles: false,
                cancelable: false,
                detail: modalEvent.detail
            });
            el.dispatchEvent(event);
        }
    }
    async present() {
        if (this.presented) {
            return;
        }
        const container = this.el.querySelector('.popover-content');
        if (!container) {
            throw new Error('container is undefined');
        }
        const data = Object.assign({}, this.componentProps, { popover: this.el });
        this.usersElement = await attachComponent(this.delegate, container, this.component, ['popover-viewport', this.el['s-sc']], data);
        await deepReady(this.usersElement);
        return present(this, 'popoverEnter', iosEnterAnimation, mdEnterAnimation, this.event);
    }
    async dismiss(data, role) {
        const shouldDismiss = await dismiss(this, data, role, 'popoverLeave', iosLeaveAnimation, mdLeaveAnimation, this.event);
        if (shouldDismiss) {
            await detachComponent(this.delegate, this.usersElement);
        }
        return shouldDismiss;
    }
    onDidDismiss() {
        return eventMethod(this.el, 'ionPopoverDidDismiss');
    }
    onWillDismiss() {
        return eventMethod(this.el, 'ionPopoverWillDismiss');
    }
    hostData() {
        return {
            style: {
                zIndex: 20000 + this.overlayIndex,
            },
            'no-router': true,
            class: Object.assign({ 'popover-translucent': this.translucent }, getClassMap(this.cssClass))
        };
    }
    render() {
        return [
            h("ion-backdrop", { tappable: this.backdropDismiss, visible: this.showBackdrop }),
            h("div", { class: "popover-wrapper" },
                h("div", { class: "popover-arrow" }),
                h("div", { class: "popover-content" }))
        ];
    }
    static get is() { return "ion-popover"; }
    static get encapsulation() { return "scoped"; }
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
        "component": {
            "type": String,
            "attr": "component"
        },
        "componentProps": {
            "type": "Any",
            "attr": "component-props"
        },
        "config": {
            "context": "config"
        },
        "cssClass": {
            "type": String,
            "attr": "css-class"
        },
        "delegate": {
            "type": "Any",
            "attr": "delegate"
        },
        "dismiss": {
            "method": true
        },
        "el": {
            "elementRef": true
        },
        "enterAnimation": {
            "type": "Any",
            "attr": "enter-animation"
        },
        "event": {
            "type": "Any",
            "attr": "event"
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
        },
        "translucent": {
            "type": Boolean,
            "attr": "translucent"
        }
    }; }
    static get events() { return [{
            "name": "ionPopoverDidLoad",
            "method": "ionPopoverDidLoad",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionPopoverDidUnload",
            "method": "ionPopoverDidUnload",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionPopoverDidPresent",
            "method": "didPresent",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionPopoverWillPresent",
            "method": "willPresent",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionPopoverWillDismiss",
            "method": "willDismiss",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionPopoverDidDismiss",
            "method": "didDismiss",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "ionDismiss",
            "method": "onDismiss"
        }, {
            "name": "ionBackdropTap",
            "method": "onBackdropTap"
        }, {
            "name": "ionPopoverDidPresent",
            "method": "lifecycle"
        }, {
            "name": "ionPopoverWillPresent",
            "method": "lifecycle"
        }, {
            "name": "ionPopoverWillDismiss",
            "method": "lifecycle"
        }, {
            "name": "ionPopoverDidDismiss",
            "method": "lifecycle"
        }]; }
    static get style() { return "/**style-placeholder:ion-popover:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-popover:**/"; }
}
const LIFECYCLE_MAP = {
    'ionPopoverDidPresent': 'ionViewDidEnter',
    'ionPopoverWillPresent': 'ionViewWillEnter',
    'ionPopoverWillDismiss': 'ionViewWillLeave',
    'ionPopoverDidDismiss': 'ionViewDidLeave',
};

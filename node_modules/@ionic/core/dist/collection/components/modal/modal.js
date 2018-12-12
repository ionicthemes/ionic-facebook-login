import { attachComponent, detachComponent } from '../../utils/framework-delegate';
import { BACKDROP, dismiss, eventMethod, present } from '../../utils/overlays';
import { createThemedClasses, getClassMap } from '../../utils/theme';
import { deepReady } from '../../utils/transition';
import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';
export class Modal {
    constructor() {
        this.presented = false;
        this.keyboardClose = true;
        this.backdropDismiss = true;
        this.showBackdrop = true;
        this.animated = true;
    }
    componentDidLoad() {
        this.ionModalDidLoad.emit();
    }
    componentDidUnload() {
        this.ionModalDidUnload.emit();
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
            const ev = new CustomEvent(name, {
                bubbles: false,
                cancelable: false,
                detail: modalEvent.detail
            });
            el.dispatchEvent(ev);
        }
    }
    async present() {
        if (this.presented) {
            return;
        }
        const container = this.el.querySelector(`.modal-wrapper`);
        if (!container) {
            throw new Error('container is undefined');
        }
        const componentProps = Object.assign({}, this.componentProps, { modal: this.el });
        this.usersElement = await attachComponent(this.delegate, container, this.component, ['ion-page'], componentProps);
        await deepReady(this.usersElement);
        return present(this, 'modalEnter', iosEnterAnimation, mdEnterAnimation);
    }
    async dismiss(data, role) {
        const dismissed = await dismiss(this, data, role, 'modalLeave', iosLeaveAnimation, mdLeaveAnimation);
        if (dismissed) {
            await detachComponent(this.delegate, this.usersElement);
        }
        return dismissed;
    }
    onDidDismiss() {
        return eventMethod(this.el, 'ionModalDidDismiss');
    }
    onWillDismiss() {
        return eventMethod(this.el, 'ionModalWillDismiss');
    }
    hostData() {
        return {
            'no-router': true,
            class: Object.assign({}, createThemedClasses(this.mode, 'modal'), getClassMap(this.cssClass)),
            style: {
                zIndex: 20000 + this.overlayIndex,
            }
        };
    }
    render() {
        const dialogClasses = createThemedClasses(this.mode, 'modal-wrapper');
        return [
            h("ion-backdrop", { visible: this.showBackdrop, tappable: this.backdropDismiss }),
            h("div", { role: "dialog", class: dialogClasses })
        ];
    }
    static get is() { return "ion-modal"; }
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
            "name": "ionModalDidLoad",
            "method": "ionModalDidLoad",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionModalDidUnload",
            "method": "ionModalDidUnload",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionModalDidPresent",
            "method": "didPresent",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionModalWillPresent",
            "method": "willPresent",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionModalWillDismiss",
            "method": "willDismiss",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionModalDidDismiss",
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
            "name": "ionModalDidPresent",
            "method": "lifecycle"
        }, {
            "name": "ionModalWillPresent",
            "method": "lifecycle"
        }, {
            "name": "ionModalWillDismiss",
            "method": "lifecycle"
        }, {
            "name": "ionModalDidDismiss",
            "method": "lifecycle"
        }]; }
    static get style() { return "/**style-placeholder:ion-modal:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-modal:**/"; }
}
const LIFECYCLE_MAP = {
    'ionModalDidPresent': 'ionViewDidEnter',
    'ionModalWillPresent': 'ionViewWillEnter',
    'ionModalWillDismiss': 'ionViewWillLeave',
    'ionModalDidDismiss': 'ionViewDidLeave',
};

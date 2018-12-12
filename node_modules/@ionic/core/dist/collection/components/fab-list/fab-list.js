export class FabList {
    constructor() {
        this.activated = false;
        this.side = 'bottom';
    }
    activatedChanged(activated) {
        const fabs = Array.from(this.el.querySelectorAll('ion-fab-button'));
        const timeout = activated ? 30 : 0;
        fabs.forEach((fab, i) => {
            setTimeout(() => fab.show = activated, i * timeout);
        });
    }
    hostData() {
        return {
            class: {
                'fab-list-active': this.activated,
                [`fab-list-side-${this.side}`]: true
            }
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-fab-list"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "activated": {
            "type": Boolean,
            "attr": "activated",
            "watchCallbacks": ["activatedChanged"]
        },
        "el": {
            "elementRef": true
        },
        "side": {
            "type": String,
            "attr": "side"
        }
    }; }
    static get style() { return "/**style-placeholder:ion-fab-list:**/"; }
}

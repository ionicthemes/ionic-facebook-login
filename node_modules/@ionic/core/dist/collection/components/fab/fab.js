export class Fab {
    constructor() {
        this.edge = false;
        this.activated = false;
    }
    activatedChanged() {
        const activated = this.activated;
        const fab = this.el.querySelector('ion-fab-button');
        if (fab) {
            fab.activated = activated;
        }
        Array.from(this.el.querySelectorAll('ion-fab-list')).forEach(list => {
            list.activated = activated;
        });
    }
    componentDidLoad() {
        if (this.activated) {
            this.activatedChanged();
        }
    }
    onClick() {
        const hasList = !!this.el.querySelector('ion-fab-list');
        if (hasList) {
            this.activated = !this.activated;
        }
    }
    close() {
        this.activated = false;
    }
    hostData() {
        return {
            class: {
                [`fab-horizontal-${this.horizontal}`]: this.horizontal !== undefined,
                [`fab-vertical-${this.vertical}`]: this.vertical !== undefined,
                'fab-edge': this.edge
            }
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-fab"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "activated": {
            "type": Boolean,
            "attr": "activated",
            "mutable": true,
            "watchCallbacks": ["activatedChanged"]
        },
        "close": {
            "method": true
        },
        "edge": {
            "type": Boolean,
            "attr": "edge"
        },
        "el": {
            "elementRef": true
        },
        "horizontal": {
            "type": String,
            "attr": "horizontal"
        },
        "vertical": {
            "type": String,
            "attr": "vertical"
        }
    }; }
    static get listeners() { return [{
            "name": "click",
            "method": "onClick"
        }]; }
    static get style() { return "/**style-placeholder:ion-fab:**/"; }
}

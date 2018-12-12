export class Grid {
    constructor() {
        this.fixed = false;
    }
    hostData() {
        return {
            class: {
                'grid-fixed': this.fixed
            }
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-grid"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "fixed": {
            "type": Boolean,
            "attr": "fixed"
        }
    }; }
    static get style() { return "/**style-placeholder:ion-grid:**/"; }
}

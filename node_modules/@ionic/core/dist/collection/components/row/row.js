export class Row {
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-row"; }
    static get encapsulation() { return "shadow"; }
    static get style() { return "/**style-placeholder:ion-row:**/"; }
}

export class Avatar {
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-avatar"; }
    static get encapsulation() { return "shadow"; }
    static get style() { return "/**style-placeholder:ion-avatar:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-avatar:**/"; }
}

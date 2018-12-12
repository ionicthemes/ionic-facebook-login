import { createColorClasses } from '../../utils/theme';
export class Text {
    hostData() {
        return {
            class: createColorClasses(this.color)
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-text"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "color": {
            "type": String,
            "attr": "color"
        },
        "mode": {
            "type": String,
            "attr": "mode"
        }
    }; }
    static get style() { return "/**style-placeholder:ion-text:**/"; }
}

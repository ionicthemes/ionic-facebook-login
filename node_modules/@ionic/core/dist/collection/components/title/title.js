import { createColorClasses } from '../../utils/theme';
export class ToolbarTitle {
    getMode() {
        const toolbar = this.el.closest('ion-toolbar');
        return (toolbar && toolbar.mode) || this.mode;
    }
    hostData() {
        const mode = this.getMode();
        return {
            class: Object.assign({}, createColorClasses(this.color), { [`title-${mode}`]: true })
        };
    }
    render() {
        return [
            h("div", { class: "toolbar-title" },
                h("slot", null))
        ];
    }
    static get is() { return "ion-title"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "color": {
            "type": String,
            "attr": "color"
        },
        "el": {
            "elementRef": true
        }
    }; }
    static get style() { return "/**style-placeholder:ion-title:**/"; }
}

import { createColorClasses } from '../../utils/theme';
export class ItemOption {
    constructor() {
        this.disabled = false;
        this.expandable = false;
    }
    clickedOptionButton(ev) {
        const el = ev.target.closest('ion-item-option');
        return !!el;
    }
    hostData() {
        return {
            'ion-activatable': true,
            class: Object.assign({}, createColorClasses(this.color), { 'item-option-expandable': this.expandable })
        };
    }
    render() {
        const TagType = this.href === undefined ? 'button' : 'a';
        return (h(TagType, { type: "button", class: "button-native", disabled: this.disabled, href: this.href, onClick: this.clickedOptionButton.bind(this) },
            h("span", { class: "button-inner" },
                h("slot", { name: "start" }),
                h("slot", { name: "top" }),
                h("slot", { name: "icon-only" }),
                h("slot", null),
                h("slot", { name: "bottom" }),
                h("slot", { name: "end" })),
            this.mode === 'md' && h("ion-ripple-effect", null)));
    }
    static get is() { return "ion-item-option"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "color": {
            "type": String,
            "attr": "color"
        },
        "disabled": {
            "type": Boolean,
            "attr": "disabled"
        },
        "el": {
            "elementRef": true
        },
        "expandable": {
            "type": Boolean,
            "attr": "expandable"
        },
        "href": {
            "type": String,
            "attr": "href"
        },
        "mode": {
            "type": String,
            "attr": "mode"
        }
    }; }
    static get style() { return "/**style-placeholder:ion-item-option:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-item-option:**/"; }
}

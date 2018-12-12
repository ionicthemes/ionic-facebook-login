export class MenuButton {
    constructor() {
        this.autoHide = true;
    }
    hostData() {
        return {
            'ion-activatable': true,
            class: {
                'button': true
            }
        };
    }
    render() {
        const menuIcon = this.config.get('menuIcon', 'menu');
        return (h("ion-menu-toggle", { menu: this.menu, autoHide: this.autoHide },
            h("button", { type: "button" },
                h("slot", null,
                    h("ion-icon", { icon: menuIcon, mode: this.mode, color: this.color, lazy: false })),
                this.mode === 'md' && h("ion-ripple-effect", null))));
    }
    static get is() { return "ion-menu-button"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "autoHide": {
            "type": Boolean,
            "attr": "auto-hide"
        },
        "color": {
            "type": String,
            "attr": "color"
        },
        "config": {
            "context": "config"
        },
        "menu": {
            "type": String,
            "attr": "menu"
        },
        "mode": {
            "type": String,
            "attr": "mode"
        }
    }; }
    static get style() { return "/**style-placeholder:ion-menu-button:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-menu-button:**/"; }
}

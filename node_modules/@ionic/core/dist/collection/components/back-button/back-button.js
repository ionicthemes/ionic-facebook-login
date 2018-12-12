import { createColorClasses, openURL } from '../../utils/theme';
export class BackButton {
    async onClick(ev) {
        const nav = this.el.closest('ion-nav');
        ev.preventDefault();
        if (nav && await nav.canGoBack()) {
            return nav.pop({ skipIfBusy: true });
        }
        return openURL(this.win, this.defaultHref, ev, 'back');
    }
    hostData() {
        const showBackButton = this.defaultHref !== undefined;
        return {
            'ion-activatable': true,
            class: Object.assign({}, createColorClasses(this.color), { 'button': true, 'show-back-button': showBackButton })
        };
    }
    render() {
        const defaultBackButtonText = this.mode === 'ios' ? 'Back' : null;
        const backButtonIcon = this.icon != null ? this.icon : this.config.get('backButtonIcon', 'arrow-back');
        const backButtonText = this.text != null ? this.text : this.config.get('backButtonText', defaultBackButtonText);
        return (h("button", { type: "button", class: "button-native", onClick: ev => this.onClick(ev) },
            h("span", { class: "button-inner" },
                backButtonIcon && h("ion-icon", { icon: backButtonIcon, lazy: false }),
                backButtonText && h("span", { class: "button-text" }, backButtonText),
                this.mode === 'md' && h("ion-ripple-effect", null)),
            this.mode === 'md' && h("ion-ripple-effect", null)));
    }
    static get is() { return "ion-back-button"; }
    static get encapsulation() { return "scoped"; }
    static get properties() { return {
        "color": {
            "type": String,
            "attr": "color"
        },
        "config": {
            "context": "config"
        },
        "defaultHref": {
            "type": String,
            "attr": "default-href"
        },
        "el": {
            "elementRef": true
        },
        "icon": {
            "type": String,
            "attr": "icon"
        },
        "mode": {
            "type": String,
            "attr": "mode"
        },
        "text": {
            "type": String,
            "attr": "text"
        },
        "win": {
            "context": "window"
        }
    }; }
    static get style() { return "/**style-placeholder:ion-back-button:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-back-button:**/"; }
}

export class MenuToggle {
    constructor() {
        this.visible = false;
        this.autoHide = true;
    }
    componentDidLoad() {
        return this.updateVisibility();
    }
    async onClick() {
        const menuCtrl = await getMenuController(this.doc);
        if (menuCtrl) {
            const menu = await menuCtrl.get(this.menu);
            if (menu) {
                menuCtrl.toggle(this.menu);
            }
        }
    }
    async updateVisibility() {
        const menuCtrl = await getMenuController(this.doc);
        if (menuCtrl) {
            const menu = await menuCtrl.get(this.menu);
            if (menu && await menu.isActive()) {
                this.visible = true;
                return;
            }
        }
        this.visible = false;
    }
    hostData() {
        const hidden = this.autoHide && !this.visible;
        return {
            'aria-hidden': hidden ? 'true' : null,
            class: {
                'menu-toggle-hidden': hidden,
            }
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-menu-toggle"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "autoHide": {
            "type": Boolean,
            "attr": "auto-hide"
        },
        "doc": {
            "context": "document"
        },
        "menu": {
            "type": String,
            "attr": "menu"
        },
        "visible": {
            "state": true
        }
    }; }
    static get listeners() { return [{
            "name": "click",
            "method": "onClick"
        }, {
            "name": "body:ionMenuChange",
            "method": "updateVisibility"
        }, {
            "name": "body:ionSplitPaneVisible",
            "method": "updateVisibility"
        }]; }
    static get style() { return "/**style-placeholder:ion-menu-toggle:**/"; }
}
function getMenuController(doc) {
    const menuControllerElement = doc.querySelector('ion-menu-controller');
    if (!menuControllerElement) {
        return Promise.resolve(undefined);
    }
    return menuControllerElement.componentOnReady();
}

import { menuOverlayAnimation } from './animations/overlay';
import { menuPushAnimation } from './animations/push';
import { menuRevealAnimation } from './animations/reveal';
export class MenuController {
    constructor() {
        this.menus = [];
        this.menuAnimations = new Map();
        this.registerAnimation('reveal', menuRevealAnimation);
        this.registerAnimation('push', menuPushAnimation);
        this.registerAnimation('overlay', menuOverlayAnimation);
    }
    async open(menuId) {
        const menu = await this.get(menuId);
        if (menu) {
            return menu.open();
        }
        return false;
    }
    async close(menuId) {
        const menu = await (menuId !== undefined ? this.get(menuId) : this.getOpen());
        if (menu !== undefined) {
            return menu.close();
        }
        return false;
    }
    async toggle(menuId) {
        const menu = await this.get(menuId);
        if (menu) {
            return menu.toggle();
        }
        return false;
    }
    async enable(shouldEnable, menuId) {
        const menu = await this.get(menuId);
        if (menu) {
            menu.disabled = !shouldEnable;
        }
        return menu;
    }
    async swipeGesture(shouldEnable, menuId) {
        const menu = await this.get(menuId);
        if (menu) {
            menu.swipeGesture = shouldEnable;
        }
        return menu;
    }
    async isOpen(menuId) {
        if (menuId != null) {
            const menu = await this.get(menuId);
            return (menu !== undefined && menu.isOpen());
        }
        else {
            const menu = await this.getOpen();
            return menu !== undefined;
        }
    }
    async isEnabled(menuId) {
        const menu = await this.get(menuId);
        if (menu) {
            return !menu.disabled;
        }
        return false;
    }
    async get(menuId) {
        if (Build.isDev) {
            if (menuId === 'left') {
                console.error('menu.side=left is deprecated, use "start" instead');
                return undefined;
            }
            if (menuId === 'right') {
                console.error('menu.side=right is deprecated, use "end" instead');
                return undefined;
            }
        }
        await this.waitUntilReady();
        if (menuId === 'start' || menuId === 'end') {
            const menuRef = this.find(m => m.side === menuId && !m.disabled);
            if (menuRef) {
                return menuRef;
            }
            return this.find(m => m.side === menuId);
        }
        else if (menuId != null) {
            return this.find(m => m.menuId === menuId);
        }
        const menu = this.find(m => !m.disabled);
        if (menu) {
            return menu;
        }
        return this.menus.length > 0 ? this.menus[0].el : undefined;
    }
    async getOpen() {
        await this.waitUntilReady();
        return this.getOpenSync();
    }
    async getMenus() {
        await this.waitUntilReady();
        return this.getMenusSync();
    }
    async isAnimating() {
        await this.waitUntilReady();
        return this.isAnimatingSync();
    }
    registerAnimation(name, animation) {
        this.menuAnimations.set(name, animation);
    }
    _getInstance() {
        return Promise.resolve(this);
    }
    _register(menu) {
        const menus = this.menus;
        if (menus.indexOf(menu) < 0) {
            if (!menu.disabled) {
                this._setActiveMenu(menu);
            }
            menus.push(menu);
        }
    }
    _unregister(menu) {
        const index = this.menus.indexOf(menu);
        if (index > -1) {
            this.menus.splice(index, 1);
        }
    }
    _setActiveMenu(menu) {
        const side = menu.side;
        this.menus
            .filter(m => m.side === side && m !== menu)
            .forEach(m => m.disabled = true);
    }
    async _setOpen(menu, shouldOpen, animated) {
        if (this.isAnimatingSync()) {
            return false;
        }
        if (shouldOpen) {
            const openedMenu = await this.getOpen();
            if (openedMenu && menu.el !== openedMenu) {
                await openedMenu.setOpen(false, false);
            }
        }
        return menu._setOpen(shouldOpen, animated);
    }
    _createAnimation(type, menuCmp) {
        const animationBuilder = this.menuAnimations.get(type);
        if (!animationBuilder) {
            return Promise.reject('animation not registered');
        }
        return this.animationCtrl.create(animationBuilder, null, menuCmp);
    }
    getOpenSync() {
        return this.find(m => m._isOpen);
    }
    getMenusSync() {
        return this.menus.map(menu => menu.el);
    }
    isAnimatingSync() {
        return this.menus.some(menu => menu.isAnimating);
    }
    find(predicate) {
        const instance = this.menus.find(predicate);
        if (instance !== undefined) {
            return instance.el;
        }
        return undefined;
    }
    waitUntilReady() {
        return Promise.all(Array.from(this.doc.querySelectorAll('ion-menu'))
            .map(menu => menu.componentOnReady()));
    }
    static get is() { return "ion-menu-controller"; }
    static get properties() { return {
        "_getInstance": {
            "method": true
        },
        "animationCtrl": {
            "connect": "ion-animation-controller"
        },
        "close": {
            "method": true
        },
        "doc": {
            "context": "document"
        },
        "enable": {
            "method": true
        },
        "get": {
            "method": true
        },
        "getMenus": {
            "method": true
        },
        "getOpen": {
            "method": true
        },
        "isAnimating": {
            "method": true
        },
        "isEnabled": {
            "method": true
        },
        "isOpen": {
            "method": true
        },
        "open": {
            "method": true
        },
        "registerAnimation": {
            "method": true
        },
        "swipeGesture": {
            "method": true
        },
        "toggle": {
            "method": true
        }
    }; }
    static get style() { return "/**style-placeholder:ion-menu-controller:**/"; }
}

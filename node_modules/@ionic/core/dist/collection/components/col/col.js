import { matchBreakpoint } from '../../utils/media';
const win = window;
const SUPPORTS_VARS = !!(win.CSS && win.CSS.supports && win.CSS.supports('--a: 0'));
const BREAKPOINTS = ['', 'xs', 'sm', 'md', 'lg', 'xl'];
export class Col {
    onResize() {
        this.el.forceUpdate();
    }
    getColumns(property) {
        let matched;
        for (const breakpoint of BREAKPOINTS) {
            const matches = matchBreakpoint(this.win, breakpoint);
            const columns = this[property + breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)];
            if (matches && columns !== undefined) {
                matched = columns;
            }
        }
        return matched;
    }
    calculateSize() {
        const columns = this.getColumns('size');
        if (!columns || columns === '') {
            return;
        }
        const colSize = (columns === 'auto')
            ? 'auto'
            : SUPPORTS_VARS ? `calc(calc(${columns} / var(--ion-grid-columns, 12)) * 100%)`
                : ((columns / 12) * 100) + '%';
        return {
            'flex': `0 0 ${colSize}`,
            'width': `${colSize}`,
            'max-width': `${colSize}`
        };
    }
    calculatePosition(property, modifier) {
        const columns = this.getColumns(property);
        if (!columns) {
            return;
        }
        const amount = SUPPORTS_VARS
            ? `calc(calc(${columns} / var(--ion-grid-columns, 12)) * 100%)`
            : (columns > 0 && columns < 12) ? (columns / 12 * 100) + '%' : 'auto';
        return {
            [modifier]: amount
        };
    }
    calculateOffset() {
        return this.calculatePosition('offset', 'margin-left');
    }
    calculatePull() {
        return this.calculatePosition('pull', 'right');
    }
    calculatePush() {
        return this.calculatePosition('push', 'left');
    }
    hostData() {
        return {
            style: Object.assign({}, this.calculateOffset(), this.calculatePull(), this.calculatePush(), this.calculateSize())
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-col"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "offset": {
            "type": String,
            "attr": "offset"
        },
        "offsetLg": {
            "type": String,
            "attr": "offset-lg"
        },
        "offsetMd": {
            "type": String,
            "attr": "offset-md"
        },
        "offsetSm": {
            "type": String,
            "attr": "offset-sm"
        },
        "offsetXl": {
            "type": String,
            "attr": "offset-xl"
        },
        "offsetXs": {
            "type": String,
            "attr": "offset-xs"
        },
        "pull": {
            "type": String,
            "attr": "pull"
        },
        "pullLg": {
            "type": String,
            "attr": "pull-lg"
        },
        "pullMd": {
            "type": String,
            "attr": "pull-md"
        },
        "pullSm": {
            "type": String,
            "attr": "pull-sm"
        },
        "pullXl": {
            "type": String,
            "attr": "pull-xl"
        },
        "pullXs": {
            "type": String,
            "attr": "pull-xs"
        },
        "push": {
            "type": String,
            "attr": "push"
        },
        "pushLg": {
            "type": String,
            "attr": "push-lg"
        },
        "pushMd": {
            "type": String,
            "attr": "push-md"
        },
        "pushSm": {
            "type": String,
            "attr": "push-sm"
        },
        "pushXl": {
            "type": String,
            "attr": "push-xl"
        },
        "pushXs": {
            "type": String,
            "attr": "push-xs"
        },
        "size": {
            "type": String,
            "attr": "size"
        },
        "sizeLg": {
            "type": String,
            "attr": "size-lg"
        },
        "sizeMd": {
            "type": String,
            "attr": "size-md"
        },
        "sizeSm": {
            "type": String,
            "attr": "size-sm"
        },
        "sizeXl": {
            "type": String,
            "attr": "size-xl"
        },
        "sizeXs": {
            "type": String,
            "attr": "size-xs"
        },
        "win": {
            "context": "window"
        }
    }; }
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/**style-placeholder:ion-col:**/"; }
}

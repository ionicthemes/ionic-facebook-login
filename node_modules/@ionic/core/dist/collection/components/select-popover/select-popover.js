export class SelectPopover {
    constructor() {
        this.options = [];
    }
    onSelect(ev) {
        const option = this.options.find(o => o.value === ev.target.value);
        if (option && option.handler) {
            option.handler();
        }
    }
    render() {
        return (h("ion-list", null,
            this.header !== undefined && h("ion-list-header", null, this.header),
            (this.subHeader !== undefined || this.message !== undefined) &&
                h("ion-item", null,
                    h("ion-label", { "text-wrap": true },
                        this.subHeader !== undefined && h("h3", null, this.subHeader),
                        this.message !== undefined && h("p", null, this.message))),
            h("ion-radio-group", null, this.options.map(option => h("ion-item", null,
                h("ion-label", null, option.text),
                h("ion-radio", { checked: option.checked, value: option.value, disabled: option.disabled }))))));
    }
    static get is() { return "ion-select-popover"; }
    static get encapsulation() { return "scoped"; }
    static get properties() { return {
        "header": {
            "type": String,
            "attr": "header"
        },
        "message": {
            "type": String,
            "attr": "message"
        },
        "options": {
            "type": "Any",
            "attr": "options"
        },
        "subHeader": {
            "type": String,
            "attr": "sub-header"
        }
    }; }
    static get listeners() { return [{
            "name": "ionSelect",
            "method": "onSelect"
        }]; }
    static get style() { return "/**style-placeholder:ion-select-popover:**/"; }
}

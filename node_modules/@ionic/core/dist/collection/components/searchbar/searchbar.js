import { debounceEvent } from '../../utils/helpers';
import { createColorClasses } from '../../utils/theme';
export class Searchbar {
    constructor() {
        this.isCancelVisible = false;
        this.shouldAlignLeft = true;
        this.focused = false;
        this.noAnimate = true;
        this.animated = false;
        this.autocomplete = 'off';
        this.autocorrect = 'off';
        this.cancelButtonIcon = 'md-arrow-back';
        this.cancelButtonText = 'Cancel';
        this.debounce = 250;
        this.placeholder = 'Search';
        this.searchIcon = 'search';
        this.showCancelButton = false;
        this.spellcheck = false;
        this.type = 'search';
        this.value = '';
        this.onClearInput = (ev) => {
            this.ionClear.emit();
            if (ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            setTimeout(() => {
                const value = this.getValue();
                if (value !== '') {
                    this.value = '';
                    this.ionInput.emit();
                }
            }, 16 * 4);
        };
        this.onCancelSearchbar = (ev) => {
            if (ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            this.ionCancel.emit();
            this.onClearInput();
            if (this.nativeInput) {
                this.nativeInput.blur();
            }
        };
        this.onInput = (ev) => {
            const input = ev.target;
            if (input) {
                this.value = input.value;
            }
            this.ionInput.emit(ev);
        };
        this.onBlur = () => {
            this.focused = false;
            this.ionBlur.emit();
            this.positionElements();
        };
        this.onFocus = () => {
            this.focused = true;
            this.ionFocus.emit();
            this.positionElements();
        };
    }
    debounceChanged() {
        this.ionChange = debounceEvent(this.ionChange, this.debounce);
    }
    valueChanged() {
        const inputEl = this.nativeInput;
        const value = this.getValue();
        if (inputEl && inputEl.value !== value) {
            inputEl.value = value;
        }
        this.ionChange.emit({ value });
    }
    componentDidLoad() {
        this.positionElements();
        this.debounceChanged();
        setTimeout(() => {
            this.noAnimate = false;
        }, 300);
    }
    setFocus() {
        if (this.nativeInput) {
            this.nativeInput.focus();
        }
    }
    positionElements() {
        const value = this.getValue();
        const prevAlignLeft = this.shouldAlignLeft;
        const shouldAlignLeft = (!this.animated || value.trim() !== '' || !!this.focused);
        this.shouldAlignLeft = shouldAlignLeft;
        if (this.mode !== 'ios') {
            return;
        }
        if (prevAlignLeft !== shouldAlignLeft) {
            this.positionPlaceholder();
        }
        if (this.animated) {
            this.positionCancelButton();
        }
    }
    positionPlaceholder() {
        const inputEl = this.nativeInput;
        if (!inputEl) {
            return;
        }
        const isRTL = this.doc.dir === 'rtl';
        const iconEl = (this.el.shadowRoot || this.el).querySelector('.searchbar-search-icon');
        if (this.shouldAlignLeft) {
            inputEl.removeAttribute('style');
            iconEl.removeAttribute('style');
        }
        else {
            const doc = this.doc;
            const tempSpan = doc.createElement('span');
            tempSpan.innerHTML = this.placeholder;
            doc.body.appendChild(tempSpan);
            const textWidth = tempSpan.offsetWidth;
            tempSpan.remove();
            const inputLeft = 'calc(50% - ' + (textWidth / 2) + 'px)';
            const iconLeft = 'calc(50% - ' + ((textWidth / 2) + 30) + 'px)';
            if (isRTL) {
                inputEl.style.paddingRight = inputLeft;
                iconEl.style.marginRight = iconLeft;
            }
            else {
                inputEl.style.paddingLeft = inputLeft;
                iconEl.style.marginLeft = iconLeft;
            }
        }
    }
    positionCancelButton() {
        const isRTL = this.doc.dir === 'rtl';
        const cancelButton = (this.el.shadowRoot || this.el).querySelector('.searchbar-cancel-button');
        const shouldShowCancel = this.focused;
        if (cancelButton && shouldShowCancel !== this.isCancelVisible) {
            const cancelStyle = cancelButton.style;
            this.isCancelVisible = shouldShowCancel;
            if (shouldShowCancel) {
                if (isRTL) {
                    cancelStyle.marginLeft = '0';
                }
                else {
                    cancelStyle.marginRight = '0';
                }
            }
            else {
                const offset = cancelButton.offsetWidth;
                if (offset > 0) {
                    if (isRTL) {
                        cancelStyle.marginLeft = -offset + 'px';
                    }
                    else {
                        cancelStyle.marginRight = -offset + 'px';
                    }
                }
            }
        }
    }
    getValue() {
        return this.value || '';
    }
    hostData() {
        const animated = this.animated && this.config.getBoolean('animated', true);
        return {
            class: Object.assign({}, createColorClasses(this.color), { 'searchbar-animated': animated, 'searchbar-no-animate': animated && this.noAnimate, 'searchbar-has-value': (this.getValue() !== ''), 'searchbar-show-cancel': this.showCancelButton, 'searchbar-left-aligned': this.shouldAlignLeft, 'searchbar-has-focus': this.focused })
        };
    }
    render() {
        const clearIcon = this.clearIcon || (this.mode === 'ios' ? 'ios-close-circle' : 'md-close');
        const searchIcon = this.searchIcon;
        const cancelButton = this.showCancelButton && (h("button", { type: "button", tabIndex: this.mode === 'ios' && !this.focused ? -1 : undefined, onMouseDown: this.onCancelSearchbar, onTouchStart: this.onCancelSearchbar, class: "searchbar-cancel-button" }, this.mode === 'md'
            ? h("ion-icon", { mode: this.mode, icon: this.cancelButtonIcon, lazy: false })
            : this.cancelButtonText));
        return [
            h("div", { class: "searchbar-input-container" },
                h("input", { ref: el => this.nativeInput = el, class: "searchbar-input", onInput: this.onInput, onBlur: this.onBlur, onFocus: this.onFocus, placeholder: this.placeholder, type: this.type, value: this.getValue(), autoComplete: this.autocomplete, autoCorrect: this.autocorrect, spellCheck: this.spellcheck }),
                this.mode === 'md' && cancelButton,
                h("ion-icon", { mode: this.mode, icon: searchIcon, lazy: false, class: "searchbar-search-icon" }),
                h("button", { type: "button", "no-blur": true, class: "searchbar-clear-button", onMouseDown: this.onClearInput, onTouchStart: this.onClearInput },
                    h("ion-icon", { mode: this.mode, icon: clearIcon, lazy: false, class: "searchbar-clear-icon" }))),
            this.mode === 'ios' && cancelButton
        ];
    }
    static get is() { return "ion-searchbar"; }
    static get encapsulation() { return "scoped"; }
    static get properties() { return {
        "animated": {
            "type": Boolean,
            "attr": "animated"
        },
        "autocomplete": {
            "type": String,
            "attr": "autocomplete"
        },
        "autocorrect": {
            "type": String,
            "attr": "autocorrect"
        },
        "cancelButtonIcon": {
            "type": String,
            "attr": "cancel-button-icon"
        },
        "cancelButtonText": {
            "type": String,
            "attr": "cancel-button-text"
        },
        "clearIcon": {
            "type": String,
            "attr": "clear-icon"
        },
        "color": {
            "type": String,
            "attr": "color"
        },
        "config": {
            "context": "config"
        },
        "debounce": {
            "type": Number,
            "attr": "debounce",
            "watchCallbacks": ["debounceChanged"]
        },
        "doc": {
            "context": "document"
        },
        "el": {
            "elementRef": true
        },
        "focused": {
            "state": true
        },
        "mode": {
            "type": String,
            "attr": "mode"
        },
        "noAnimate": {
            "state": true
        },
        "placeholder": {
            "type": String,
            "attr": "placeholder"
        },
        "searchIcon": {
            "type": String,
            "attr": "search-icon"
        },
        "setFocus": {
            "method": true
        },
        "showCancelButton": {
            "type": Boolean,
            "attr": "show-cancel-button"
        },
        "spellcheck": {
            "type": Boolean,
            "attr": "spellcheck"
        },
        "type": {
            "type": String,
            "attr": "type"
        },
        "value": {
            "type": String,
            "attr": "value",
            "mutable": true,
            "watchCallbacks": ["valueChanged"]
        }
    }; }
    static get events() { return [{
            "name": "ionInput",
            "method": "ionInput",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionChange",
            "method": "ionChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionCancel",
            "method": "ionCancel",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionClear",
            "method": "ionClear",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionBlur",
            "method": "ionBlur",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionFocus",
            "method": "ionFocus",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:ion-searchbar:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-searchbar:**/"; }
}

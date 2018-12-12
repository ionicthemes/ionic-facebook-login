import { isEndSide } from '../../utils/helpers';
export class ItemOptions {
    constructor() {
        this.side = 'end';
    }
    fireSwipeEvent() {
        this.ionSwipe.emit({
            side: this.side
        });
    }
    hostData() {
        const isEnd = isEndSide(this.win, this.side);
        return {
            class: {
                'item-options-start': !isEnd,
                'item-options-end': isEnd
            }
        };
    }
    static get is() { return "ion-item-options"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "fireSwipeEvent": {
            "method": true
        },
        "side": {
            "type": String,
            "attr": "side"
        },
        "win": {
            "context": "window"
        }
    }; }
    static get events() { return [{
            "name": "ionSwipe",
            "method": "ionSwipe",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:ion-item-options:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-item-options:**/"; }
}

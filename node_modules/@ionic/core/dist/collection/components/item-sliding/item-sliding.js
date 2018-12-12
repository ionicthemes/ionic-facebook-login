const SWIPE_MARGIN = 30;
const ELASTIC_FACTOR = 0.55;
let openSlidingItem;
export class ItemSliding {
    constructor() {
        this.item = null;
        this.openAmount = 0;
        this.initialOpenAmount = 0;
        this.optsWidthRightSide = 0;
        this.optsWidthLeftSide = 0;
        this.sides = 0;
        this.optsDirty = true;
        this.state = 2;
        this.disabled = false;
    }
    disabledChanged() {
        if (this.gesture) {
            this.gesture.setDisabled(this.disabled);
        }
    }
    async componentDidLoad() {
        this.item = this.el.querySelector('ion-item');
        await this.updateOptions();
        this.gesture = (await import('../../utils/gesture/gesture')).createGesture({
            el: this.el,
            queue: this.queue,
            gestureName: 'item-swipe',
            gesturePriority: 100,
            threshold: 5,
            canStart: () => this.canStart(),
            onStart: () => this.onStart(),
            onMove: ev => this.onMove(ev),
            onEnd: ev => this.onEnd(ev),
        });
        this.disabledChanged();
    }
    componentDidUnload() {
        if (this.gesture) {
            this.gesture.destroy();
        }
        this.item = null;
        this.leftOptions = this.rightOptions = undefined;
    }
    getOpenAmount() {
        return Promise.resolve(this.openAmount);
    }
    getSlidingRatio() {
        return Promise.resolve(this.getSlidingRatioSync());
    }
    async close() {
        this.setOpenAmount(0, true);
    }
    async closeOpened() {
        if (openSlidingItem !== undefined) {
            openSlidingItem.close();
            return true;
        }
        return false;
    }
    async updateOptions() {
        const options = this.el.querySelectorAll('ion-item-options');
        let sides = 0;
        this.leftOptions = this.rightOptions = undefined;
        for (let i = 0; i < options.length; i++) {
            const option = await options.item(i).componentOnReady();
            if (option.side === 'start') {
                this.leftOptions = option;
                sides |= 1;
            }
            else {
                this.rightOptions = option;
                sides |= 2;
            }
        }
        this.optsDirty = true;
        this.sides = sides;
    }
    canStart() {
        const selected = openSlidingItem;
        if (selected && selected !== this.el) {
            this.closeOpened();
            return false;
        }
        return !!(this.rightOptions || this.leftOptions);
    }
    onStart() {
        openSlidingItem = this.el;
        if (this.tmr !== undefined) {
            clearTimeout(this.tmr);
            this.tmr = undefined;
        }
        if (this.openAmount === 0) {
            this.optsDirty = true;
            this.state = 4;
        }
        this.initialOpenAmount = this.openAmount;
        if (this.item) {
            this.item.style.transition = 'none';
        }
    }
    onMove(gesture) {
        if (this.optsDirty) {
            this.calculateOptsWidth();
        }
        let openAmount = this.initialOpenAmount - gesture.deltaX;
        switch (this.sides) {
            case 2:
                openAmount = Math.max(0, openAmount);
                break;
            case 1:
                openAmount = Math.min(0, openAmount);
                break;
            case 3: break;
            case 0: return;
            default:
                console.warn('invalid ItemSideFlags value', this.sides);
                break;
        }
        let optsWidth;
        if (openAmount > this.optsWidthRightSide) {
            optsWidth = this.optsWidthRightSide;
            openAmount = optsWidth + (openAmount - optsWidth) * ELASTIC_FACTOR;
        }
        else if (openAmount < -this.optsWidthLeftSide) {
            optsWidth = -this.optsWidthLeftSide;
            openAmount = optsWidth + (openAmount - optsWidth) * ELASTIC_FACTOR;
        }
        this.setOpenAmount(openAmount, false);
    }
    onEnd(gesture) {
        const velocity = gesture.velocityX;
        let restingPoint = (this.openAmount > 0)
            ? this.optsWidthRightSide
            : -this.optsWidthLeftSide;
        const isResetDirection = (this.openAmount > 0) === !(velocity < 0);
        const isMovingFast = Math.abs(velocity) > 0.3;
        const isOnCloseZone = Math.abs(this.openAmount) < Math.abs(restingPoint / 2);
        if (swipeShouldReset(isResetDirection, isMovingFast, isOnCloseZone)) {
            restingPoint = 0;
        }
        const state = this.state;
        this.setOpenAmount(restingPoint, true);
        if ((state & 32) !== 0 && this.rightOptions) {
            this.rightOptions.fireSwipeEvent();
        }
        else if ((state & 64) !== 0 && this.leftOptions) {
            this.leftOptions.fireSwipeEvent();
        }
    }
    calculateOptsWidth() {
        this.optsWidthRightSide = 0;
        if (this.rightOptions) {
            this.optsWidthRightSide = this.rightOptions.offsetWidth;
        }
        this.optsWidthLeftSide = 0;
        if (this.leftOptions) {
            this.optsWidthLeftSide = this.leftOptions.offsetWidth;
        }
        this.optsDirty = false;
    }
    setOpenAmount(openAmount, isFinal) {
        if (this.tmr !== undefined) {
            clearTimeout(this.tmr);
            this.tmr = undefined;
        }
        if (!this.item) {
            return;
        }
        const style = this.item.style;
        this.openAmount = openAmount;
        if (isFinal) {
            style.transition = '';
        }
        if (openAmount > 0) {
            this.state = (openAmount >= (this.optsWidthRightSide + SWIPE_MARGIN))
                ? 8 | 32
                : 8;
        }
        else if (openAmount < 0) {
            this.state = (openAmount <= (-this.optsWidthLeftSide - SWIPE_MARGIN))
                ? 16 | 64
                : 16;
        }
        else {
            this.tmr = window.setTimeout(() => {
                this.state = 2;
                this.tmr = undefined;
            }, 600);
            openSlidingItem = undefined;
            style.transform = '';
            return;
        }
        style.transform = `translate3d(${-openAmount}px,0,0)`;
        this.ionDrag.emit({
            amount: openAmount,
            ratio: this.getSlidingRatioSync()
        });
    }
    getSlidingRatioSync() {
        if (this.openAmount > 0) {
            return this.openAmount / this.optsWidthRightSide;
        }
        else if (this.openAmount < 0) {
            return this.openAmount / this.optsWidthLeftSide;
        }
        else {
            return 0;
        }
    }
    hostData() {
        return {
            class: {
                'item-sliding-active-slide': (this.state !== 2),
                'item-sliding-active-options-end': (this.state & 8) !== 0,
                'item-sliding-active-options-start': (this.state & 16) !== 0,
                'item-sliding-active-swipe-end': (this.state & 32) !== 0,
                'item-sliding-active-swipe-start': (this.state & 64) !== 0
            }
        };
    }
    static get is() { return "ion-item-sliding"; }
    static get properties() { return {
        "close": {
            "method": true
        },
        "closeOpened": {
            "method": true
        },
        "disabled": {
            "type": Boolean,
            "attr": "disabled",
            "watchCallbacks": ["disabledChanged"]
        },
        "el": {
            "elementRef": true
        },
        "getOpenAmount": {
            "method": true
        },
        "getSlidingRatio": {
            "method": true
        },
        "queue": {
            "context": "queue"
        },
        "state": {
            "state": true
        }
    }; }
    static get events() { return [{
            "name": "ionDrag",
            "method": "ionDrag",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:ion-item-sliding:**/"; }
}
function swipeShouldReset(isResetDirection, isMovingFast, isOnResetZone) {
    return (!isMovingFast && isOnResetZone) || (isResetDirection && isMovingFast);
}

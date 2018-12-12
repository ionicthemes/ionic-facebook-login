export class InfiniteScroll {
    constructor() {
        this.thrPx = 0;
        this.thrPc = 0;
        this.didFire = false;
        this.isBusy = false;
        this.isLoading = false;
        this.threshold = '15%';
        this.disabled = false;
        this.position = 'bottom';
    }
    thresholdChanged(val) {
        if (val.lastIndexOf('%') > -1) {
            this.thrPx = 0;
            this.thrPc = (parseFloat(val) / 100);
        }
        else {
            this.thrPx = parseFloat(val);
            this.thrPc = 0;
        }
    }
    disabledChanged(val) {
        if (this.disabled) {
            this.isLoading = false;
            this.isBusy = false;
        }
        this.enableScrollEvents(!val);
    }
    async componentDidLoad() {
        const contentEl = this.el.closest('ion-content');
        if (contentEl) {
            await contentEl.componentOnReady();
            this.scrollEl = await contentEl.getScrollElement();
        }
        this.thresholdChanged(this.threshold);
        this.enableScrollEvents(!this.disabled);
        if (this.position === 'top') {
            this.queue.write(() => {
                if (this.scrollEl) {
                    this.scrollEl.scrollTop = this.scrollEl.scrollHeight - this.scrollEl.clientHeight;
                }
            });
        }
    }
    componentDidUnload() {
        this.scrollEl = undefined;
    }
    onScroll() {
        const scrollEl = this.scrollEl;
        if (!scrollEl || !this.canStart()) {
            return 1;
        }
        const infiniteHeight = this.el.offsetHeight;
        if (infiniteHeight === 0) {
            return 2;
        }
        const scrollTop = scrollEl.scrollTop;
        const scrollHeight = scrollEl.scrollHeight;
        const height = scrollEl.offsetHeight;
        const threshold = this.thrPc !== 0 ? (height * this.thrPc) : this.thrPx;
        const distanceFromInfinite = (this.position === 'bottom')
            ? scrollHeight - infiniteHeight - scrollTop - threshold - height
            : scrollTop - infiniteHeight - threshold;
        if (distanceFromInfinite < 0) {
            if (!this.didFire) {
                this.isLoading = true;
                this.didFire = true;
                this.ionInfinite.emit();
                return 3;
            }
        }
        else {
            this.didFire = false;
        }
        return 4;
    }
    complete() {
        const scrollEl = this.scrollEl;
        if (!this.isLoading || !scrollEl) {
            return;
        }
        this.isLoading = false;
        if (this.position === 'top') {
            this.isBusy = true;
            const prev = scrollEl.scrollHeight - scrollEl.scrollTop;
            requestAnimationFrame(() => {
                this.queue.read(() => {
                    const scrollHeight = scrollEl.scrollHeight;
                    const newScrollTop = scrollHeight - prev;
                    requestAnimationFrame(() => {
                        this.queue.write(() => {
                            scrollEl.scrollTop = newScrollTop;
                            this.isBusy = false;
                        });
                    });
                });
            });
        }
    }
    canStart() {
        return (!this.disabled &&
            !this.isBusy &&
            !!this.scrollEl &&
            !this.isLoading);
    }
    enableScrollEvents(shouldListen) {
        if (this.scrollEl) {
            this.enableListener(this, 'scroll', shouldListen, this.scrollEl);
        }
    }
    hostData() {
        return {
            class: {
                'infinite-scroll-loading': this.isLoading,
                'infinite-scroll-enabled': !this.disabled
            }
        };
    }
    static get is() { return "ion-infinite-scroll"; }
    static get properties() { return {
        "complete": {
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
        "enableListener": {
            "context": "enableListener"
        },
        "isLoading": {
            "state": true
        },
        "position": {
            "type": String,
            "attr": "position"
        },
        "queue": {
            "context": "queue"
        },
        "threshold": {
            "type": String,
            "attr": "threshold",
            "watchCallbacks": ["thresholdChanged"]
        }
    }; }
    static get events() { return [{
            "name": "ionInfinite",
            "method": "ionInfinite",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "scroll",
            "method": "onScroll",
            "disabled": true,
            "passive": true
        }]; }
    static get style() { return "/**style-placeholder:ion-infinite-scroll:**/"; }
}

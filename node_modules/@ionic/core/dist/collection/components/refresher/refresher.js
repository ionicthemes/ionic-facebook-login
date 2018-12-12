import { createThemedClasses } from '../../utils/theme';
export class Refresher {
    constructor() {
        this.appliedStyles = false;
        this.didStart = false;
        this.progress = 0;
        this.state = 1;
        this.pullMin = 60;
        this.pullMax = this.pullMin + 60;
        this.closeDuration = '280ms';
        this.snapbackDuration = '280ms';
        this.disabled = false;
    }
    disabledChanged() {
        if (this.gesture) {
            this.gesture.setDisabled(this.disabled);
        }
    }
    async componentDidLoad() {
        if (this.el.getAttribute('slot') !== 'fixed') {
            console.error('Make sure you use: <ion-refresher slot="fixed">');
            return;
        }
        const contentEl = this.el.closest('ion-content');
        if (contentEl) {
            await contentEl.componentOnReady();
            this.scrollEl = await contentEl.getScrollElement();
        }
        else {
            console.error('ion-refresher did not attach, make sure the parent is an ion-content.');
        }
        this.gesture = (await import('../../utils/gesture/gesture')).createGesture({
            el: this.el.closest('ion-content'),
            queue: this.queue,
            gestureName: 'refresher',
            gesturePriority: 10,
            direction: 'y',
            threshold: 20,
            passive: false,
            canStart: () => this.canStart(),
            onStart: () => this.onStart(),
            onMove: ev => this.onMove(ev),
            onEnd: () => this.onEnd(),
        });
        this.disabledChanged();
    }
    componentDidUnload() {
        this.scrollEl = undefined;
    }
    complete() {
        this.close(32, '120ms');
    }
    cancel() {
        this.close(16, '');
    }
    getProgress() {
        return Promise.resolve(this.progress);
    }
    canStart() {
        if (!this.scrollEl) {
            return false;
        }
        if (this.state !== 1) {
            return false;
        }
        if (this.scrollEl.scrollTop > 0) {
            return false;
        }
        return true;
    }
    onStart() {
        console.log('start');
        this.progress = 0;
        this.state = 1;
    }
    onMove(detail) {
        if (!this.scrollEl) {
            return;
        }
        const ev = detail.event;
        if (ev.touches && ev.touches.length > 1) {
            return;
        }
        if ((this.state & 56) !== 0) {
            return;
        }
        const deltaY = detail.deltaY;
        if (deltaY <= 0) {
            this.progress = 0;
            this.state = 1;
            if (this.appliedStyles) {
                this.setCss(0, '', false, '');
                return;
            }
            return;
        }
        if (this.state === 1) {
            const scrollHostScrollTop = this.scrollEl.scrollTop;
            if (scrollHostScrollTop > 0) {
                this.progress = 0;
                return;
            }
            this.state = 2;
        }
        ev.preventDefault();
        this.setCss(deltaY, '0ms', true, '');
        if (deltaY === 0) {
            this.progress = 0;
            return;
        }
        const pullMin = this.pullMin;
        this.progress = deltaY / pullMin;
        if (!this.didStart) {
            this.didStart = true;
            this.ionStart.emit();
        }
        this.ionPull.emit();
        if (deltaY < pullMin) {
            this.state = 2;
            return;
        }
        if (deltaY > this.pullMax) {
            this.beginRefresh();
            return;
        }
        this.state = 4;
        return;
    }
    onEnd() {
        if (this.state === 4) {
            this.beginRefresh();
        }
        else if (this.state === 2) {
            this.cancel();
        }
    }
    beginRefresh() {
        this.state = 8;
        this.setCss(this.pullMin, this.snapbackDuration, true, '');
        this.ionRefresh.emit({
            complete: this.complete.bind(this)
        });
    }
    close(state, delay) {
        setTimeout(() => {
            this.state = 1;
            this.progress = 0;
            this.didStart = false;
            this.setCss(0, '0ms', false, '');
        }, 600);
        this.state = state;
        this.setCss(0, '', true, delay);
    }
    setCss(y, duration, overflowVisible, delay) {
        this.appliedStyles = (y > 0);
        this.queue.write(() => {
            if (this.scrollEl) {
                const style = this.scrollEl.style;
                style.transform = ((y > 0) ? `translateY(${y}px) translateZ(0px)` : 'translateZ(0px)');
                style.transitionDuration = duration;
                style.transitionDelay = delay;
                style.overflow = (overflowVisible ? 'hidden' : '');
            }
        });
    }
    hostData() {
        return {
            slot: 'fixed',
            class: Object.assign({}, createThemedClasses(this.mode, 'refresher'), { 'refresher-active': this.state !== 1, 'refresher-pulling': this.state === 2, 'refresher-ready': this.state === 4, 'refresher-refreshing': this.state === 8, 'refresher-cancelling': this.state === 16, 'refresher-completing': this.state === 32 })
        };
    }
    static get is() { return "ion-refresher"; }
    static get properties() { return {
        "cancel": {
            "method": true
        },
        "closeDuration": {
            "type": String,
            "attr": "close-duration"
        },
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
        "getProgress": {
            "method": true
        },
        "pullMax": {
            "type": Number,
            "attr": "pull-max"
        },
        "pullMin": {
            "type": Number,
            "attr": "pull-min"
        },
        "queue": {
            "context": "queue"
        },
        "snapbackDuration": {
            "type": String,
            "attr": "snapback-duration"
        },
        "state": {
            "state": true
        }
    }; }
    static get events() { return [{
            "name": "ionRefresh",
            "method": "ionRefresh",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionPull",
            "method": "ionPull",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionStart",
            "method": "ionStart",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:ion-refresher:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-refresher:**/"; }
}

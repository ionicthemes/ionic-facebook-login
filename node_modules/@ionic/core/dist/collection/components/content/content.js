import { isPlatform } from '../../utils/platform';
import { createColorClasses, hostContext } from '../../utils/theme';
export class Content {
    constructor() {
        this.isScrolling = false;
        this.lastScroll = 0;
        this.queued = false;
        this.cTop = -1;
        this.cBottom = -1;
        this.detail = {
            scrollTop: 0,
            scrollLeft: 0,
            type: 'scroll',
            event: undefined,
            startX: 0,
            startY: 0,
            startTimeStamp: 0,
            currentX: 0,
            currentY: 0,
            velocityX: 0,
            velocityY: 0,
            deltaX: 0,
            deltaY: 0,
            timeStamp: 0,
            data: undefined,
            isScrolling: true,
        };
        this.fullscreen = false;
        this.scrollX = false;
        this.scrollY = true;
        this.scrollEvents = false;
    }
    onNavChanged() {
        this.resize();
    }
    componentWillLoad() {
        if (this.forceOverscroll === undefined) {
            this.forceOverscroll = this.mode === 'ios' && isPlatform(this.win, 'mobile');
        }
    }
    componentDidLoad() {
        this.resize();
    }
    componentDidUnload() {
        if (this.watchDog) {
            clearInterval(this.watchDog);
        }
    }
    resize() {
        if (this.fullscreen) {
            this.queue.read(this.readDimensions.bind(this));
        }
        else if (this.cTop !== 0 || this.cBottom !== 0) {
            this.cTop = this.cBottom = 0;
            this.el.forceUpdate();
        }
    }
    readDimensions() {
        const page = getPageElement(this.el);
        const top = Math.max(this.el.offsetTop, 0);
        const bottom = Math.max(page.offsetHeight - top - this.el.offsetHeight, 0);
        const dirty = top !== this.cTop || bottom !== this.cBottom;
        if (dirty) {
            this.cTop = top;
            this.cBottom = bottom;
            this.el.forceUpdate();
        }
    }
    onScroll(ev) {
        const timeStamp = Date.now();
        const shouldStart = !this.isScrolling;
        this.lastScroll = timeStamp;
        if (shouldStart) {
            this.onScrollStart();
        }
        if (!this.queued && this.scrollEvents) {
            this.queued = true;
            this.queue.read(ts => {
                this.queued = false;
                this.detail.event = ev;
                updateScrollDetail(this.detail, this.scrollEl, ts, shouldStart);
                this.ionScroll.emit(this.detail);
            });
        }
    }
    getScrollElement() {
        return Promise.resolve(this.scrollEl);
    }
    scrollToTop(duration = 0) {
        return this.scrollToPoint(undefined, 0, duration);
    }
    scrollToBottom(duration = 0) {
        const y = this.scrollEl.scrollHeight - this.scrollEl.clientHeight;
        return this.scrollToPoint(undefined, y, duration);
    }
    scrollByPoint(x, y, duration) {
        return this.scrollToPoint(x + this.scrollEl.scrollLeft, y + this.scrollEl.scrollTop, duration);
    }
    async scrollToPoint(x, y, duration = 0) {
        const el = this.scrollEl;
        if (duration < 32) {
            if (y != null) {
                el.scrollTop = y;
            }
            if (x != null) {
                el.scrollLeft = x;
            }
            return;
        }
        let resolve;
        let startTime = 0;
        const promise = new Promise(r => resolve = r);
        const fromY = el.scrollTop;
        const fromX = el.scrollLeft;
        const deltaY = y != null ? y - fromY : 0;
        const deltaX = x != null ? x - fromX : 0;
        const step = (timeStamp) => {
            const linearTime = Math.min(1, ((timeStamp - startTime) / duration)) - 1;
            const easedT = Math.pow(linearTime, 3) + 1;
            if (deltaY !== 0) {
                el.scrollTop = Math.floor((easedT * deltaY) + fromY);
            }
            if (deltaX !== 0) {
                el.scrollLeft = Math.floor((easedT * deltaX) + fromX);
            }
            if (easedT < 1) {
                requestAnimationFrame(step);
            }
            else {
                resolve();
            }
        };
        requestAnimationFrame(ts => {
            startTime = ts;
            step(ts);
        });
        return promise;
    }
    onScrollStart() {
        this.isScrolling = true;
        this.ionScrollStart.emit({
            isScrolling: true
        });
        if (this.watchDog) {
            clearInterval(this.watchDog);
        }
        this.watchDog = setInterval(() => {
            if (this.lastScroll < Date.now() - 120) {
                this.onScrollEnd();
            }
        }, 100);
    }
    onScrollEnd() {
        clearInterval(this.watchDog);
        this.watchDog = null;
        this.isScrolling = false;
        this.ionScrollEnd.emit({
            isScrolling: false
        });
    }
    hostData() {
        return {
            class: Object.assign({}, createColorClasses(this.color), { 'content-sizing': hostContext('ion-popover', this.el), 'overscroll': !!this.forceOverscroll }),
            style: {
                '--offset-top': `${this.cTop}px`,
                '--offset-bottom': `${this.cBottom}px`,
            }
        };
    }
    render() {
        const { scrollX, scrollY, forceOverscroll } = this;
        this.resize();
        return [
            h("div", { class: {
                    'inner-scroll': true,
                    'scroll-x': scrollX,
                    'scroll-y': scrollY,
                    'overscroll': (scrollX || scrollY) && !!forceOverscroll
                }, ref: el => this.scrollEl = el, onScroll: ev => this.onScroll(ev) },
                h("slot", null)),
            h("slot", { name: "fixed" })
        ];
    }
    static get is() { return "ion-content"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "color": {
            "type": String,
            "attr": "color"
        },
        "config": {
            "context": "config"
        },
        "el": {
            "elementRef": true
        },
        "forceOverscroll": {
            "type": Boolean,
            "attr": "force-overscroll",
            "mutable": true
        },
        "fullscreen": {
            "type": Boolean,
            "attr": "fullscreen"
        },
        "getScrollElement": {
            "method": true
        },
        "queue": {
            "context": "queue"
        },
        "scrollByPoint": {
            "method": true
        },
        "scrollEvents": {
            "type": Boolean,
            "attr": "scroll-events"
        },
        "scrollToBottom": {
            "method": true
        },
        "scrollToPoint": {
            "method": true
        },
        "scrollToTop": {
            "method": true
        },
        "scrollX": {
            "type": Boolean,
            "attr": "scroll-x"
        },
        "scrollY": {
            "type": Boolean,
            "attr": "scroll-y"
        },
        "win": {
            "context": "window"
        }
    }; }
    static get events() { return [{
            "name": "ionScrollStart",
            "method": "ionScrollStart",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionScroll",
            "method": "ionScroll",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionScrollEnd",
            "method": "ionScrollEnd",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "body:ionNavDidChange",
            "method": "onNavChanged"
        }]; }
    static get style() { return "/**style-placeholder:ion-content:**/"; }
}
function getParentElement(el) {
    if (el.parentElement) {
        return el.parentElement;
    }
    if (el.parentNode && el.parentNode.host) {
        return el.parentNode.host;
    }
    return null;
}
function getPageElement(el) {
    const tabs = el.closest('ion-tabs');
    if (tabs) {
        return tabs;
    }
    const page = el.closest('ion-app,ion-page,.ion-page,page-inner');
    if (page) {
        return page;
    }
    return getParentElement(el);
}
function updateScrollDetail(detail, el, timestamp, shouldStart) {
    const prevX = detail.currentX;
    const prevY = detail.currentY;
    const prevT = detail.timeStamp;
    const currentX = el.scrollLeft;
    const currentY = el.scrollTop;
    if (shouldStart) {
        detail.startTimeStamp = timestamp;
        detail.startX = currentX;
        detail.startY = currentY;
        detail.velocityX = detail.velocityY = 0;
    }
    detail.timeStamp = timestamp;
    detail.currentX = detail.scrollLeft = currentX;
    detail.currentY = detail.scrollTop = currentY;
    detail.deltaX = currentX - detail.startX;
    detail.deltaY = currentY - detail.startY;
    const timeDelta = timestamp - prevT;
    if (timeDelta > 0 && timeDelta < 100) {
        const velocityX = (currentX - prevX) / timeDelta;
        const velocityY = (currentY - prevY) / timeDelta;
        detail.velocityX = velocityX * 0.7 + detail.velocityX * 0.3;
        detail.velocityY = velocityY * 0.7 + detail.velocityY * 0.3;
    }
}

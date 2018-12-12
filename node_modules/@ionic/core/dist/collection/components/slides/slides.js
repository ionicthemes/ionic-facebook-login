import { rIC } from '../../utils/helpers.js';
import { createThemedClasses } from '../../utils/theme.js';
export class Slides {
    constructor() {
        this.didInit = false;
        this.swiper = new Promise(resolve => { this.readySwiper = resolve; });
        this.options = {};
        this.pager = false;
        this.scrollbar = false;
    }
    async optionsChanged() {
        if (this.didInit) {
            const swiper = await this.getSwiper();
            Object.assign(swiper.params, this.options);
            await this.update();
        }
    }
    componentDidLoad() {
        rIC(() => this.initSwiper());
    }
    async componentDidUnload() {
        const swiper = await this.getSwiper();
        swiper.destroy(true, true);
    }
    onSlideChanged() {
        if (this.didInit) {
            this.update();
        }
    }
    async update() {
        const swiper = await this.getSwiper();
        swiper.update();
    }
    async slideTo(index, speed, runCallbacks) {
        const swiper = await this.getSwiper();
        swiper.slideTo(index, speed, runCallbacks);
    }
    async slideNext(speed, runCallbacks) {
        const swiper = await this.getSwiper();
        swiper.slideNext(speed, runCallbacks);
    }
    async slidePrev(speed, runCallbacks) {
        const swiper = await this.getSwiper();
        swiper.slidePrev(speed, runCallbacks);
    }
    async getActiveIndex() {
        const swiper = await this.getSwiper();
        return swiper.activeIndex;
    }
    async getPreviousIndex() {
        const swiper = await this.getSwiper();
        return swiper.previousIndex;
    }
    async length() {
        const swiper = await this.getSwiper();
        return swiper.slides.length;
    }
    async isEnd() {
        const swiper = await this.getSwiper();
        return swiper.isEnd;
    }
    async isBeginning() {
        const swiper = await this.getSwiper();
        return swiper.isBeginning;
    }
    async startAutoplay() {
        const swiper = await this.getSwiper();
        if (swiper.autoplay) {
            swiper.autoplay.start();
        }
    }
    async stopAutoplay() {
        const swiper = await this.getSwiper();
        if (swiper.autoplay) {
            swiper.autoplay.stop();
        }
    }
    async lockSwipeToNext(shouldLockSwipeToNext) {
        const swiper = await this.getSwiper();
        swiper.allowSlideNext = !shouldLockSwipeToNext;
    }
    async lockSwipeToPrev(shouldLockSwipeToPrev) {
        const swiper = await this.getSwiper();
        swiper.allowSlidePrev = !shouldLockSwipeToPrev;
    }
    async lockSwipes(shouldLockSwipes) {
        const swiper = await this.getSwiper();
        swiper.allowSlideNext = !shouldLockSwipes;
        swiper.allowSlidePrev = !shouldLockSwipes;
        swiper.allowTouchMove = !shouldLockSwipes;
    }
    async initSwiper() {
        const finalOptions = this.normalizeOptions();
        const { Swiper } = await import('./swiper/swiper.bundle.js');
        const swiper = new Swiper(this.el, finalOptions);
        this.didInit = true;
        this.readySwiper(swiper);
    }
    getSwiper() {
        return this.swiper;
    }
    normalizeOptions() {
        const swiperOptions = {
            effect: 'slide',
            direction: 'horizontal',
            initialSlide: 0,
            loop: false,
            parallax: false,
            slidesPerView: 1,
            spaceBetween: 0,
            speed: 300,
            slidesPerColumn: 1,
            slidesPerColumnFill: 'column',
            slidesPerGroup: 1,
            centeredSlides: false,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
            touchEventsTarget: 'container',
            autoplay: false,
            freeMode: false,
            freeModeMomentum: true,
            freeModeMomentumRatio: 1,
            freeModeMomentumBounce: true,
            freeModeMomentumBounceRatio: 1,
            freeModeMomentumVelocityRatio: 1,
            freeModeSticky: false,
            freeModeMinimumVelocity: 0.02,
            autoHeight: false,
            setWrapperSize: false,
            zoom: {
                maxRatio: 3,
                minRatio: 1,
                toggle: true,
            },
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: true,
            shortSwipes: true,
            longSwipes: true,
            longSwipesRatio: 0.5,
            longSwipesMs: 300,
            followFinger: true,
            threshold: 0,
            touchMoveStopPropagation: true,
            touchReleaseOnEdges: false,
            iOSEdgeSwipeDetection: false,
            iOSEdgeSwipeThreshold: 20,
            resistance: true,
            resistanceRatio: 0.85,
            watchSlidesProgress: false,
            watchSlidesVisibility: false,
            preventClicks: true,
            preventClicksPropagation: true,
            slideToClickedSlide: false,
            loopAdditionalSlides: 0,
            noSwiping: true,
            runCallbacksOnInit: true,
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true
            },
            flipEffect: {
                slideShadows: true,
                limitRotation: true
            },
            cubeEffect: {
                slideShadows: true,
                shadow: true,
                shadowOffset: 20,
                shadowScale: 0.94
            },
            fadeEffect: {
                crossfade: false
            },
            a11y: {
                prevSlideMessage: 'Previous slide',
                nextSlideMessage: 'Next slide',
                firstSlideMessage: 'This is the first slide',
                lastSlideMessage: 'This is the last slide'
            }
        };
        if (this.pager) {
            swiperOptions.pagination = {
                el: this.paginationEl,
                type: 'bullets',
                clickable: false,
                hideOnClick: false,
            };
        }
        if (this.scrollbar) {
            swiperOptions.scrollbar = {
                el: this.scrollbarEl,
                hide: true,
            };
        }
        const eventOptions = {
            on: {
                init: () => {
                    setTimeout(() => {
                        this.ionSlidesDidLoad.emit();
                    }, 20);
                },
                slideChangeTransitionStart: this.ionSlideWillChange.emit,
                slideChangeTransitionEnd: this.ionSlideDidChange.emit,
                slideNextTransitionStart: this.ionSlideNextStart.emit,
                slidePrevTransitionStart: this.ionSlidePrevStart.emit,
                slideNextTransitionEnd: this.ionSlideNextEnd.emit,
                slidePrevTransitionEnd: this.ionSlidePrevEnd.emit,
                transitionStart: this.ionSlideTransitionStart.emit,
                transitionEnd: this.ionSlideTransitionEnd.emit,
                sliderMove: this.ionSlideDrag.emit,
                reachBeginning: this.ionSlideReachStart.emit,
                reachEnd: this.ionSlideReachEnd.emit,
                touchStart: this.ionSlideTouchStart.emit,
                touchEnd: this.ionSlideTouchEnd.emit,
                tap: this.ionSlideTap.emit,
                doubleTap: this.ionSlideDoubleTap.emit
            }
        };
        return Object.assign({}, swiperOptions, this.options, eventOptions);
    }
    hostData() {
        return {
            class: Object.assign({}, createThemedClasses(this.mode, 'slides'), { 'swiper-container': true })
        };
    }
    render() {
        return [
            h("div", { class: "swiper-wrapper" },
                h("slot", null)),
            this.pager && h("div", { class: "swiper-pagination", ref: el => this.paginationEl = el }),
            this.scrollbar && h("div", { class: "swiper-scrollbar", ref: el => this.scrollbarEl = el })
        ];
    }
    static get is() { return "ion-slides"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "getActiveIndex": {
            "method": true
        },
        "getPreviousIndex": {
            "method": true
        },
        "isBeginning": {
            "method": true
        },
        "isEnd": {
            "method": true
        },
        "length": {
            "method": true
        },
        "lockSwipes": {
            "method": true
        },
        "lockSwipeToNext": {
            "method": true
        },
        "lockSwipeToPrev": {
            "method": true
        },
        "mode": {
            "type": String,
            "attr": "mode"
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "watchCallbacks": ["optionsChanged"]
        },
        "pager": {
            "type": Boolean,
            "attr": "pager"
        },
        "scrollbar": {
            "type": Boolean,
            "attr": "scrollbar"
        },
        "slideNext": {
            "method": true
        },
        "slidePrev": {
            "method": true
        },
        "slideTo": {
            "method": true
        },
        "startAutoplay": {
            "method": true
        },
        "stopAutoplay": {
            "method": true
        },
        "update": {
            "method": true
        }
    }; }
    static get events() { return [{
            "name": "ionSlidesDidLoad",
            "method": "ionSlidesDidLoad",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionSlideTap",
            "method": "ionSlideTap",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionSlideDoubleTap",
            "method": "ionSlideDoubleTap",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionSlideWillChange",
            "method": "ionSlideWillChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionSlideDidChange",
            "method": "ionSlideDidChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionSlideNextStart",
            "method": "ionSlideNextStart",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionSlidePrevStart",
            "method": "ionSlidePrevStart",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionSlideNextEnd",
            "method": "ionSlideNextEnd",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionSlidePrevEnd",
            "method": "ionSlidePrevEnd",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionSlideTransitionStart",
            "method": "ionSlideTransitionStart",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionSlideTransitionEnd",
            "method": "ionSlideTransitionEnd",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionSlideDrag",
            "method": "ionSlideDrag",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionSlideReachStart",
            "method": "ionSlideReachStart",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionSlideReachEnd",
            "method": "ionSlideReachEnd",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionSlideTouchStart",
            "method": "ionSlideTouchStart",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "ionSlideTouchEnd",
            "method": "ionSlideTouchEnd",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "ionSlideChanged",
            "method": "onSlideChanged"
        }]; }
    static get style() { return "/**style-placeholder:ion-slides:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-slides:**/"; }
}

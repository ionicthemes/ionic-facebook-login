import { hapticSelectionChanged } from '../../utils';
import { clamp } from '../../utils/helpers';
export class PickerColumnCmp {
    constructor() {
        this.optHeight = 0;
        this.rotateFactor = 0;
        this.scaleFactor = 1;
        this.velocity = 0;
        this.y = 0;
        this.noAnimate = true;
    }
    componentWillLoad() {
        let pickerRotateFactor = 0;
        let pickerScaleFactor = 0.81;
        if (this.mode === 'ios') {
            pickerRotateFactor = -0.46;
            pickerScaleFactor = 1;
        }
        this.rotateFactor = pickerRotateFactor;
        this.scaleFactor = pickerScaleFactor;
    }
    async componentDidLoad() {
        const colEl = this.optsEl;
        if (colEl) {
            this.optHeight = (colEl.firstElementChild ? colEl.firstElementChild.clientHeight : 0);
        }
        this.refresh();
        this.gesture = (await import('../../utils/gesture/gesture')).createGesture({
            el: this.el,
            queue: this.queue,
            gestureName: 'picker-swipe',
            gesturePriority: 100,
            threshold: 0,
            onStart: ev => this.onStart(ev),
            onMove: ev => this.onMove(ev),
            onEnd: ev => this.onEnd(ev),
        });
        this.gesture.setDisabled(false);
        this.tmrId = setTimeout(() => {
            this.noAnimate = false;
            this.refresh(true);
        }, 250);
    }
    componentDidUnload() {
        cancelAnimationFrame(this.rafId);
        clearTimeout(this.tmrId);
    }
    setSelected(selectedIndex, duration) {
        const y = (selectedIndex > -1) ? -(selectedIndex * this.optHeight) : 0;
        this.velocity = 0;
        cancelAnimationFrame(this.rafId);
        this.update(y, duration, true);
    }
    update(y, duration, saveY) {
        if (!this.optsEl) {
            return;
        }
        let translateY = 0;
        let translateZ = 0;
        const { col, rotateFactor } = this;
        const selectedIndex = col.selectedIndex = this.indexForY(-y);
        const durationStr = (duration === 0) ? null : duration + 'ms';
        const scaleStr = `scale(${this.scaleFactor})`;
        const children = this.optsEl.children;
        for (let i = 0; i < children.length; i++) {
            const button = children[i];
            const opt = col.options[i];
            const optOffset = (i * this.optHeight) + y;
            let transform = '';
            if (rotateFactor !== 0) {
                const rotateX = optOffset * rotateFactor;
                if (Math.abs(rotateX) <= 90) {
                    translateY = 0;
                    translateZ = 90;
                    transform = `rotateX(${rotateX}deg) `;
                }
                else {
                    translateY = -9999;
                }
            }
            else {
                translateZ = 0;
                translateY = optOffset;
            }
            const selected = selectedIndex === i;
            transform += `translate3d(0px,${translateY}px,${translateZ}px) `;
            if (this.scaleFactor !== 1 && !selected) {
                transform += scaleStr;
            }
            if (this.noAnimate) {
                opt.duration = 0;
                button.style.transitionDuration = '';
            }
            else if (duration !== opt.duration) {
                opt.duration = duration;
                button.style.transitionDuration = durationStr;
            }
            if (transform !== opt.transform) {
                opt.transform = transform;
                button.style.transform = transform;
            }
            if (selected !== opt.selected) {
                opt.selected = selected;
                if (selected) {
                    button.classList.add(PICKER_OPT_SELECTED);
                }
                else {
                    button.classList.remove(PICKER_OPT_SELECTED);
                }
            }
        }
        this.col.prevSelected = selectedIndex;
        if (saveY) {
            this.y = y;
        }
        if (this.lastIndex !== selectedIndex) {
            hapticSelectionChanged();
            this.lastIndex = selectedIndex;
        }
    }
    decelerate() {
        if (this.velocity !== 0) {
            this.velocity *= DECELERATION_FRICTION;
            this.velocity = (this.velocity > 0)
                ? Math.max(this.velocity, 1)
                : Math.min(this.velocity, -1);
            let y = this.y + this.velocity;
            if (y > this.minY) {
                y = this.minY;
                this.velocity = 0;
            }
            else if (y < this.maxY) {
                y = this.maxY;
                this.velocity = 0;
            }
            this.update(y, 0, true);
            const notLockedIn = (Math.round(y) % this.optHeight !== 0) || (Math.abs(this.velocity) > 1);
            if (notLockedIn) {
                this.rafId = requestAnimationFrame(() => this.decelerate());
            }
        }
        else if (this.y % this.optHeight !== 0) {
            const currentPos = Math.abs(this.y % this.optHeight);
            this.velocity = (currentPos > (this.optHeight / 2) ? 1 : -1);
            this.decelerate();
        }
    }
    indexForY(y) {
        return Math.min(Math.max(Math.abs(Math.round(y / this.optHeight)), 0), this.col.options.length - 1);
    }
    onStart(detail) {
        detail.event.preventDefault();
        detail.event.stopPropagation();
        cancelAnimationFrame(this.rafId);
        const options = this.col.options;
        let minY = (options.length - 1);
        let maxY = 0;
        for (let i = 0; i < options.length; i++) {
            if (!options[i].disabled) {
                minY = Math.min(minY, i);
                maxY = Math.max(maxY, i);
            }
        }
        this.minY = -(minY * this.optHeight);
        this.maxY = -(maxY * this.optHeight);
    }
    onMove(detail) {
        detail.event.preventDefault();
        detail.event.stopPropagation();
        let y = this.y + detail.deltaY;
        if (y > this.minY) {
            y = Math.pow(y, 0.8);
            this.bounceFrom = y;
        }
        else if (y < this.maxY) {
            y += Math.pow(this.maxY - y, 0.9);
            this.bounceFrom = y;
        }
        else {
            this.bounceFrom = 0;
        }
        this.update(y, 0, false);
    }
    onEnd(detail) {
        if (this.bounceFrom > 0) {
            this.update(this.minY, 100, true);
            return;
        }
        else if (this.bounceFrom < 0) {
            this.update(this.maxY, 100, true);
            return;
        }
        this.velocity = clamp(-MAX_PICKER_SPEED, detail.velocityY * 23, MAX_PICKER_SPEED);
        if (this.velocity === 0 && detail.deltaY === 0) {
            const opt = detail.event.target.closest('.picker-opt');
            if (opt && opt.hasAttribute('opt-index')) {
                this.setSelected(parseInt(opt.getAttribute('opt-index'), 10), TRANSITION_DURATION);
            }
        }
        else {
            this.y += detail.deltaY;
            this.decelerate();
        }
    }
    refresh(forceRefresh) {
        let min = this.col.options.length - 1;
        let max = 0;
        const options = this.col.options;
        for (let i = 0; i < options.length; i++) {
            if (!options[i].disabled) {
                min = Math.min(min, i);
                max = Math.max(max, i);
            }
        }
        const selectedIndex = clamp(min, this.col.selectedIndex || 0, max);
        if (this.col.prevSelected !== selectedIndex || forceRefresh) {
            const y = (selectedIndex * this.optHeight) * -1;
            this.velocity = 0;
            this.update(y, TRANSITION_DURATION, true);
        }
    }
    hostData() {
        return {
            class: {
                'picker-col': true,
                'picker-opts-left': this.col.align === 'left',
                'picker-opts-right': this.col.align === 'right'
            },
            style: {
                'max-width': this.col.columnWidth
            }
        };
    }
    render() {
        const col = this.col;
        const Button = 'button';
        return [
            col.prefix && (h("div", { class: "picker-prefix", style: { width: col.prefixWidth } }, col.prefix)),
            h("div", { class: "picker-opts", style: { maxWidth: col.optionsWidth }, ref: el => this.optsEl = el }, col.options.map((o, index) => h(Button, { type: "button", class: { 'picker-opt': true, 'picker-opt-disabled': !!o.disabled }, "opt-index": index }, o.text))),
            col.suffix && (h("div", { class: "picker-suffix", style: { width: col.suffixWidth } }, col.suffix))
        ];
    }
    static get is() { return "ion-picker-column"; }
    static get properties() { return {
        "col": {
            "type": "Any",
            "attr": "col"
        },
        "el": {
            "elementRef": true
        },
        "queue": {
            "context": "queue"
        }
    }; }
}
const PICKER_OPT_SELECTED = 'picker-opt-selected';
const DECELERATION_FRICTION = 0.97;
const MAX_PICKER_SPEED = 90;
const TRANSITION_DURATION = 150;

import { transitionEnd } from './transition-end';
export const CSS_VALUE_REGEX = /(^-?\d*\.?\d*)(.*)/;
export const DURATION_MIN = 32;
export const TRANSITION_END_FALLBACK_PADDING_MS = 400;
export const TRANSFORM_PROPS = {
    'translateX': 1,
    'translateY': 1,
    'translateZ': 1,
    'scale': 1,
    'scaleX': 1,
    'scaleY': 1,
    'scaleZ': 1,
    'rotate': 1,
    'rotateX': 1,
    'rotateY': 1,
    'rotateZ': 1,
    'skewX': 1,
    'skewY': 1,
    'perspective': 1
};
const raf = window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : (f) => f(Date.now());
export class Animator {
    constructor() {
        this._hasDur = false;
        this._hasTweenEffect = false;
        this._isAsync = false;
        this._isReverse = false;
        this._destroyed = false;
        this.hasChildren = false;
        this.isPlaying = false;
        this.hasCompleted = false;
    }
    addElement(el) {
        if (el != null) {
            if (el.length > 0) {
                for (let i = 0; i < el.length; i++) {
                    this._addEl(el[i]);
                }
            }
            else {
                this._addEl(el);
            }
        }
        return this;
    }
    _addEl(el) {
        if (el.nodeType === 1) {
            (this._elements = this._elements || []).push(el);
        }
    }
    add(childAnimation) {
        childAnimation.parent = this;
        this.hasChildren = true;
        (this._childAnimations = this._childAnimations || []).push(childAnimation);
        return this;
    }
    getDuration(opts) {
        if (Animator.animated) {
            if (opts && opts.duration !== undefined) {
                return opts.duration;
            }
            else if (this._duration !== undefined) {
                return this._duration;
            }
            else if (this.parent) {
                return this.parent.getDuration();
            }
        }
        return 0;
    }
    isRoot() {
        return !this.parent;
    }
    duration(milliseconds) {
        this._duration = milliseconds;
        return this;
    }
    getEasing() {
        if (this._isReverse && this._reversedEasingName !== undefined) {
            return this._reversedEasingName;
        }
        return this._easingName !== undefined ? this._easingName : (this.parent && this.parent.getEasing()) || null;
    }
    easing(name) {
        this._easingName = name;
        return this;
    }
    easingReverse(name) {
        this._reversedEasingName = name;
        return this;
    }
    from(prop, val) {
        this._addProp('from', prop, val);
        return this;
    }
    to(prop, val, clearProperyAfterTransition = false) {
        const fx = this._addProp('to', prop, val);
        if (clearProperyAfterTransition) {
            this.afterClearStyles([fx.trans ? 'transform' : prop]);
        }
        return this;
    }
    fromTo(prop, fromVal, toVal, clearProperyAfterTransition) {
        return this.from(prop, fromVal).to(prop, toVal, clearProperyAfterTransition);
    }
    _getProp(name) {
        if (this._fxProperties) {
            return this._fxProperties.find(prop => prop.effectName === name);
        }
        return undefined;
    }
    _addProp(state, prop, val) {
        let fxProp = this._getProp(prop);
        if (!fxProp) {
            const shouldTrans = (TRANSFORM_PROPS[prop] === 1);
            fxProp = {
                effectName: prop,
                trans: shouldTrans,
                wc: (shouldTrans ? 'transform' : prop)
            };
            (this._fxProperties = this._fxProperties || []).push(fxProp);
        }
        const fxState = {
            val,
            num: 0,
            effectUnit: '',
        };
        fxProp[state] = fxState;
        if (typeof val === 'string' && val.indexOf(' ') < 0) {
            const r = val.match(CSS_VALUE_REGEX);
            if (r) {
                const num = parseFloat(r[1]);
                if (!isNaN(num)) {
                    fxState.num = num;
                }
                fxState.effectUnit = (r[0] !== r[2] ? r[2] : '');
            }
        }
        else if (typeof val === 'number') {
            fxState.num = val;
        }
        return fxProp;
    }
    beforeAddClass(className) {
        (this._beforeAddClasses = this._beforeAddClasses || []).push(className);
        return this;
    }
    beforeRemoveClass(className) {
        (this._beforeRemoveClasses = this._beforeRemoveClasses || []).push(className);
        return this;
    }
    beforeStyles(styles) {
        this._beforeStyles = styles;
        return this;
    }
    beforeClearStyles(propertyNames) {
        this._beforeStyles = this._beforeStyles || {};
        for (const prop of propertyNames) {
            this._beforeStyles[prop] = '';
        }
        return this;
    }
    beforeAddRead(domReadFn) {
        (this._readCallbacks = this._readCallbacks || []).push(domReadFn);
        return this;
    }
    beforeAddWrite(domWriteFn) {
        (this._writeCallbacks = this._writeCallbacks || []).push(domWriteFn);
        return this;
    }
    afterAddClass(className) {
        (this._afterAddClasses = this._afterAddClasses || []).push(className);
        return this;
    }
    afterRemoveClass(className) {
        (this._afterRemoveClasses = this._afterRemoveClasses || []).push(className);
        return this;
    }
    afterStyles(styles) {
        this._afterStyles = styles;
        return this;
    }
    afterClearStyles(propertyNames) {
        this._afterStyles = this._afterStyles || {};
        for (const prop of propertyNames) {
            this._afterStyles[prop] = '';
        }
        return this;
    }
    play(opts) {
        if (this._destroyed) {
            return;
        }
        this._isAsync = this._hasDuration(opts);
        this._clearAsync();
        this._playInit(opts);
        raf(() => {
            raf(() => {
                this._playDomInspect(opts);
            });
        });
    }
    playAsync(opts) {
        return new Promise(resolve => {
            this.onFinish(resolve, { oneTimeCallback: true, clearExistingCallbacks: true });
            this.play(opts);
            return this;
        });
    }
    playSync() {
        if (!this._destroyed) {
            const opts = { duration: 0 };
            this._isAsync = false;
            this._clearAsync();
            this._playInit(opts);
            this._playDomInspect(opts);
        }
    }
    _playInit(opts) {
        this._hasTweenEffect = false;
        this.isPlaying = true;
        this.hasCompleted = false;
        this._hasDur = (this.getDuration(opts) > DURATION_MIN);
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._playInit(opts);
            }
        }
        if (this._hasDur) {
            this._progress(0);
            this._willChange(true);
        }
    }
    _playDomInspect(opts) {
        this._beforeAnimation();
        const dur = this.getDuration(opts);
        if (this._isAsync) {
            this._asyncEnd(dur, true);
        }
        this._playProgress(opts);
        if (this._isAsync && !this._destroyed) {
            raf(() => {
                this._playToStep(1);
            });
        }
    }
    _playProgress(opts) {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._playProgress(opts);
            }
        }
        if (this._hasDur) {
            this._setTrans(this.getDuration(opts), false);
        }
        else {
            this._progress(1);
            this._setAfterStyles();
            this._didFinish(true);
        }
    }
    _playToStep(stepValue) {
        if (!this._destroyed) {
            const children = this._childAnimations;
            if (children) {
                for (const child of children) {
                    child._playToStep(stepValue);
                }
            }
            if (this._hasDur) {
                this._progress(stepValue);
            }
        }
    }
    _asyncEnd(dur, shouldComplete) {
        const self = this;
        function onTransitionEnd() {
            self._clearAsync();
            self._playEnd();
            self._didFinishAll(shouldComplete, true, false);
        }
        function onTransitionFallback() {
            console.debug('Animation onTransitionFallback, CSS onTransitionEnd did not fire!');
            self._timerId = undefined;
            self._clearAsync();
            self._playEnd(shouldComplete ? 1 : 0);
            self._didFinishAll(shouldComplete, true, false);
        }
        self._unregisterTrnsEnd = transitionEnd(self._transEl(), onTransitionEnd);
        self._timerId = setTimeout(onTransitionFallback, (dur + TRANSITION_END_FALLBACK_PADDING_MS));
    }
    _playEnd(stepValue) {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._playEnd(stepValue);
            }
        }
        if (this._hasDur) {
            if (stepValue !== undefined) {
                this._setTrans(0, true);
                this._progress(stepValue);
            }
            this._setAfterStyles();
            this._willChange(false);
        }
    }
    _hasDuration(opts) {
        if (this.getDuration(opts) > DURATION_MIN) {
            return true;
        }
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                if (child._hasDuration(opts)) {
                    return true;
                }
            }
        }
        return false;
    }
    _hasDomReads() {
        if (this._readCallbacks && this._readCallbacks.length > 0) {
            return true;
        }
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                if (child._hasDomReads()) {
                    return true;
                }
            }
        }
        return false;
    }
    stop(stepValue = 1) {
        this._clearAsync();
        this._hasDur = true;
        this._playEnd(stepValue);
    }
    _clearAsync() {
        if (this._unregisterTrnsEnd) {
            this._unregisterTrnsEnd();
        }
        if (this._timerId) {
            clearTimeout(this._timerId);
        }
        this._timerId = this._unregisterTrnsEnd = undefined;
    }
    _progress(stepValue) {
        let val;
        const elements = this._elements;
        const effects = this._fxProperties;
        if (!elements || elements.length === 0 || !effects || this._destroyed) {
            return;
        }
        if (this._isReverse) {
            stepValue = 1 - stepValue;
        }
        let i = 0;
        let j = 0;
        let finalTransform = '';
        let fx;
        for (i = 0; i < effects.length; i++) {
            fx = effects[i];
            if (fx.from && fx.to) {
                const fromNum = fx.from.num;
                const toNum = fx.to.num;
                const tweenEffect = (fromNum !== toNum);
                if (tweenEffect) {
                    this._hasTweenEffect = true;
                }
                if (stepValue === 0) {
                    val = fx.from.val;
                }
                else if (stepValue === 1) {
                    val = fx.to.val;
                }
                else if (tweenEffect) {
                    const valNum = (((toNum - fromNum) * stepValue) + fromNum);
                    const unit = fx.to.effectUnit;
                    val = valNum + unit;
                }
                if (val !== null) {
                    const prop = fx.effectName;
                    if (fx.trans) {
                        finalTransform += prop + '(' + val + ') ';
                    }
                    else {
                        for (j = 0; j < elements.length; j++) {
                            elements[j].style.setProperty(prop, val);
                        }
                    }
                }
            }
        }
        if (finalTransform.length > 0) {
            if (!this._isReverse && stepValue !== 1 || this._isReverse && stepValue !== 0) {
                finalTransform += 'translateZ(0px)';
            }
            for (i = 0; i < elements.length; i++) {
                elements[i].style.setProperty('transform', finalTransform);
            }
        }
    }
    _setTrans(dur, forcedLinearEasing) {
        const elements = this._elements;
        if (!elements || elements.length === 0 || !this._fxProperties) {
            return;
        }
        const easing = (forcedLinearEasing ? 'linear' : this.getEasing());
        const durString = dur + 'ms';
        for (const { style } of elements) {
            if (dur > 0) {
                style.transitionDuration = durString;
                if (easing !== null) {
                    style.transitionTimingFunction = easing;
                }
            }
            else {
                style.transitionDuration = '0';
            }
        }
    }
    _beforeAnimation() {
        this._fireBeforeReadFunc();
        this._fireBeforeWriteFunc();
        this._setBeforeStyles();
    }
    _setBeforeStyles() {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._setBeforeStyles();
            }
        }
        const elements = this._elements;
        if (!elements || elements.length === 0 || this._isReverse) {
            return;
        }
        const addClasses = this._beforeAddClasses;
        const removeClasses = this._beforeRemoveClasses;
        for (const el of elements) {
            const elementClassList = el.classList;
            if (addClasses) {
                for (const c of addClasses) {
                    elementClassList.add(c);
                }
            }
            if (removeClasses) {
                for (const c of removeClasses) {
                    elementClassList.remove(c);
                }
            }
            if (this._beforeStyles) {
                for (const [key, value] of Object.entries(this._beforeStyles)) {
                    el.style.setProperty(key, value);
                }
            }
        }
    }
    _fireBeforeReadFunc() {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._fireBeforeReadFunc();
            }
        }
        const readFunctions = this._readCallbacks;
        if (readFunctions) {
            for (const callback of readFunctions) {
                callback();
            }
        }
    }
    _fireBeforeWriteFunc() {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._fireBeforeWriteFunc();
            }
        }
        const writeFunctions = this._writeCallbacks;
        if (writeFunctions) {
            for (const callback of writeFunctions) {
                callback();
            }
        }
    }
    _setAfterStyles() {
        const elements = this._elements;
        if (!elements) {
            return;
        }
        for (const el of elements) {
            const elementClassList = el.classList;
            el.style.transitionDuration = el.style.transitionTimingFunction = '';
            if (this._isReverse) {
                const beforeAddClasses = this._beforeAddClasses;
                if (beforeAddClasses) {
                    for (const c of beforeAddClasses) {
                        elementClassList.remove(c);
                    }
                }
                const beforeRemoveClasses = this._beforeRemoveClasses;
                if (beforeRemoveClasses) {
                    for (const c of beforeRemoveClasses) {
                        elementClassList.add(c);
                    }
                }
                const beforeStyles = this._beforeStyles;
                if (beforeStyles) {
                    for (const propName of Object.keys(beforeStyles)) {
                        el.style.removeProperty(propName);
                    }
                }
            }
            else {
                const afterAddClasses = this._afterAddClasses;
                if (afterAddClasses) {
                    for (const c of afterAddClasses) {
                        elementClassList.add(c);
                    }
                }
                const afterRemoveClasses = this._afterRemoveClasses;
                if (afterRemoveClasses) {
                    for (const c of afterRemoveClasses) {
                        elementClassList.remove(c);
                    }
                }
                const afterStyles = this._afterStyles;
                if (afterStyles) {
                    for (const [key, value] of Object.entries(afterStyles)) {
                        el.style.setProperty(key, value);
                    }
                }
            }
        }
    }
    _willChange(addWillChange) {
        let wc;
        const effects = this._fxProperties;
        let willChange;
        if (addWillChange && effects) {
            wc = [];
            for (const effect of effects) {
                const propWC = effect.wc;
                if (propWC === 'webkitTransform') {
                    wc.push('transform', '-webkit-transform');
                }
                else if (propWC !== undefined) {
                    wc.push(propWC);
                }
            }
            willChange = wc.join(',');
        }
        else {
            willChange = '';
        }
        const elements = this._elements;
        if (elements) {
            for (const el of elements) {
                el.style.setProperty('will-change', willChange);
            }
        }
    }
    progressStart() {
        this._clearAsync();
        this._beforeAnimation();
        this._progressStart();
    }
    _progressStart() {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._progressStart();
            }
        }
        this._setTrans(0, true);
        this._willChange(true);
    }
    progressStep(stepValue) {
        stepValue = Math.min(1, Math.max(0, stepValue));
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child.progressStep(stepValue);
            }
        }
        this._progress(stepValue);
    }
    progressEnd(shouldComplete, currentStepValue, dur = -1) {
        if (this._isReverse) {
            currentStepValue = 1 - currentStepValue;
        }
        const stepValue = shouldComplete ? 1 : 0;
        const diff = Math.abs(currentStepValue - stepValue);
        if (dur < 0) {
            dur = this._duration || 0;
        }
        else if (diff < 0.05) {
            dur = 0;
        }
        this._isAsync = (dur > 30);
        this._progressEnd(shouldComplete, stepValue, dur, this._isAsync);
        if (this._isAsync) {
            this._asyncEnd(dur, shouldComplete);
            if (!this._destroyed) {
                raf(() => {
                    this._playToStep(stepValue);
                });
            }
        }
    }
    _progressEnd(shouldComplete, stepValue, dur, isAsync) {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._progressEnd(shouldComplete, stepValue, dur, isAsync);
            }
        }
        if (!isAsync) {
            this._progress(stepValue);
            this._willChange(false);
            this._setAfterStyles();
            this._didFinish(shouldComplete);
        }
        else {
            this.isPlaying = true;
            this.hasCompleted = false;
            this._hasDur = true;
            this._willChange(true);
            this._setTrans(dur, false);
        }
    }
    onFinish(callback, opts) {
        if (opts && opts.clearExistingCallbacks) {
            this._onFinishCallbacks = this._onFinishOneTimeCallbacks = undefined;
        }
        if (opts && opts.oneTimeCallback) {
            this._onFinishOneTimeCallbacks = this._onFinishOneTimeCallbacks || [];
            this._onFinishOneTimeCallbacks.push(callback);
        }
        else {
            this._onFinishCallbacks = this._onFinishCallbacks || [];
            this._onFinishCallbacks.push(callback);
        }
        return this;
    }
    _didFinishAll(hasCompleted, finishAsyncAnimations, finishNoDurationAnimations) {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._didFinishAll(hasCompleted, finishAsyncAnimations, finishNoDurationAnimations);
            }
        }
        if (finishAsyncAnimations && this._isAsync || finishNoDurationAnimations && !this._isAsync) {
            this._didFinish(hasCompleted);
        }
    }
    _didFinish(hasCompleted) {
        this.isPlaying = false;
        this.hasCompleted = hasCompleted;
        if (this._onFinishCallbacks) {
            for (const callback of this._onFinishCallbacks) {
                callback(this);
            }
        }
        if (this._onFinishOneTimeCallbacks) {
            for (const callback of this._onFinishOneTimeCallbacks) {
                callback(this);
            }
            this._onFinishOneTimeCallbacks.length = 0;
        }
    }
    reverse(shouldReverse = true) {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child.reverse(shouldReverse);
            }
        }
        this._isReverse = !!shouldReverse;
        return this;
    }
    destroy() {
        this._didFinish(false);
        this._destroyed = true;
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child.destroy();
            }
        }
        this._clearAsync();
        if (this._elements) {
            this._elements.length = 0;
        }
        if (this._readCallbacks) {
            this._readCallbacks.length = 0;
        }
        if (this._writeCallbacks) {
            this._writeCallbacks.length = 0;
        }
        this.parent = undefined;
        if (this._childAnimations) {
            this._childAnimations.length = 0;
        }
        if (this._onFinishCallbacks) {
            this._onFinishCallbacks.length = 0;
        }
        if (this._onFinishOneTimeCallbacks) {
            this._onFinishOneTimeCallbacks.length = 0;
        }
    }
    _transEl() {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                const targetEl = child._transEl();
                if (targetEl) {
                    return targetEl;
                }
            }
        }
        return (this._hasTweenEffect &&
            this._hasDur &&
            this._elements !== undefined &&
            this._elements.length > 0 ?
            this._elements[0] : null);
    }
}
Animator.animated = true;

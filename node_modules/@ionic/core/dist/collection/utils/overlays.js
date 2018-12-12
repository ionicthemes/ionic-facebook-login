let lastId = 0;
export function createOverlay(element, opts) {
    const doc = element.ownerDocument;
    connectListeners(doc);
    Object.assign(element, opts);
    element.classList.add('ion-page-invisible');
    const overlayIndex = lastId++;
    element.overlayIndex = overlayIndex;
    if (!element.hasAttribute('id')) {
        element.id = `ion-overlay-${overlayIndex}`;
    }
    getAppRoot(doc).appendChild(element);
    return element.componentOnReady();
}
export function connectListeners(doc) {
    if (lastId === 0) {
        lastId = 1;
        doc.addEventListener('ionBackButton', ev => {
            const lastOverlay = getOverlay(doc);
            if (lastOverlay && lastOverlay.backdropDismiss) {
                ev.detail.register(100, () => {
                    return lastOverlay.dismiss(undefined, BACKDROP);
                });
            }
        });
        doc.addEventListener('keyup', ev => {
            if (ev.key === 'Escape') {
                const lastOverlay = getOverlay(doc);
                if (lastOverlay && lastOverlay.backdropDismiss) {
                    lastOverlay.dismiss(undefined, BACKDROP);
                }
            }
        });
    }
}
export function dismissOverlay(doc, data, role, overlayTag, id) {
    const overlay = getOverlay(doc, overlayTag, id);
    if (!overlay) {
        return Promise.reject('overlay does not exist');
    }
    return overlay.dismiss(data, role);
}
export function getOverlays(doc, overlayTag) {
    const overlays = Array.from(getAppRoot(doc).children).filter(c => c.overlayIndex > 0);
    if (overlayTag === undefined) {
        return overlays;
    }
    overlayTag = overlayTag.toUpperCase();
    return overlays.filter(c => c.tagName === overlayTag);
}
export function getOverlay(doc, overlayTag, id) {
    const overlays = getOverlays(doc, overlayTag);
    return (id === undefined)
        ? overlays[overlays.length - 1]
        : overlays.find(o => o.id === id);
}
export async function present(overlay, name, iosEnterAnimation, mdEnterAnimation, opts) {
    if (overlay.presented) {
        return;
    }
    overlay.presented = true;
    overlay.willPresent.emit();
    const animationBuilder = (overlay.enterAnimation)
        ? overlay.enterAnimation
        : overlay.config.get(name, overlay.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);
    const completed = await overlayAnimation(overlay, animationBuilder, overlay.el, opts);
    if (completed) {
        overlay.didPresent.emit();
    }
}
export async function dismiss(overlay, data, role, name, iosLeaveAnimation, mdLeaveAnimation, opts) {
    if (!overlay.presented) {
        return false;
    }
    overlay.presented = false;
    try {
        overlay.willDismiss.emit({ data, role });
        const animationBuilder = (overlay.leaveAnimation)
            ? overlay.leaveAnimation
            : overlay.config.get(name, overlay.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);
        await overlayAnimation(overlay, animationBuilder, overlay.el, opts);
        overlay.didDismiss.emit({ data, role });
    }
    catch (err) {
        console.error(err);
    }
    overlay.el.remove();
    return true;
}
function getAppRoot(doc) {
    return doc.querySelector('ion-app') || doc.body;
}
async function overlayAnimation(overlay, animationBuilder, baseEl, opts) {
    if (overlay.animation) {
        overlay.animation.destroy();
        overlay.animation = undefined;
        return false;
    }
    else {
        baseEl.classList.remove('ion-page-invisible');
        const aniRoot = baseEl.shadowRoot || overlay.el;
        const animation = overlay.animation = await overlay.animationCtrl.create(animationBuilder, aniRoot, opts);
        overlay.animation = animation;
        if (!overlay.animated) {
            animation.duration(0);
        }
        if (overlay.keyboardClose) {
            animation.beforeAddWrite(() => {
                const activeElement = baseEl.ownerDocument.activeElement;
                if (activeElement && activeElement.matches('input, ion-input, ion-textarea')) {
                    activeElement.blur();
                }
            });
        }
        await animation.playAsync();
        const hasCompleted = animation.hasCompleted;
        animation.destroy();
        overlay.animation = undefined;
        return hasCompleted;
    }
}
export function autoFocus(containerEl) {
    const focusableEls = containerEl.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
    if (focusableEls.length > 0) {
        const el = focusableEls[0];
        el.focus();
        return el;
    }
    return undefined;
}
export function eventMethod(element, eventName) {
    let resolve;
    const promise = new Promise(r => resolve = r);
    onceEvent(element, eventName, (event) => {
        resolve(event.detail);
    });
    return promise;
}
export function onceEvent(element, eventName, callback) {
    const handler = (ev) => {
        element.removeEventListener(eventName, handler);
        callback(ev);
    };
    element.addEventListener(eventName, handler);
}
export function isCancel(role) {
    return role === 'cancel' || role === BACKDROP;
}
export const BACKDROP = 'backdrop';

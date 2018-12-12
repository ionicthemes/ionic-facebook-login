const SKIP_SELECTOR = 'input, textarea, [no-blur]';
export function enableInputBlurring(doc) {
    console.debug('Input: enableInputBlurring');
    let focused = true;
    let didScroll = false;
    function onScroll() {
        didScroll = true;
    }
    function onFocusin() {
        focused = true;
    }
    function onTouchend(ev) {
        if (didScroll) {
            didScroll = false;
            return;
        }
        const active = doc.activeElement;
        if (!active) {
            return;
        }
        if (active.matches(SKIP_SELECTOR)) {
            return;
        }
        const tapped = ev.target;
        if (tapped === active) {
            return;
        }
        if (tapped.matches(SKIP_SELECTOR) || tapped.closest(SKIP_SELECTOR)) {
            return;
        }
        focused = false;
        setTimeout(() => {
            if (!focused) {
                active.blur();
            }
        }, 50);
    }
    doc.addEventListener('ionScrollStart', onScroll);
    doc.addEventListener('focusin', onFocusin, true);
    doc.addEventListener('touchend', onTouchend, false);
    return () => {
        doc.removeEventListener('ionScrollStart', onScroll, true);
        doc.removeEventListener('focusin', onFocusin, true);
        doc.removeEventListener('touchend', onTouchend, false);
    };
}
